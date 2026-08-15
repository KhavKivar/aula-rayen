import { ImageResponse } from "next/og";

export const alt =
  "Aula Rayen, talleres listos para profesionales de la psicología";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#294944",
          color: "#fffdf8",
          display: "flex",
          height: "100%",
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 68px",
            width: "70%",
          }}
        >
          <div style={{ color: "#f0c972", display: "flex", fontSize: 28 }}>
            Aula Rayen
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 68, fontWeight: 700, letterSpacing: "-3px", lineHeight: 1.05 }}>
              Talleres con propósito,
            </div>
            <div style={{ color: "#f2dca8", fontSize: 60, lineHeight: 1.12 }}>
              listos para la práctica.
            </div>
          </div>
          <div style={{ color: "rgba(255,255,255,.7)", display: "flex", fontSize: 24 }}>
            Formación y materiales para profesionales de la psicología
          </div>
        </div>
        <div style={{ background: "#d98968", display: "flex", position: "relative", width: "30%" }}>
          <div style={{ background: "#f0c972", borderRadius: "999px", height: 260, position: "absolute", right: -70, top: -55, width: 260 }} />
          <div style={{ background: "#e6eee9", borderRadius: "48% 52% 60% 40%", bottom: 70, height: 220, left: 48, position: "absolute", transform: "rotate(-12deg)", width: 160 }} />
        </div>
      </div>
    ),
    size,
  );
}
