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
