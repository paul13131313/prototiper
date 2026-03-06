import type { Metadata } from "next";
import { Playfair_Display, Noto_Sans_JP } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const notoSans = Noto_Sans_JP({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "PROTOTIPER — AIが毎日つくるWebサイト見本市",
  description:
    "AIが毎日1業種のWebサイトを自動生成。気に入ったら依頼するだけ。制作費5万円〜、納期1〜2週間。",
  metadataBase: new URL("https://prototiper.vercel.app"),
  openGraph: {
    title: "PROTOTIPER — AIが毎日つくるWebサイト見本市",
    description:
      "AIが毎日1業種のWebサイトを自動生成。気に入ったら依頼するだけ。",
    images: ["/ogp.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${playfair.variable} ${notoSans.variable} antialiased`}
        style={{ fontFamily: "var(--font-body), sans-serif" }}
      >
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#DBD6CD]/90 backdrop-blur border-b border-[#C5BFB5]">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl tracking-tight text-[#262626]"
              style={{ fontFamily: "var(--font-display), serif" }}
            >
              PROTOTIPER
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/#gallery"
                className="text-sm text-[#666] hover:text-[#262626] transition"
              >
                Gallery
              </Link>
              <Link
                href="/contact"
                className="text-sm px-5 py-2 bg-[#D73C3C] text-white rounded-full font-medium hover:bg-[#c03535] transition"
              >
                依頼する
              </Link>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <div className="pt-16">{children}</div>

        {/* Footer */}
        <footer className="bg-[#262626] text-[#DBD6CD]">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3
                  className="text-lg tracking-tight"
                  style={{ fontFamily: "var(--font-display), serif" }}
                >
                  PROTOTIPER
                </h3>
                <p className="mt-2 text-sm text-[#999]">
                  AIが毎日つくるWebサイト見本市
                </p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-[#999] uppercase tracking-wider mb-3">
                  対応範囲
                </h4>
                <ul className="text-sm text-[#BBB] space-y-1">
                  <li>コーポレートサイト・LP・採用サイト</li>
                  <li>問い合わせフォーム付きサイト</li>
                  <li>制作費 5万円〜 / 納期 1〜2週間</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-medium text-[#999] uppercase tracking-wider mb-3">
                  注意事項
                </h4>
                <ul className="text-sm text-[#BBB] space-y-1">
                  <li>掲載サイトはAI自動生成のプロトタイプです</li>
                  <li>実在の企業・人物とは無関係です</li>
                  <li>やりとりはメールのみ</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-[#444] text-center">
              <p className="text-xs text-[#777]">
                © {new Date().getFullYear()} PROTOTIPER by Paul. AI生成: Claude
                by Anthropic.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
