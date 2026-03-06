import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
    images: ["/api/og"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} font-sans antialiased bg-gray-950`}>
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur border-b border-gray-800/50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-white tracking-wider">
              PROTOTIPER
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/#gallery"
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Gallery
              </Link>
              <Link
                href="/contact"
                className="text-sm px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                問い合わせ
              </Link>
            </div>
          </div>
        </nav>

        {/* Main content with nav offset */}
        <div className="pt-16">{children}</div>

        {/* Footer */}
        <footer className="bg-gray-900 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-bold text-lg">PROTOTIPER</h3>
                <p className="mt-2 text-sm text-gray-500">
                  AIが毎日つくるWebサイト見本市
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">対応範囲</h4>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>コーポレートサイト・LP・採用サイト</li>
                  <li>問い合わせフォーム付きサイト</li>
                  <li>制作費 5万円〜 / 納期 1〜2週間</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">注意事項</h4>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>掲載サイトはAI自動生成のプロトタイプです</li>
                  <li>実在の企業・人物とは無関係です</li>
                  <li>やりとりはメールのみ</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center">
              <p className="text-xs text-gray-600">
                © {new Date().getFullYear()} PROTOTIPER by Paul. AI生成: Claude by Anthropic.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
