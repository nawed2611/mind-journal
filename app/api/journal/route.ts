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
      "Anime art of misato katsuragi, detailed scene, stunning details, trending on artstation, vintage 90's anime artwork. surrealism, akira. anime comic manga style art. {{content}}, heroic by osamu tezuka, manga style",
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

  // update the entry on vector db supabase
  await fetch("/api/story", {
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

  console.log("imageResponse", imageResponse);
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
    console.log("downloadURL", downloadURL);
  } else {
    // Handle the error
    console.error(imageResponse.status);
    NextResponse.json({ error: "Error while uploading image:))" });
  }

  body.imageURL = downloadURL;

  // create the journal on pscale
  const response = await fetch(
    `https://closedbadvirus.nawedali.repl.co/journal`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  return NextResponse.json(
    {
      message: "Journal created successfully",
      imageURL: downloadURL,
      data: await response.json(),
    },
    { status: 200 },
  );
}

export async function GET(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.redirect("/sign-in");
  }

  let response = await fetch(
    `https://closedbadvirus.nawedali.repl.co/journal/`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  const responseData = await response.json();

  return NextResponse.json(responseData);
}
