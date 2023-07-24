import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.redirect("/sign-in");
  }
  const body = await request.json();
  body.userId = userId;
  console.log(body);

  const response = await fetch("http://localhost:3001/journal/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  console.log(response);

  return NextResponse.json(response);
}

export async function GET(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.redirect("/sign-in");
  }

  const response = await fetch(`http://localhost:3001/journal/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(response);

  return NextResponse.json(response);
}
