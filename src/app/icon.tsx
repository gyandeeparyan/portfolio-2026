import { ImageResponse } from "next/og";
import { PROFILE } from "@/lib/data";

export const dynamic = "force-static"; // required by output: export
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon: the India Post red, with initials. Generated at build time. */
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
          background: "#c62829",
          color: "#fff",
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          borderRadius: 14,
        }}
      >
        {PROFILE.initials}
      </div>
    ),
    size,
  );
}
