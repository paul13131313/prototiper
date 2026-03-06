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

# デザインスタイルカタログ
以下の18種類のデザインスタイルから、選んだ業種に最も合うものを1つ選び、そのカラー・フォント・レイアウトを忠実に適用してください。

01. Locomotive Bold — 大胆テクニカル: primary:#202DED, accent:#FF6B5B, bg:#FFFFFF, font:Playfair Display + Satoshi
02. Topology Prism — 3Dダーク: primary:#FFFFFF, accent:#C8A0FF, bg:#0A0A0A, font:Cormorant Garamond + Space Mono
03. Antonsson Noir — 漆黒ミニマル: primary:#000000, text:#FFFFFF, bg:#000000, font:Playfair Display + Inter
04. Gander Warmth — 温もりクリーム: primary:#171717, accent:#FFC29B, bg:#FFF4ED, font:Crimson Pro + Source Serif 4
05. Planetono Carnival — ポップ赤黄: primary:#EB3322, accent:#FFC737, bg:#EB3322, font:Unbounded + Poppins
06. Sileent Cinema — モノクロ映像: primary:#FFFFFF, bg:#000000, font:DM Sans
07. Good Fella Craft — 職人ダーク+オレンジ: primary:#141314, accent:#FD551D, font:Space Grotesk + JetBrains Mono
08. Foundrline Signal — スタートアップ: primary:#030406, accent:#FF6600, bg:#EFEEEC, font:General Sans + Chivo Mono
09. Upvege Harvest — ナチュラル野菜: primary:#00CE01, bg:#FFFFEE, font:Josefin Sans + Noto Sans JP
10. Sentinel Guard — コーポレート映像: primary:#1C1D1F, accent:#FF0000, bg:#F7F5F0, font:Inter + Noto Sans JP
11. Pastel Dimension — パステルファッション: primary:#4457AF, accent:#E24266, bg:#C8D4EE, font:Bodoni Moda + Libre Franklin
12. Morohoshi Playfield — グレー+オレンジ青: primary:#1F61F7, accent:#FF5C24, bg:#E5E5E5, font:Inter + Noto Sans JP
13. Seiwa Quiet Clay — 静謐ベージュ: primary:#1A1A1A, bg:#E4E0DC, font:Noto Serif JP + Cormorant Garamond
14. Shueisha Mosaic — エネルギッシュ採用: primary:#1A1919, accent:#E61A7C, bg:#F8F8F8, font:Space Grotesk + Noto Sans JP
15. Sakuma Broadcast — レトロTV: primary:#202020, accent:#C2F542, bg:#2B3240, font:Montserrat + Share Tech Mono
16. Ships Grid Journal — エディトリアル: primary:#262626, accent:#D73C3C, bg:#DBD6CD, font:Playfair Display + Noto Sans JP
17. Ganymede Volt — ネオン電撃: primary:#010101, accent:#CEFF00, bg:#F1F1F1, font:Inter + Noto Sans JP
18. Maigawara Spiral — 和風作家: primary:#000000, accent:#FF9966, bg:#F3EFE7, font:Noto Serif JP + Manrope

# 出力形式（JSON）
以下のJSON形式のみを出力してください。JSONの前後に説明文やコードブロック囲みは不要です。
{
  "genre": "業種名（日本語）",
  "slug": "url-safe-slug",
  "tagline": "キャッチコピー（20文字以内）",
  "style": "選んだスタイル名（例: Gander Warmth）",
  "html": "完全なHTML（Tailwind CDN + Google Fonts使用、1ファイル完結、日本語コンテンツ）"
}

# HTMLの条件
- Tailwind CSS CDN使用
- 選んだデザインスタイルのカラーパレットを忠実に使う
- 選んだデザインスタイルのGoogle Fontsを<link>タグで読み込んで使う
- 架空の会社名・商品名・電話番号を使用
- PC/SPレスポンシブ対応
- ナビ・ヒーロー・サービス説明・CTAセクションを含める
- 200行程度のシンプルな構成
- 問い合わせフォームは見た目だけでよい（実際には動かない）
- デザインに凝る（余白・タイポグラフィ・色のコントラストを意識）`;

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
