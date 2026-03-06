import Link from "next/link";
import { notFound } from "next/navigation";
import { getPrototype } from "@/lib/kv";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function WorksDetailPage({ params }: Props) {
  const { slug } = await params;
  const prototype = await getPrototype(slug);

  if (!prototype) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Header bar */}
      <div className="sticky top-16 z-40 bg-[#DBD6CD]/90 backdrop-blur border-b border-[#C5BFB5]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-[#888] hover:text-[#262626] transition"
            >
              ← 一覧に戻る
            </Link>
            <span
              className="text-sm text-[#262626]"
              style={{ fontFamily: "var(--font-display), serif" }}
            >
              {prototype.genre}
            </span>
          </div>
          <Link
            href={`/contact?ref=${slug}`}
            className="text-sm px-5 py-2 bg-[#D73C3C] text-white rounded-full font-medium hover:bg-[#c03535] transition"
          >
            このイメージでつくってほしい
          </Link>
        </div>
      </div>

      {/* Prototype iframe */}
      <div className="w-full bg-white" style={{ height: "calc(100vh - 120px)" }}>
        <iframe
          srcDoc={prototype.html}
          className="w-full h-full border-0"
          sandbox="allow-scripts"
          title={prototype.genre}
        />
      </div>

      {/* Info bar */}
      <div className="bg-[#262626] text-[#DBD6CD]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-[11px] text-[#999] uppercase tracking-wider">業種</h3>
              <p className="mt-1">{prototype.genre}</p>
            </div>
            <div>
              <h3 className="text-[11px] text-[#999] uppercase tracking-wider">料金目安</h3>
              <p className="mt-1">5万円〜</p>
            </div>
            <div>
              <h3 className="text-[11px] text-[#999] uppercase tracking-wider">納期目安</h3>
              <p className="mt-1">1〜2週間</p>
            </div>
            <div>
              <h3 className="text-[11px] text-[#999] uppercase tracking-wider">生成日</h3>
              <p className="mt-1">
                {new Date(prototype.createdAt).toLocaleDateString("ja-JP")}
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-[#444]">
            <p className="text-xs text-[#777]">
              ※ このプロトタイプはAI（Claude by Anthropic）が自動生成したものです。
              実在の企業・人物とは無関係です。実制作時はオリジナルコンテンツに差し替えます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
