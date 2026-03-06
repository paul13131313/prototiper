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
    // 過去の業種リスト＆使用済み写真IDを取得
    const slugs = await getPrototypeList();
    const pastGenres: string[] = [];
    const usedPhotoIds: string[] = [];
    for (const slug of slugs) {
      const p = await getPrototype(slug);
      if (p) {
        pastGenres.push(p.genre);
        // HTMLからUnsplash写真IDを抽出
        const photoMatches = p.html.matchAll(/unsplash\.com\/photo-([\w-]+)/g);
        for (const m of photoMatches) {
          if (!usedPhotoIds.includes(m[1])) usedPhotoIds.push(m[1]);
        }
      }
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
- デザインに凝る（余白・タイポグラフィ・色のコントラストを意識）

# キービジュアル写真（重要）
- ヒーローセクションには必ず大きなキービジュアル写真を配置すること
- 写真はUnsplash Sourceを使用: https://images.unsplash.com/photo-{ID}?w=1200&h=800&fit=crop
- 業種に合った写真を選ぶこと。以下は使用可能なUnsplash写真IDの例：
  - 飲食/カフェ: 1511920170033-f8bf9b0f3ef4, 1554118811-1e0d58224f24, 1414235077428-338989a2e8c0
  - 医療/健康: 1519494026892-80bbd2d6fd0d, 1576091160399-112ba8d25d1d, 1631217868264-e5b90bb7e133
  - 教育: 1523050854058-8df90110c9f1, 1427504350979-a2cbecb29bfa, 1503676260728-1c00da094a0b
  - 自然/農業: 1500595046743-cd271d694d30, 1416879595882-3373a0480b5b, 1464226184884-fa280b87c399
  - 旅館/宿泊: 1540541338287-41700207dee6, 1542314831-e87e75b7125b, 1571896349842-33c89424de2d
  - 建築/不動産: 1486406146926-c627a92ad1ab, 1449157291145-7efd050a4d0e, 1487958449943-2429e8be8625
  - テクノロジー: 1518770660439-4636190af475, 1504384764586-bb4cdc1812f0, 1531297484001-80022131f5a1
  - 美容/ファッション: 1522335789203-aabd1fc54bc9, 1487412912498-0447578fcca8, 1519699047748-de8e457a634e
  - スポーツ/フィットネス: 1534438327276-14e5300c3a48, 1571019613454-1cb2f99b2d8b, 1517836357463-d25dfeac3438
- 上記以外の業種でも、Unsplashの実在する写真IDを使うこと
- 絶対に他のプロトタイプと同じ写真を使わないこと
${usedPhotoIds.length > 0 ? `- 以下の写真IDは既に使用済みなので絶対に使わないこと: ${usedPhotoIds.join(", ")}` : ""}
- キービジュアルはヒーロー全幅で、最低height:60vhの大きさで配置
- object-fit: coverでトリミング
- 写真の上にオーバーレイ（半透明の色やグラデーション）をかけてテキストを読みやすくする`;

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
