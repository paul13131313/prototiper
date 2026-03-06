import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const genre = searchParams.get("genre") || "PROTOTIPER";
  const tagline = searchParams.get("tagline") || "AIが毎日つくるWebサイト見本市";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 24,
            color: "#60a5fa",
            letterSpacing: "0.2em",
            marginBottom: 20,
            display: "flex",
          }}
        >
          PROTOTIPER
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            textAlign: "center",
            maxWidth: "80%",
            lineHeight: 1.3,
            display: "flex",
          }}
        >
          {genre}
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#9ca3af",
            marginTop: 20,
            display: "flex",
          }}
        >
          {tagline}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
