import { NextRequest, NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const text = body.text;
  const userId = body.userId;
  try {
    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE_KEY!,
    );

    const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkSize: 256,
      chunkOverlap: 20,
    });

    const splitDocuments: any = await splitter.createDocuments([text]);

    // splitDocuments is an array and add userId to each document
    splitDocuments.forEach((doc) => {
      doc.userId = userId;
    });

    const vectorstore = await SupabaseVectorStore.fromDocuments(
      splitDocuments,
      new OpenAIEmbeddings(),
      {
        client,
        tableName: "documents",
        queryName: "match_documents",
      },
    );

    return NextResponse.json(vectorstore, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
