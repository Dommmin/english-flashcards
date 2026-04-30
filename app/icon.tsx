import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "112px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "340px",
            height: "256px",
            background: "#161624",
            borderRadius: "32px",
            border: "3px solid rgba(255,255,255,0.08)",
            boxShadow: "0 0 0 1px rgba(99,102,241,0.3)",
          }}
        >
          <span
            style={{
              fontSize: "148px",
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
