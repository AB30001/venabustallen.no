import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE, BRAND } from "@/lib/seo";

export const runtime = "edge";
export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * OG image — ImageResponse with live SITE_NAME / SITE_TAGLINE text.
 * Mark is drawn with CSS shapes (same horse silhouette idea as logo-mark.svg)
 * so we avoid Windows @vercel/og file-URL bugs when loading local fonts/PNGs.
 */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `linear-gradient(145deg, ${BRAND.primary} 0%, ${BRAND.dark} 100%)`,
          padding: 60,
          position: "relative",
          overflow: "hidden"
        }}>
        {/* Low-opacity mark watermark */}
        <div
          style={{
            position: "absolute",
            right: -40,
            bottom: -80,
            width: 360,
            height: 360,
            borderRadius: 48,
            background: BRAND.accent,
            opacity: 0.15,
            display: "flex"
          }}
        />

        {/* Lockup: icon tile + wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28
          }}>
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 22,
              background: BRAND.light,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
            {/* Simplified horse: ear + head + muzzle */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                marginLeft: 4
              }}>
              <div
                style={{
                  width: 14,
                  height: 26,
                  background: BRAND.primary,
                  borderRadius: 3,
                  marginLeft: 10,
                  transform: "rotate(-18deg)",
                  marginBottom: -4
                }}
              />
              <div
                style={{
                  width: 54,
                  height: 34,
                  background: BRAND.primary,
                  borderRadius: "8px 28px 22px 14px",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 14
                }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    background: BRAND.light
                  }}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: BRAND.light,
              letterSpacing: "-1.2px",
              lineHeight: 1
            }}>
            {SITE_NAME}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 980,
            gap: 18
          }}>
          <div
            style={{
              fontSize: 34,
              fontWeight: 600,
              color: BRAND.accent,
              lineHeight: 1.35,
              letterSpacing: "-0.3px"
            }}>
            {SITE_TAGLINE}
          </div>
          <div
            style={{
              fontSize: 22,
              color: BRAND.light,
              opacity: 0.65
            }}>
            venabustallen.no
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
