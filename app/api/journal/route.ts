import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

let BACKEND_URL = "";

if (process.env.ENV !== "production") {
  BACKEND_URL = "http://localhost:3000/";
} else {
  BACKEND_URL = "https://mind-journal-production.up.railway.app/";
}

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.redirect("/sign-in");
  }
  const body = await request.json();
  body.userId = userId;

  const response = await fetch(
    `https://mind-journal-production.up.railway.app/journal`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  console.log(response);

  return NextResponse.json(response);
}

export async function GET(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.redirect("/sign-in");
  }

  const response = await fetch(
    `https://mind-journal-production.up.railway.app/journal/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  console.log(response);

  return NextResponse.json(response);
}
