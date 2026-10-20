import { ImageResponse } from "next/og";

// 180x180 home-screen icon for iPhone / iPad
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#222F55" }}>
        <svg width="120" height="120" viewBox="0 0 64 64">
          <path d="M32 12 10 31h6.5v20h12V40h7v11h12V31H54L32 12z" fill="#00BF63" />
          <rect x="28.5" y="40" width="7" height="11" fill="#222F55" />
        </svg>
      </div>
    ),
    size
  );
}
