import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0c14",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "120px",
            height: "90px",
            background: "#161624",
            borderRadius: "12px",
            border: "2px solid rgba(255,255,255,0.08)",
          }}
        >
          <span
            style={{
              fontSize: "52px",
              fontWeight: 800,
              color: "#6366f1",
              lineHeight: 1,
              fontFamily: "sans-serif",
            }}
          >
            F
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
