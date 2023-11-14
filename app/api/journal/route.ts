import { auth } from "@clerk/nextjs";
import { ImageResponse, NextResponse } from "next/server";
import { PromptTemplate } from "langchain/prompts";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage";
import { initializeApp } from "firebase/app";
import prisma from "@/lib/prisma";

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
const { userId } = auth();

export async function POST(request: Request) {
  if (!userId) {
    return NextResponse.redirect("/sign-in");
  }
  const body = await request.json();
  body.id = userId;

  console.log("body", body);

  // update the entry on vector db supabase
  await fetch("http://localhost:3000/api/story", {
    method: "POST",
    body: JSON.stringify({
      text: body.content,
      userId: userId,
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

    // Convert the response to a Blob
    const imageArrayBuffer = await imageResponse.arrayBuffer();

    // Now you have the binary image data in the 'imageArrayBuffer' variable
    // You can convert it to Uint8Array if needed
    const imageBytes = new Uint8Array(imageArrayBuffer);

    // Create a reference to the image
    const storage = getStorage();

    const imageRef = ref(storage, "images/" + userId + Date.now() + ".png");

    // Upload the image to Cloud Storage
    const snapshot = await uploadBytes(imageRef, imageBytes);

    // Get the download URL
    downloadURL = await getDownloadURL(imageRef);
  } else {
    // Handle the error
    console.error(imageResponse.status);
    NextResponse.json({ error: "Error while uploading image:))" });
  }

  body.imageURL = downloadURL;
  body.date = new Date().toISOString();
  let journal = null;

  // create the journal on pscale
  try {
    journal = await prisma.journal.create({
      data: {
        content: body.content,
        title: body.title,
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

export async function GET(request: Request) {
  // const { userId } = auth();
  let journals = [];

  // if (!userId) {
  //   return NextResponse.redirect("/sign-in");
  // }

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
