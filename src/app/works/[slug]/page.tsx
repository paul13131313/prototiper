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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header bar */}
      <div className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              ← 一覧に戻る
            </Link>
            <span className="text-xs bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full">
              {prototype.genre}
            </span>
          </div>
          <Link
            href={`/contact?ref=${slug}`}
            className="text-sm px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            このイメージでつくってほしい
          </Link>
        </div>
      </div>

      {/* Prototype iframe */}
      <div className="w-full" style={{ height: "calc(100vh - 120px)" }}>
        <iframe
          srcDoc={prototype.html}
          className="w-full h-full border-0"
          sandbox="allow-scripts"
          title={prototype.genre}
        />
      </div>

      {/* Info bar */}
      <div className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-xs text-gray-500 uppercase tracking-wider">業種</h3>
              <p className="mt-1 text-white">{prototype.genre}</p>
            </div>
            <div>
              <h3 className="text-xs text-gray-500 uppercase tracking-wider">料金目安</h3>
              <p className="mt-1 text-white">5万円〜</p>
            </div>
            <div>
              <h3 className="text-xs text-gray-500 uppercase tracking-wider">納期目安</h3>
              <p className="mt-1 text-white">1〜2週間</p>
            </div>
            <div>
              <h3 className="text-xs text-gray-500 uppercase tracking-wider">生成日</h3>
              <p className="mt-1 text-white">
                {new Date(prototype.createdAt).toLocaleDateString("ja-JP")}
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-600">
              ※ このプロトタイプはAI（Claude by Anthropic）が自動生成したものです。
              実在の企業・人物とは無関係です。実制作時はオリジナルコンテンツに差し替えます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
