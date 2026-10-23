"use client";
import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { HERO, heroVideoSources } from "@/lib/hero";
import { prefersReducedMotion } from "@/lib/hooks";
import PortraitFallback from "./PortraitFallback";

/**
 * The reference site's hero treatment.
 *
 * The clip is shot against a white backdrop and levelled in post so the backdrop
 * reaches near-pure white. `mix-blend-mode: darken` then keeps only pixels darker
 * than the paper behind it, which cuts the subject out with no alpha channel and
 * no green screen — and costs nothing at runtime.
 *
 * It loops silently by default. The button plays it through once with sound, then
 * freezes on the first frame.
 */
export default function VideoStage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const reduced = useRef(false);
  const visible = useRef(true);
  /* idle: silent ambient loop · playing: intro running once with sound · stopped: finished */
  const mode = useRef<"idle" | "playing" | "stopped">("idle");

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    reduced.current = prefersReducedMotion();
    v.muted = true;
    v.loop = true;
    if (reduced.current) v.pause();
    else v.play().catch(() => {});

    const onEnded = () => {
      mode.current = "stopped";
      v.pause();
      v.currentTime = 0;
      v.muted = true;
      setSoundOn(false);
    };
    v.addEventListener("ended", onEnded);

    /* Pause when mostly out of view, resume on return unless it has been stopped. */
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.intersectionRatio >= 0.35;
        if (!visible.current) v.pause();
        else if (mode.current === "playing" || (mode.current === "idle" && !reduced.current)) v.play().catch(() => {});
      },
      { threshold: [0, 0.35, 1] },
    );
    io.observe(v);
    return () => {
      v.removeEventListener("ended", onEnded);
      io.disconnect();
    };
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (mode.current === "playing") {
      mode.current = "stopped";
      v.pause();
      v.currentTime = 0;
      v.muted = true;
      setSoundOn(false);
      return;
    }
    mode.current = "playing";
    v.loop = false;
    v.muted = false;
    v.currentTime = 0;
    v.play()
      .then(() => setSoundOn(true))
      .catch(() => {
        mode.current = "stopped";
        v.muted = true;
        setSoundOn(false);
      });
  };

  /* No clip built yet — show the still portrait rather than an empty box. */
  if (!HERO.video) return <PortraitFallback hint="video" />;

  const src = heroVideoSources(HERO.video);

  return (
    <div className="vs-stage">
      <video
        ref={videoRef}
        className="vs-video"
        muted
        playsInline
        preload="auto"
        aria-label={`Looping portrait of ${PROFILE.name}`}
      >
        <source src={src.webm} type="video/webm" />
        <source src={src.mp4} type="video/mp4" />
      </video>

      {HERO.sound && (
        <button type="button" className="vs-sound" aria-label={soundOn ? "Stop intro" : "Play intro once"} aria-pressed={soundOn} onClick={toggle}>
          {soundOn ? (
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
              <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor" />
            </svg>
          )}
        </button>
      )}

      <style>{`
        .vs-stage { position: relative; width: 100%; height: 100%; display: flex; align-items: flex-end; justify-content: center; }
        .vs-video {
          width: 100%; height: 100%; object-fit: contain; object-position: bottom;
          aspect-ratio: ${HERO.videoRatio};
          /* Drops the blown-out white backdrop into the paper behind it. */
          mix-blend-mode: darken;
          background: transparent;
          -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
        }
        .vs-sound { position: absolute; right: 4%; bottom: 8%; width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center;
          background: var(--ip-red); color: #fff; z-index: 2;
          transition: transform .4s var(--ease), background .4s var(--ease); }
        .vs-sound:hover { transform: scale(1.08); background: var(--ip-red-deep); }
      `}</style>
    </div>
  );
}
