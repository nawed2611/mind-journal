import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.redirect("/sign-in");
  }

  const body = await request.json();

  const response = await fetch("http://localhost:3000", {
    method: "POST",
    body: JSON.stringify({
      name: body.name,
      email: body.email,
      id: userId,
    }),
  });

  return NextResponse.json(await response.json());
}

export async function GET(request: NextRequest) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.redirect("/sign-in");
  }

  let response = await fetch("http://localhost:3000", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const responseData = await response.json();

  return NextResponse.json(responseData);
}
