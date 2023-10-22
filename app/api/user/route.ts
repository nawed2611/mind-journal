import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api";

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.redirect("/sign-in");
  }
  const body = await request.json();

  const response = await fetch(BACKEND_URL, {
    method: "POST",
    body: JSON.stringify({
      name: body.name,
      email: body.email,
      id: userId,
    }),
  });

  return NextResponse.json(await response.json());
}

export async function GET(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.redirect("/sign-in");
  }

  let response = await fetch(BACKEND_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const responseData = await response.json();

  return NextResponse.json(responseData);
}
