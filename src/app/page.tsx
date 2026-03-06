import Link from "next/link";
import { getAllPrototypes } from "@/lib/kv";

export const revalidate = 60;

export default async function Home() {
  const prototypes = await getAllPrototypes();

  return (
    <main className="min-h-screen">
      {/* Intro + Gallery */}
      <section className="max-w-7xl mx-auto px-6 pt-6 pb-24">
        {/* Intro copy — 左寄せ、小さく */}
        <p className="text-xs text-[#999] leading-relaxed max-w-xs mb-8">
          AI制作のホームページ見本サイトです。毎日新しいサイトを自動的につくっています。気に入ったらご連絡ください。
        </p>

        {prototypes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#999] text-sm">
              まだプロトタイプはありません。<br />
              明日の朝7時に最初のプロトタイプが生成されます。
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {prototypes.map((p, i) => (
              <Link
                key={p.slug}
                href={`/works/${p.slug}`}
                className="group block"
              >
                {/* Thumbnail 16:9 */}
                <div className="aspect-video rounded-lg overflow-hidden bg-[#C5BFB5] relative shadow-sm group-hover:shadow-md transition-shadow">
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ pointerEvents: "none" }}
                  >
                    <iframe
                      srcDoc={p.html}
                      className="border-0"
                      style={{
                        width: "1440px",
                        height: "810px",
                        transform: "scale(0.25)",
                        transformOrigin: "top left",
                      }}
                      sandbox="allow-same-origin allow-scripts"
                      title={p.genre}
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="mt-3 flex items-baseline justify-between">
                  <h3
                    className="text-sm text-[#262626] group-hover:text-[#D73C3C] transition-colors"
                    style={{ fontFamily: "var(--font-display), serif" }}
                  >
                    {p.genre}
                  </h3>
                  <span className="text-[10px] text-[#BBB] tracking-wider">
                    #{String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-[#999] italic truncate">
                  {p.tagline}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
