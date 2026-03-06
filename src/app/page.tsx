import Link from "next/link";
import { getAllPrototypes } from "@/lib/kv";

export const revalidate = 60;

export default async function Home() {
  const prototypes = await getAllPrototypes();

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-28 text-center">
        <h1
          className="text-5xl md:text-7xl tracking-tight leading-[1.1]"
          style={{ fontFamily: "var(--font-display), serif" }}
        >
          今日も、誰かの<br />入り口が生まれた。
        </h1>
        <p className="mt-6 text-base md:text-lg text-[#777] max-w-lg leading-relaxed">
          AIが毎日1業種のWebサイトを自動生成。<br />
          気に入ったら依頼するだけ。
        </p>
        <a
          href="#gallery"
          className="mt-12 text-xs tracking-[0.2em] text-[#999] hover:text-[#262626] transition uppercase"
        >
          ↓ scroll
        </a>
      </section>

      {/* Gallery */}
      <section id="gallery" className="max-w-6xl mx-auto px-6 pb-24">
        {prototypes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#999] text-base">
              まだプロトタイプはありません。<br />
              明日の朝7時に最初のプロトタイプが生成されます。
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[#C5BFB5]">
            {prototypes.map((p, i) => (
              <div
                key={p.slug}
                className="bg-[#DBD6CD] p-6 group hover:bg-[#D3CEC4] transition-colors"
              >
                {/* Number */}
                <span className="text-[11px] tracking-wider text-[#999]">
                  #{String(i + 1).padStart(2, "0")}
                </span>

                {/* Thumbnail - 控えめ */}
                <Link href={`/works/${p.slug}`} className="block mt-3">
                  <div className="aspect-video rounded overflow-hidden bg-[#262626] relative">
                    <iframe
                      srcDoc={p.html}
                      className="w-[300%] h-[300%] origin-top-left pointer-events-none"
                      style={{ transform: "scale(0.3333)" }}
                      sandbox=""
                      title={p.genre}
                    />
                  </div>
                </Link>

                {/* Info */}
                <h3
                  className="mt-4 text-xl text-[#262626]"
                  style={{ fontFamily: "var(--font-display), serif" }}
                >
                  {p.genre}
                </h3>
                <p className="mt-1 text-sm text-[#888] italic">
                  {p.tagline}
                </p>

                {/* Date */}
                <p className="mt-3 text-[11px] text-[#AAA] tracking-wider">
                  {new Date(p.createdAt).toLocaleDateString("ja-JP")}
                </p>

                {/* Actions */}
                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/works/${p.slug}`}
                    className="text-xs px-4 py-2 border border-[#262626] text-[#262626] rounded-full hover:bg-[#262626] hover:text-[#DBD6CD] transition"
                  >
                    見る
                  </Link>
                  <Link
                    href={`/contact?ref=${p.slug}`}
                    className="text-xs px-4 py-2 bg-[#D73C3C] text-white rounded-full hover:bg-[#c03535] transition"
                  >
                    依頼する
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
