import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
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
  const multipleInputPrompt = new PromptTemplate({
    inputVariables: ["content"],
    template:
      "Anime art of misato katsuragi from neon genesis evangelion, detailed scene, stunning details, trending on artstation, rainy day, ray-traced environment, vintage 90's anime artwork. In the style of 90's vintage anime, surrealism, akira. anime line art. Misato katsuragi is writing journals everyday and she wrote the following journal entry: {{content}}. Take this content and generate an image of misato katsuragi's day and make it heroic.",
  });

  const imagePrompt = await multipleInputPrompt.format({
    content: body.content,
  });

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

  // check if response is ok
  if (!imageResponse.ok) {
    return NextResponse.json(
      {
        message: "Error creating image",
      },
      { status: 500 },
    );
  }

  // upload the image to firebase storage
  const storage = getStorage();
  const storageRef = ref(storage, `images/${userId}/${Date.now()}`);
  const imageBlob = await imageResponse.blob();

  const imageFile = new File([imageBlob], "image.png", { type: "image/png" });

  console.log("imageResponse", imageBlob);

  const uploadTask = uploadBytesResumable(storageRef, imageFile);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      // Handle unsuccessful uploads
    },
    () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);
      });
    },
  );

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
