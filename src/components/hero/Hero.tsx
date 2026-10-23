"use client";
import dynamic from "next/dynamic";
import { PROFILE } from "@/lib/data";
import { HERO } from "@/lib/hero";
import PortraitFallback from "./PortraitFallback";
import { asset } from "@/lib/asset";
import { scrollToTarget } from "@/lib/scroll";
import Button from "@/components/ui/Button";

/* Both stages are client-only and loaded on demand, so picking "video" keeps
   three.js out of the bundle entirely rather than merely deferring it. */
const VideoStage = dynamic(() => import("./VideoStage"), { ssr: false });
const AvatarStage = dynamic(() => import("./AvatarStage"), { ssr: false });

function Stage() {
  if (HERO.media === "avatar3d") return <AvatarStage />;
  if (HERO.media === "portrait") return <PortraitFallback />;
  return <VideoStage />;
}

export default function Hero() {
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToTarget(id);
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <section id="hero" className="hero" aria-label="Introduction">
      <div className="hero-ghost" aria-hidden="true">
        {PROFILE.firstName.toUpperCase()}
      </div>

      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-eyebrow rv">
            <span className="hero-chip">
              <img src={asset("/brand/india-post-logo.png")} alt="" aria-hidden="true" width={30} height={19} />
              <b className="deva">{PROFILE.companyHi}</b>
            </span>
            <span className="mono">
              {PROFILE.role} <i aria-hidden="true">·</i> {PROFILE.dept}
            </span>
          </p>

          <h1 className="hero-h1">
            <span className="rv-mask" style={{ ["--i" as string]: 1 }}>
              <span>Software</span>
            </span>
            <span className="rv-mask" style={{ ["--i" as string]: 2 }}>
              <span>
                <span className="accent">Developer.</span>
              </span>
            </span>
          </h1>

          <div className="hero-cta rv" style={{ ["--i" as string]: 3 }}>
            <Button href="#work" onClick={go("work")}>
              Explore work
            </Button>
            <Button href="#contact" onClick={go("contact")} variant="secondary">
              Let&apos;s talk
            </Button>
            <Button href={PROFILE.resume} variant="secondary" download="Gyandeep-Aryan-Resume.pdf">
              Résumé ↓
            </Button>
          </div>
        </div>

        <div className="hero-stage">
          <Stage />
        </div>

        <div className="hero-meta rv" style={{ ["--i" as string]: 4 }}>
          <p className="mono">Since {PROFILE.since}</p>
          <p className="mono">{PROFILE.location}</p>
          <span className="tiranga hero-meta-flag" aria-hidden="true" />
        </div>
      </div>

      <style>{`
        .hero { position: relative; overflow: clip; padding-top: calc(var(--nav-h) + 8px); min-height: 100svh; }
        .hero-ghost { position: absolute; left: 50%; top: calc(var(--nav-h) + 2svh); transform: translateX(-50%); z-index: 0;
          font-weight: 800; letter-spacing: -0.05em; line-height: .8; font-size: clamp(90px, 20vw, 330px);
          color: #eadfdb; user-select: none; pointer-events: none; white-space: nowrap; }
        .hero-grid { position: relative; width: 100%; max-width: calc(var(--max) + var(--gutter) * 2); margin-inline: auto;
          padding-inline: var(--gutter); display: grid; grid-template-columns: 1fr; justify-items: center; }

        .hero-stage { position: relative; order: 1; width: min(100%, 420px); aspect-ratio: 4 / 5; }

        .hero-copy { order: 2; position: relative; z-index: 2; width: 100%; margin-top: 8px; padding-bottom: 56px; text-align: left; }
        .hero-eyebrow { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 14px; margin-bottom: 18px;
          font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--mute); }
        .hero-eyebrow i { font-style: normal; color: var(--ip-red); }
        .hero-chip { display: inline-flex; align-items: center; gap: 7px; height: 30px; padding: 0 12px 0 9px; border-radius: 999px;
          background: #fff; box-shadow: inset 0 0 0 1px var(--line); }
        .hero-chip img { width: 30px; height: 19px; object-fit: contain; }
        .hero-chip b { font-size: 12px; font-weight: 700; color: var(--ip-red-ink); text-transform: none; letter-spacing: 0; }

        .hero-h1 { font-weight: 700; letter-spacing: -0.045em; line-height: 1; font-size: clamp(44px, 12vw, 64px); }
        .hero-h1 .accent { font-size: 1.05em; }
        .hero-cta { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
        .hero-meta { display: none; }

        @media (min-width: 900px) {
          .hero { display: flex; align-items: flex-end; }
          .hero-grid { grid-template-columns: minmax(0,1fr) auto minmax(0,1fr); align-items: end; column-gap: clamp(8px, 2vw, 32px); }
          .hero-stage { order: 0; width: min(46vw, 620px); height: min(88svh, 860px); aspect-ratio: auto;
            margin-inline: calc(-1 * clamp(0px, 5vw, 90px)); }
          .hero-copy { order: 0; margin-top: 0; padding-bottom: clamp(40px, 9svh, 110px); }
          .hero-h1 { font-size: clamp(44px, 4.6vw, 84px); }
          .hero-meta { position: relative; z-index: 2; display: grid; gap: 6px; justify-self: end; justify-items: end; text-align: right;
            padding-bottom: clamp(40px, 9svh, 110px); font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--mute); }
          .hero-meta-flag { width: 54px; margin-top: 6px; border-radius: 2px; }
        }
      `}</style>
    </section>
  );
}
