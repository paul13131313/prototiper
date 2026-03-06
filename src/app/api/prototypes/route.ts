import { NextResponse } from "next/server";
import { getAllPrototypes } from "@/lib/kv";

export async function GET() {
  try {
    const prototypes = await getAllPrototypes();
    return NextResponse.json({ prototypes });
  } catch (error) {
    console.error("Prototypes list error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
