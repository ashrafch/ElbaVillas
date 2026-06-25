import { ImageResponse } from "next/og"

export const alt = "Elba Luce Villas"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#172522",
          color: "#f7f1e7",
          padding: "64px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: 6, textTransform: "uppercase", opacity: 0.72 }}>
          Isola d&apos;Elba
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, lineHeight: 0.95 }}>Elba Luce Villas</div>
          <div style={{ marginTop: 28, width: 760, fontSize: 34, lineHeight: 1.25, opacity: 0.82 }}>
            Residenze contemporanee tra mare, pietra e macchia mediterranea.
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, fontSize: 20, letterSpacing: 3, textTransform: "uppercase" }}>
          <span>9 ville</span>
          <span>Vista mare</span>
          <span>Disponibilita limitata</span>
        </div>
      </div>
    ),
    size
  )
}
