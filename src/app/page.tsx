import Link from "next/link";
import { getAllPrototypes } from "@/lib/kv";

export const revalidate = 60;

export default async function Home() {
  const prototypes = await getAllPrototypes();

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
          今日も、誰かの入り口が<br />生まれた。
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl">
          AIが毎日1業種のWebサイトを自動生成。<br className="hidden md:block" />
          気に入ったら依頼するだけ。
        </p>
        <a
          href="#gallery"
          className="mt-10 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition"
        >
          <span>↓ scroll</span>
        </a>
      </section>

      {/* Gallery */}
      <section id="gallery" className="max-w-7xl mx-auto px-6 pb-24">
        {prototypes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              まだプロトタイプはありません。<br />
              明日の朝7時に最初のプロトタイプが生成されます。
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prototypes.map((p) => (
              <div
                key={p.slug}
                className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-600 transition group"
              >
                <div className="aspect-video bg-gray-800 relative overflow-hidden">
                  <iframe
                    srcDoc={p.html}
                    className="w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none"
                    sandbox=""
                    title={p.genre}
                  />
                </div>
                <div className="p-5">
                  <span className="inline-block text-xs font-medium bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full">
                    {p.genre}
                  </span>
                  <p className="mt-3 text-sm text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString("ja-JP")}
                  </p>
                  <p className="mt-1 text-gray-300 text-sm">{p.tagline}</p>
                  <div className="mt-4 flex gap-3">
                    <Link
                      href={`/works/${p.slug}`}
                      className="flex-1 text-center text-sm py-2 rounded-lg bg-white text-gray-900 font-medium hover:bg-gray-200 transition"
                    >
                      このサイトを見る
                    </Link>
                    <Link
                      href={`/contact?ref=${p.slug}`}
                      className="flex-1 text-center text-sm py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition"
                    >
                      制作を依頼する
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
