import { NextRequest, NextResponse } from "next/server";
import { deletePrototype } from "@/lib/kv";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  try {
    // 指定プロトタイプを削除
    await deletePrototype(slug);

    // 新しいプロトタイプを1件生成
    const res = await fetch(new URL("/api/generate-prototype", req.url), {
      headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
    });
    const data = await res.json();

    return NextResponse.json({ success: true, deleted: slug, generated: data });
  } catch (error) {
    console.error("Replace error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
