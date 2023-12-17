import { getAuth } from "@clerk/nextjs/server";
import { ImageResponse, NextRequest, NextResponse } from "next/server";
import { PromptTemplate } from "langchain/prompts";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage";
import {
  RetrievalQAChain,
  ConversationalRetrievalQAChain,
} from "langchain/chains";
import { initializeApp } from "firebase/app";
import prisma from "@/lib/prisma";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAI } from "langchain";

const firebaseConfig = {
  apiKey: "AIzaSyBomm_HTJdb18yfBm3oEo9n6S6KT5OHtZ0",
  authDomain: "mind-jo.firebaseapp.com",
  projectId: "mind-jo",
  storageBucket: "mind-jo.appspot.com",
  messagingSenderId: "98472360003",
  appId: "1:98472360003:web:42953b3f10f4415ebd3cf6",
  measurementId: "G-X0Z1J57004",
};
initializeApp(firebaseConfig);

const generatePrompt = async (content: string) => {
  const multipleInputPrompt = new PromptTemplate({
    inputVariables: ["content"],
    template:
      "Anime art of misato katsuragi, detailed scene, stunning details, trending on artstation, vintage 90's anime artwork. surrealism, akira. anime comic manga style art. {{content}}, heroic by osamu tezuka, manga style",
  });

  const imagePrompt = await multipleInputPrompt.format({
    content: content,
  });

  return imagePrompt;
};

export async function POST(request: NextRequest) {
  const userId = getAuth(request).userId;
  const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY! });

  if (!userId) {
    return NextResponse.redirect("/sign-in");
  }

  const body = await request.json();
  body.id = userId;

  // update the entry on vector db supabase
  await fetch("http://localhost:3000/api/story", {
    method: "POST",
    body: JSON.stringify({
      text: body.content,
      userId,
    }),
  });

  // create the prompt using template
  const imagePrompt = await generatePrompt(body.content);

  // call the clipdrop API
  let bodyContent = new FormData();
  bodyContent.append("prompt", imagePrompt);

  let imageResponse = await fetch("https://clipdrop-api.co/text-to-image/v1", {
    method: "POST",
    headers: {
      body: "multipart/form-data",
      "x-api-key": process.env.CLIPDROP_API_KEY,
    },
    body: bodyContent,
  });

  let downloadURL = "";

  if (imageResponse.ok) {
    const contentType = imageResponse.headers.get("content-type");
    if (contentType !== "image/png") {
      return NextResponse.json({ error: "Error not an image" });
    }
    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const imageBytes = new Uint8Array(imageArrayBuffer);
    const storage = getStorage();
    const imageRef = ref(storage, "images/" + userId + Date.now() + ".png");
    const snapshot = await uploadBytes(imageRef, imageBytes);
    downloadURL = await getDownloadURL(imageRef);
    console.log("File available at", downloadURL);
  } else {
    console.error(imageResponse.status);
    NextResponse.json({ error: "Error while uploading image:))" });
  }

  body.imageURL = downloadURL;
  body.date = new Date().toISOString();
  let journal = null;

  // create the journal on supabase vector store
  try {
    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE_KEY!,
    );

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 200,
      chunkOverlap: 50,
    });

    const docs = await textSplitter.createDocuments([body.content]);

    const vectorStore = await SupabaseVectorStore.fromDocuments(
      docs,
      new OpenAIEmbeddings(),
      {
        client,
        tableName: "documents",
        queryName: "match_documents",
      },
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e });
  }

  // create the journal on pscale
  try {
    journal = await prisma.journal.create({
      data: {
        content: body.content,
        title:
          body.content.split("\n")[0].length > 50
            ? body.content.split("\n")[0].slice(0, 50) + "..."
            : body.content.split("\n")[0],
        imageURL: body.imageURL,
        userId: body.id,
      },
    });
    console.log("journal", journal);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e });
  }

  return NextResponse.json(
    {
      message: "Journal created successfully",
      journal,
    },
    { status: 200 },
  );
}

export async function GET(request: NextRequest) {
  const userId = getAuth(request).userId;
  let journals = [];

  if (!userId) {
    return NextResponse.redirect("/sign-in");
  }
  try {
    journals = await prisma.journal.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e });
  }

  return NextResponse.json({
    message: "Journals fetched successfully",
    journals,
  });
}
