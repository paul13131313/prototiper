import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { name, email, site, message } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "お名前とメールアドレスは必須です" },
        { status: 400 }
      );
    }

    // 管理者への通知メール
    await resend.emails.send({
      from: process.env.FROM_EMAIL || "PROTOTIPER <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL || "hiroshinagano0113@gmail.com",
      subject: `[PROTOTIPER] ${name}さんからのお問い合わせ`,
      text: `お名前: ${name}
メールアドレス: ${email}
気になったサイト: ${site || "未指定"}

要望・メモ:
${message || "なし"}

---
送信日時: ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`,
    });

    // 送信者への自動返信
    await resend.emails.send({
      from: process.env.FROM_EMAIL || "PROTOTIPER <onboarding@resend.dev>",
      to: email,
      subject: "【PROTOTIPER】お問い合わせを受け付けました",
      text: `${name} 様

お問い合わせありがとうございます。
以下の内容で受け付けました。

---
気になったサイト: ${site || "未指定"}
要望・メモ: ${message || "なし"}
---

2営業日以内にご連絡いたします。

PROTOTIPER
https://prototiper.vercel.app`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "メール送信に失敗しました" },
      { status: 500 }
    );
  }
}
