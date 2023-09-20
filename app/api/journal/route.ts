import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

let BACKEND_URL = "";

if (process.env.ENV !== "production") {
  BACKEND_URL = "http://localhost:3001/";
} else {
  BACKEND_URL = "https://mind-journal-production.up.railway.app/";
}

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.redirect("/sign-in");
  }
  const body = await request.json();
  body.id = userId;

  // update the entry on vector db supabase
  const response2 = await fetch("/api/story", {
    method: "POST",
    body: JSON.stringify({
      text: body.content,
    }),
  });

  // create the image using stability
  fetch(`http://localhost:3001/story`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      // buffer here is a binary representation of the returned image
      // you can use it as you wish e.g. turn into a blob and upload to S3

      // create a blob from the array buffer

      const blob = new Blob([buffer], { type: "image/png" });

      // create a FormData instance
      const formData = new FormData();

      // append the blob
      formData.append("file", blob, "image.png");

      // or simply append a file
      // formData.append("file", file);

      // POST the blob using XHR
      const xhr = new XMLHttpRequest();

      xhr.open("POST", "http://localhost:3001/story");

      xhr.onload = () => {
        console.log(xhr.responseText);
      };

      xhr.send(formData);
    });

  // get the image response

  // create the journal on pscale
  const response = await fetch(`http://localhost:3001/journal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return NextResponse.json(response);
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
