import Link from "next/link";
import { getAllPrototypes } from "@/lib/kv";

export const revalidate = 60;

export default async function Home() {
  const prototypes = await getAllPrototypes();

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1
          className="text-4xl md:text-5xl tracking-tight leading-[1.2]"
          style={{ fontFamily: "var(--font-display), serif" }}
        >
          PROTOTIPER
        </h1>
        <p className="mt-8 text-sm md:text-base text-[#666] max-w-md leading-[2]">
          AI制作のホームページ見本サイトです。<br />
          毎日新しいサイトを自動的につくっています。<br />
          ご自身の業態に近いものを見て、<br />
          気に入ったらご連絡ください。
        </p>
        <a
          href="#gallery"
          className="mt-10 text-[11px] tracking-[0.2em] text-[#AAA] hover:text-[#262626] transition uppercase"
        >
          ↓ scroll
        </a>
      </section>

      {/* Gallery */}
      <section id="gallery" className="max-w-6xl mx-auto px-6 pb-24">
        {prototypes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#999] text-sm">
              まだプロトタイプはありません。<br />
              明日の朝7時に最初のプロトタイプが生成されます。
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[1px] bg-[#C5BFB5]">
            {prototypes.map((p, i) => (
              <Link
                key={p.slug}
                href={`/works/${p.slug}`}
                className="bg-[#DBD6CD] p-4 group hover:bg-[#D3CEC4] transition-colors block"
              >
                {/* Number */}
                <span className="text-[10px] tracking-wider text-[#BBB]">
                  #{String(i + 1).padStart(2, "0")}
                </span>

                {/* Thumbnail - 小さく控えめ、スクショ風 */}
                <div className="mt-2 aspect-[4/3] rounded overflow-hidden bg-[#262626] relative">
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ pointerEvents: "none" }}
                  >
                    <iframe
                      srcDoc={p.html}
                      className="border-0"
                      style={{
                        width: "1200px",
                        height: "900px",
                        transform: "scale(0.16)",
                        transformOrigin: "top left",
                      }}
                      sandbox="allow-same-origin allow-scripts"
                      title={p.genre}
                    />
                  </div>
                </div>

                {/* Info */}
                <h3
                  className="mt-3 text-sm text-[#262626]"
                  style={{ fontFamily: "var(--font-display), serif" }}
                >
                  {p.genre}
                </h3>
                <p className="mt-0.5 text-[11px] text-[#999] italic truncate">
                  {p.tagline}
                </p>
                <p className="mt-2 text-[10px] text-[#BBB] tracking-wider">
                  {new Date(p.createdAt).toLocaleDateString("ja-JP")}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
