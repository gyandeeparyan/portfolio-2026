import { asset } from "@/lib/asset";
import { PROFILE } from "@/lib/data";

/** Shown whenever the hero has no media to render: no clip built, no .glb in
 *  place, WebGL unavailable, or a load that failed. Never an empty box. */
export default function PortraitFallback({ hint }: { hint?: "video" | "avatar" }) {
  return (
    <div className="pf">
      <div className="pf-frame">
        {PROFILE.portrait && <img src={asset(PROFILE.portrait)} alt={`Portrait of ${PROFILE.name}`} width={340} height={425} />}
        <span className="pf-initials" aria-hidden="true">
          {PROFILE.initials}
        </span>
      </div>
      {/* {hint === "video" && (
        <p className="pf-hint mono">
          Record a 10s <code>intro.mp4</code>, run <code>scripts/build-hero-assets.py</code>, then set <code>HERO.video</code> — see <code>HERO-VIDEO.md</code>
        </p>
      )} */}
      {hint === "avatar" && (
        <p className="pf-hint mono">
          Add <code>public/avatar/avatar.glb</code> to switch this to 3D — see <code>AVATAR.md</code>
        </p>
      )}

      <style>{`
        .pf { position: relative; width: 100%; height: 100%; display: grid; place-items: center; align-content: center; gap: 14px; }
        .pf-frame { position: relative; width: min(78%, 330px); aspect-ratio: 4 / 5; border-radius: 18px; overflow: hidden;
          box-shadow: 0 40px 70px -34px rgba(124,23,24,.4), inset 0 0 0 1px var(--line); background: var(--soft); }
        .pf-frame img { position: relative; z-index: 1; width: 100%; height: 100%; object-fit: cover; }
        .pf-initials { position: absolute; inset: 0; z-index: 0; display: grid; place-items: center;
          background: repeating-linear-gradient(135deg, #f1efe9 0 14px, #e9e6de 14px 28px);
          color: var(--faint); font: 700 clamp(56px, 9vw, 96px)/1 var(--f-sans), sans-serif; letter-spacing: -.04em; }
        .pf-hint { max-width: 36ch; text-align: center; font-size: 11px; line-height: 1.6; color: var(--mute); }
        .pf-hint code { background: var(--soft); border-radius: 4px; padding: 1px 5px; font-size: 10.5px; }
      `}</style>
    </div>
  );
}
