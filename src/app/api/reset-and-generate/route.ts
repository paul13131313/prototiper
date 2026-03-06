import { NextRequest, NextResponse } from "next/server";
import { deleteAllPrototypes } from "@/lib/kv";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 全プロトタイプを削除
    await deleteAllPrototypes();

    // 5件生成（generate-prototype APIを内部呼び出し）
    const results = [];
    for (let i = 0; i < 5; i++) {
      const res = await fetch(new URL("/api/generate-prototype", req.url), {
        headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
      });
      const data = await res.json();
      results.push(data);
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
