import { PromptTemplate } from "langchain/prompts";
import { createClient } from "@supabase/supabase-js";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  SupabaseFilterRPCCall,
  SupabaseVectorStore,
} from "langchain/vectorstores/supabase";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "langchain/schema/runnable";
import {
  BytesOutputParser,
  StringOutputParser,
} from "langchain/schema/output_parser";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

type ConversationalRetrievalQAChainInput = {
  question: string;
  chat_history: VercelChatMessage[];
};

const combineDocumentsFn = (docs: Document[], separator = "\n\n") => {
  console.log("docs", docs);
  const serializedDocs = docs.map((doc: any) => doc.pageContent);
  return serializedDocs.join(separator);
};

const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
  const formattedDialogueTurns = chatHistory.map((message) => {
    if (message.role === "user") {
      return `Human: ${message.content}`;
    } else if (message.role === "assistant") {
      return `Assistant: ${message.content}`;
    } else {
      return `${message.role}: ${message.content}`;
    }
  });
  return formattedDialogueTurns.join("\n");
};

const model = new ChatOpenAI({
  modelName: "gpt-4o",
});

const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.
Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;
const condenseQuestionPrompt = PromptTemplate.fromTemplate(
  CONDENSE_QUESTION_TEMPLATE,
);

const ANSWER_TEMPLATE = `You are an AI assistant helping a human with their journaling. Be direct and answer only on the context, the human has asked you the following question:

Answer the question based only on the following context:
{context}

Question: {question}
`;

const client = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_PRIVATE_KEY!,
);

const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);

export async function POST(request: Request) {
  const body = await request.json();

  const text = body.question;
  const messages = body.chats ?? [];

  const previousMessages = messages.slice(0, -1);
  const currentMessageContent = text;

  console.log("previousMessages", previousMessages);
  console.log("currentMessageContent", currentMessageContent);

  const vectorStore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
    client,
    tableName: "documents",
    queryName: "match_documents",
  });

  const retriever = vectorStore.asRetriever();

  const standaloneQuestionChain = RunnableSequence.from([
    {
      question: (input: ConversationalRetrievalQAChainInput) => input.question,
      chat_history: (input: ConversationalRetrievalQAChainInput) =>
        formatVercelMessages(input.chat_history),
    },
    condenseQuestionPrompt,
    model,
    new StringOutputParser(),
  ]);

  const answerChain = RunnableSequence.from([
    {
      context: retriever.pipe(combineDocumentsFn as any),
      question: new RunnablePassthrough(),
    },
    answerPrompt,
    model,
    new BytesOutputParser(),
  ]);

  const conversationalRetrievalQAChain =
    standaloneQuestionChain.pipe(answerChain);

  const stream = await conversationalRetrievalQAChain.stream({
    question: currentMessageContent,
    chat_history: previousMessages,
  });

  return new StreamingTextResponse(stream);
}
