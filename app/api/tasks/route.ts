import { NextResponse } from "next/server";
import { getTasks } from "@/lib/actions";

export async function GET() {
  const tasks = await getTasks();
  return NextResponse.json(tasks);
}
