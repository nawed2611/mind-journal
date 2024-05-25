import { ImageResponse, NextRequest, NextResponse } from "next/server";
import { PromptTemplate } from "langchain/prompts";
import {
  RetrievalQAChain,
  ConversationalRetrievalQAChain,
} from "langchain/chains";
import prisma from "@/lib/prisma";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAI } from "langchain";
import { Configuration, OpenAIApi } from "openai";

export async function POST(request: NextRequest) {
  const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY! });
  const openaiClient = new OpenAIApi(
    new Configuration({ apiKey: process.env.OPENAI_API_KEY! }),
  );

  try {
    const body = await request.json();
    body.date = new Date().toISOString();
    body.userId = "lol"; // TODO: get user id from Auth
    let journal = null;

    const privateKey = process.env.SUPABASE_PRIVATE_KEY;
    if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

    const url = process.env.SUPABASE_URL;
    if (!url) throw new Error(`Expected env var SUPABASE_URL`);

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 200,
      chunkOverlap: 50,
    });

    const docs = await textSplitter.createDocuments([body.content]);

    for (const document of docs) {
      const newMetadata = { id: "user id here" };
      document.metadata = { ...document.metadata, ...newMetadata };

      const embeddingResponse = await openaiClient.createEmbedding({
        model: "text-embedding-ada-002",
        input: document.pageContent,
      });

      const [{ embedding }] = embeddingResponse.data.data;

      let documentResponse = await prisma.documents.create({
        data: {
          content: document.pageContent,
          embedding: embedding,
          metadata: document.metadata,
        } as any,
      });

      console.log("documentResponse", documentResponse);
    }

    journal = await prisma.journals.create({
      data: {
        content: body.content,
        title:
          body.content.split("\n")[0].length > 50
            ? body.content.split("\n")[0].slice(0, 50) + "..."
            : body.content.split("\n")[0],
      },
    });

    return NextResponse.json(
      {
        message: "Journal created successfully",
        journal,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.error();
  }
}

export async function GET(request: NextRequest) {
  let journals = [];
  try {
    journals = await prisma.journals.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.log(e);
    return NextResponse.error();
  }

  return NextResponse.json({
    message: "Journals fetched successfully",
    journals,
  });
}
