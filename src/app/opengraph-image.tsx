import { ImageResponse } from "next/og";
import { PROFILE } from "@/lib/data";

export const dynamic = "force-static"; // required by output: export
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${PROFILE.name} — ${PROFILE.role}, ${PROFILE.dept}`;

/** Link-preview card. Generated at build time, so it ships with the static export.
 *  Plain Latin text only: no font file is bundled, so Devanagari would not render. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f6f3ed",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* tricolour rule */}
        <div style={{ display: "flex", position: "absolute", top: 0, left: 0, right: 0, height: 10 }}>
          <div style={{ flex: 1, background: "#ff9933" }} />
          <div style={{ flex: 1, background: "#ffffff" }} />
          <div style={{ flex: 1, background: "#138808" }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "#c62829",
              color: "#fff",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            {PROFILE.initials}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#7d1718" }}>India Post</div>
            <div style={{ fontSize: 17, color: "#6d6961" }}>Department of Posts · Ministry of Communications</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 86, fontWeight: 700, letterSpacing: "-0.04em", color: "#141210", lineHeight: 1 }}>{PROFILE.name}</div>
          <div style={{ fontSize: 46, fontWeight: 400, color: "#c62829", marginTop: 14, letterSpacing: "-0.02em" }}>{PROFILE.role}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 22, color: "#6d6961" }}>
          <div style={{ display: "flex" }}>{PROFILE.location}</div>
          <div style={{ display: "flex" }}>{PROFILE.githubHandle}</div>
        </div>
      </div>
    ),
    size,
  );
}
