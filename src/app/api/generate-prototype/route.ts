import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { savePrototype, getPrototypeList, getPrototype } from "@/lib/kv";

export async function GET(req: NextRequest) {
  // Cron認証
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 過去の業種リストを取得
    const slugs = await getPrototypeList();
    const pastGenres: string[] = [];
    for (const slug of slugs) {
      const p = await getPrototype(slug);
      if (p) pastGenres.push(p.genre);
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const prompt = `あなたはWebデザイナーです。
以下の条件でWebサイトのプロトタイプを1件生成してください。

# 業種
これまでの業種リスト: ${pastGenres.length > 0 ? pastGenres.join("、") : "（まだなし）"}
上記とかぶらず、日本で需要がありそうな業種を1つ選んでください。
例：ゴルフウェア通販、整体院、地方酒造、保育園、建設会社、ITスタートアップ採用、など

# 出力形式（JSON）
以下のJSON形式のみを出力してください。JSONの前後に説明文やコードブロック囲みは不要です。
{
  "genre": "業種名（日本語）",
  "slug": "url-safe-slug",
  "tagline": "キャッチコピー（20文字以内）",
  "html": "完全なHTML（Tailwind CDN使用、1ファイル完結、日本語コンテンツ）"
}

# HTMLの条件
- Tailwind CSS CDNのみ使用（外部画像は使わない）
- 架空の会社名・商品名・電話番号を使用
- PC/SPレスポンシブ対応
- ナビ・ヒーロー・サービス説明・CTAセクションを含める
- 200行程度のシンプルな構成
- 問い合わせフォームは見た目だけでよい（実際には動かない）
- 色使いは業種に合ったもの
- Google Fontsは使わない（system-ui, sans-serifを使用）`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    // JSONをパース（コードブロック囲みがある場合も対応）
    let jsonStr = text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const data = JSON.parse(jsonStr);

    const prototype = {
      slug: data.slug,
      genre: data.genre,
      tagline: data.tagline,
      html: data.html,
      createdAt: new Date().toISOString(),
    };

    await savePrototype(prototype);

    return NextResponse.json({
      success: true,
      slug: prototype.slug,
      genre: prototype.genre,
    });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
