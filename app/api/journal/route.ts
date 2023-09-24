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
import axios from "axios";

let BACKEND_URL = "";

if (process.env.ENV !== "production") {
  BACKEND_URL = "http://localhost:3001/";
} else {
  BACKEND_URL = "https://mind-journal-production.up.railway.app/";
}

const generatePrompt = async (content: string) => {
  const multipleInputPrompt = new PromptTemplate({
    inputVariables: ["content"],
    template:
      "Anime art of misato katsuragi from neon genesis evangelion, detailed scene, stunning details, trending on artstation, rainy day, ray-traced environment, vintage 90's anime artwork. In the style of 90's vintage anime, surrealism, akira. anime line art. Misato katsuragi is writing journals everyday and she wrote the following journal entry: {{content}}. Take this content and generate an image of misato katsuragi's day and make it heroic.",
  });

  const imagePrompt = await multipleInputPrompt.format({
    content: content,
  });

  return imagePrompt;
};

export async function POST(request: Request) {
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

  if (!userId) {
    return NextResponse.redirect("/sign-in");
  }
  const body = await request.json();
  body.id = userId;

  // // update the entry on vector db supabase
  // const vectorResponse = await fetch("http://localhost:3000/api/story", {
  //   method: "POST",
  //   body: JSON.stringify({
  //     text: body.content,
  //     userId: userId,
  //   }),
  // });

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

  console.log("imageResponse", imageResponse);

  if (imageResponse.ok) {
    const contentType = imageResponse.headers.get("content-type");
    if (contentType !== "image/png") {
      return NextResponse.json({ error: "Error not an image" });
    }

    // Convert the response to a Blob
    const imageBlob = await imageResponse.blob();

    console.log("imageBlob", imageBlob);

    // Create a reference to the image
    const storage = getStorage();
    const imageRef = ref(storage, "images/" + userId);

    // Upload the image to Cloud Storage
    const snapshot = await uploadBytes(imageRef, imageBlob);
    console.log("Uploaded a blob or file!", snapshot);
  } else {
    // Handle the error
    console.error(imageResponse.status);

    NextResponse.json({ error: "Error" });
  }

  // // create the journal on pscale
  // const response = await fetch(`http://localhost:3001/journal`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(body),
  // });

  return NextResponse.json(
    {
      message: "Journal created successfully",
    },
    { status: 200 },
  );
}

export async function GET(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.redirect("/sign-in");
  }

  let response = await fetch(`http://localhost:3001/journal/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const responseData = await response.json();

  return NextResponse.json(responseData);
}
