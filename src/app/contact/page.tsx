"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function ContactForm() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [site, setSite] = useState(ref);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, site, message }),
      });

      if (!res.ok) throw new Error("送信に失敗しました");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-white">送信完了</h2>
        <p className="mt-4 text-gray-400">
          お問い合わせありがとうございます。<br />
          確認メールをお送りしました。2営業日以内にご連絡いたします。
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-sm text-blue-400 hover:text-blue-300 transition"
        >
          ← トップに戻る
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm text-gray-400 mb-2">
          お名前 <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
        />
      </div>

      <div>
        <label htmlFor="site" className="block text-sm text-gray-400 mb-2">
          気になったサイト
        </label>
        <input
          id="site"
          type="text"
          value={site}
          onChange={(e) => setSite(e.target.value)}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
          placeholder="例: golf-wear-shop"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm text-gray-400 mb-2">
          要望・メモ
        </label>
        <textarea
          id="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition resize-none"
          placeholder="ご要望があればお書きください"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "送信中..." : "送信する"}
      </button>

      {status === "error" && (
        <p className="text-red-400 text-sm text-center">
          送信に失敗しました。時間をおいて再度お試しください。
        </p>
      )}
    </form>
  );
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-white transition"
        >
          ← トップに戻る
        </Link>

        <h1 className="mt-8 text-3xl font-bold">お問い合わせ</h1>
        <p className="mt-4 text-gray-400">
          気になったプロトタイプがあれば、お気軽にご連絡ください。
        </p>

        <div className="mt-10">
          <Suspense fallback={<div className="text-gray-500">読み込み中...</div>}>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
