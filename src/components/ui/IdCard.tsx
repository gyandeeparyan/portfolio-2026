"use client";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { asset } from "@/lib/asset";
import { PROFILE, SHOW_STATE_EMBLEM } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";

/* Deterministic barcode bar widths from a seed string (decorative only). */
function bars(seed: string): { x: number; w: number }[] {
  let h = 2166136261;
  const out: { x: number; w: number }[] = [];
  let x = 0;
  for (let i = 0; x < 196; i++) {
    h = Math.imul(h ^ (seed.charCodeAt(i % seed.length) + i), 16777619) >>> 0;
    const w = 1 + (h % 3);
    if (i % 2 === 0) out.push({ x, w });
    x += w + 1 + ((h >> 5) % 2);
  }
  return out;
}
const BARS = bars("GYANDEEP-ARYAN-DOP-BR");

const BACK_LINES = [
  "Builds React and Next.js interfaces for the Department of Posts",
  "Ships bilingual Hindi / English web platforms",
];

export default function IdCard() {
  const [flipped, setFlipped] = useState(false);
  const pendulum = useRef<HTMLDivElement>(null);
  const zone = useRef<HTMLDivElement>(null);
  const pType = useRef("mouse");
  const impulse = useRef(0);
  const last = useRef<{ x: number; t: number } | null>(null);

  /* Lanyard physics: a damped pendulum nudged by horizontal pointer movement. */
  useEffect(() => {
    const el = pendulum.current;
    const host = zone.current;
    if (!el || !host || prefersReducedMotion()) return;
    let raf = 0;
    let visible = false;
    let angle = 6; // small initial swing on arrival
    let vel = 0;
    let prev = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.033, (now - prev) / 1000);
      prev = now;
      vel += impulse.current;
      impulse.current = 0;
      const target = Math.sin(now / 1700) * 0.9; // idle sway
      vel += (-34 * (angle - target) - 2.6 * vel) * dt;
      angle += vel * dt;
      angle = Math.max(-24, Math.min(24, angle));
      el.style.transform = `rotate(${angle.toFixed(3)}deg)`;
      if (visible) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) {
        prev = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(host);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const now = performance.now();
    if (last.current) {
      const dt = Math.max(8, now - last.current.t);
      const vx = (e.clientX - last.current.x) / dt; // px per ms
      impulse.current += Math.max(-14, Math.min(14, vx * 7));
    }
    last.current = { x: e.clientX, t: now };
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setFlipped((f) => !f);
    }
  };

  return (
    <div ref={zone} className="idc-zone" onPointerMove={onMove} onPointerLeave={() => (last.current = null)}>
      <div ref={pendulum} className="idc-pend">
        <div className="idc-strap" aria-hidden="true">
          <div className="idc-strap-track">
            {[0, 1].map((k) => (
              <span key={k}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <b key={i}>
                    भारतीय डाक <i>·</i> INDIA POST <i>·</i>
                  </b>
                ))}
              </span>
            ))}
          </div>
        </div>
        <div className="idc-clip" aria-hidden="true">
          <span />
        </div>

        <div
          className={`idc-card${flipped ? " is-flipped" : ""}`}
          role="button"
          tabIndex={0}
          aria-pressed={flipped}
          aria-roledescription="flippable India Post identity card"
          onKeyDown={onKey}
          onPointerEnter={(e) => {
            pType.current = e.pointerType;
            if (e.pointerType === "mouse") setFlipped(true);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") setFlipped(false);
          }}
          onClick={() => {
            if (pType.current !== "mouse") setFlipped((f) => !f);
          }}
          onPointerDown={(e) => (pType.current = e.pointerType)}
        >
          <div className="idc-inner">
            {/* ───────── FRONT ───────── */}
            <div className="idc-face idc-front" aria-hidden={flipped}>
              <span className="tiranga" aria-hidden="true" />

              <div className="idc-band">
                <span className="idc-slot" aria-hidden="true" />
                {SHOW_STATE_EMBLEM && (
                  <img className="idc-emblem" src={asset("/brand/ashok-emblem.svg")} alt="State Emblem of India" width={22} height={38} />
                )}
                <span className="idc-govt">
                  <b className="deva">{PROFILE.govtHi}</b>
                  <i className="mono">{PROFILE.govt.toUpperCase()}</i>
                </span>
              </div>

              <div className="idc-dept">
                <img className="idc-logo" src={asset("/brand/india-post-logo.png")} alt="India Post" width={74} height={48} />
                <span className="idc-dept-t">
                  <b className="deva">{PROFILE.deptHi}</b>
                  <i>{PROFILE.dept}</i>
                  <u className="deva">{PROFILE.ministryHi}</u>
                </span>
              </div>

              <div className="idc-photo">
                <div className="idc-ring">
                  {/* Set PROFILE.portrait once the photo exists; until then only the
                      hatched initials placeholder behind it renders. */}
                  {PROFILE.portrait && (
                    <img src={asset(PROFILE.portrait)} alt={`Portrait of ${PROFILE.name}`} width={112} height={140} />
                  )}
                  <span className="idc-photo-ph" aria-hidden="true">
                    {PROFILE.initials}
                  </span>
                </div>
              </div>

              <p className="idc-name">{PROFILE.name}</p>
              <p className="idc-name-hi deva">{PROFILE.nameHi}</p>
              <p className="idc-role">{PROFILE.role}</p>
              <p className="idc-loc mono">
                {PROFILE.location} · {PROFILE.circle}
              </p>

              <div className="idc-foot">
                <svg viewBox="0 0 200 30" className="idc-bar" role="img" aria-label="Decorative barcode" preserveAspectRatio="none">
                  {BARS.map((b, i) => (
                    <rect key={i} x={b.x} y="0" width={b.w} height="30" fill="#141210" />
                  ))}
                </svg>
                <span className="idc-holo" aria-hidden="true" />
              </div>
              {PROFILE.idNo && <p className="idc-no mono">{PROFILE.idNo}</p>}
            </div>

            {/* ───────── BACK ───────── */}
            <div className="idc-face idc-back" aria-hidden={!flipped}>
              <span className="tiranga" aria-hidden="true" />
              <div className="idc-back-in">
                <p className="idc-bk-tag mono">What I build</p>
                <ul className="idc-bk-list">
                  {BACK_LINES.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
                <p className="idc-sign">{PROFILE.name}</p>
                <p className="idc-sign-cap mono">Signature of holder</p>
                <p className="idc-found">
                  <b className="deva">यदि यह कार्ड मिले तो कृपया निकटतम लेटर बॉक्स में डाल दें।</b>
                  <i>If found, please drop this card in any letter box — or just say hello.</i>
                  <u className="mono">{PROFILE.email}</u>
                </p>
              </div>
              <img className="idc-watermark" src={asset("/brand/india-post-logo.png")} alt="" aria-hidden="true" width={240} height={155} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .idc-zone { position: relative; width: 100%; height: calc(var(--section-pad) + 600px); margin-top: calc(var(--section-pad) * -1); }
        .idc-pend { position: absolute; top: 0; left: 50%; width: 304px; margin-left: -152px; transform-origin: 50% 0; will-change: transform; }

        /* ── lanyard ── */
        .idc-strap { position: relative; width: 32px; height: calc(var(--section-pad) + 56px); margin-inline: auto; background: var(--ip-red); overflow: hidden; border-radius: 0 0 3px 3px; box-shadow: inset -4px 0 0 rgba(0,0,0,.12), inset 4px 0 0 rgba(255,255,255,.1); }
        .idc-strap-track { position: absolute; inset-inline: 0; top: 0; display: flex; flex-direction: column; animation: idc-scroll 20s linear infinite; }
        .idc-strap-track > span { display: flex; flex-direction: column; align-items: center; }
        .idc-strap-track b { writing-mode: vertical-rl; font: 600 9px/32px var(--f-mono), monospace; letter-spacing: .14em; color: #fff; white-space: nowrap; padding-block: 10px; }
        .idc-strap-track i { font-style: normal; color: var(--ip-gold); padding-block: 6px; }
        @keyframes idc-scroll { to { transform: translateY(-50%); } }
        .idc-clip { width: 32px; height: 34px; margin: -2px auto 0; position: relative; z-index: 2; display: grid; place-items: center; }
        .idc-clip span { width: 28px; height: 34px; border-radius: 4px 4px 10px 10px; background: linear-gradient(90deg, #8c8c8c, #e9e9e9 45%, #9a9a9a); box-shadow: inset 0 0 0 1px rgba(0,0,0,.25), 0 3px 6px rgba(0,0,0,.18); }

        /* ── card shell ── */
        .idc-card { position: relative; margin-top: -10px; width: 304px; height: 456px; perspective: 1500px; cursor: pointer; border-radius: 20px; -webkit-tap-highlight-color: transparent; }
        .idc-inner { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform .9s var(--ease); }
        .idc-card.is-flipped .idc-inner { transform: rotateY(180deg); }
        .idc-face { position: absolute; inset: 0; border-radius: 20px; overflow: hidden; backface-visibility: hidden; -webkit-backface-visibility: hidden; background: #fff;
          box-shadow: inset 0 0 0 1px rgba(20,18,16,.14), 0 40px 70px -34px rgba(124,23,24,.45), 0 10px 24px -14px rgba(20,18,16,.22); }
        .idc-face .tiranga { position: absolute; top: 0; left: 0; right: 0; z-index: 3; }

        /* ── front ── */
        .idc-front { text-align: center; }
        .idc-band { position: relative; height: 62px; padding-top: 10px; background: linear-gradient(180deg, var(--ip-red), var(--ip-red-deep)); color: #fff;
          display: flex; align-items: center; justify-content: center; gap: 9px; border-bottom: 2px solid var(--ip-gold); }
        .idc-slot { position: absolute; top: 9px; left: 50%; width: 54px; height: 6px; margin-left: -27px; border-radius: 4px; background: rgba(0,0,0,.35); box-shadow: inset 0 1px 2px rgba(0,0,0,.5); }
        .idc-emblem { width: 22px; height: 38px; object-fit: contain; filter: brightness(0) invert(1); flex: none; }
        .idc-govt { display: grid; gap: 1px; text-align: left; }
        .idc-govt b { font-size: 12.5px; font-weight: 600; line-height: 1.25; }
        .idc-govt i { font-style: normal; font-size: 8px; letter-spacing: .18em; color: var(--ip-gold); }

        .idc-dept { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 9px 16px 7px; background: #fffdf6; border-bottom: 1px solid var(--line); }
        .idc-logo { width: 74px; height: 48px; object-fit: contain; flex: none; }
        .idc-dept-t { display: grid; gap: 0; text-align: left; }
        .idc-dept-t b { font-size: 12px; font-weight: 700; color: var(--ip-red-ink); line-height: 1.3; }
        .idc-dept-t i { font-style: normal; font-size: 9.5px; font-weight: 600; letter-spacing: .04em; color: var(--ink-2); }
        .idc-dept-t u { text-decoration: none; font-size: 9px; color: var(--mute); line-height: 1.4; }

        .idc-photo { position: relative; width: 120px; height: 148px; margin: 14px auto 10px; }
        .idc-ring { position: relative; width: 100%; height: 100%; padding: 4px; border-radius: 10px; background: linear-gradient(150deg, var(--ip-gold), var(--ip-gold-deep) 50%, var(--ip-gold)); overflow: hidden; box-shadow: 0 6px 16px -8px rgba(124,23,24,.5); }
        .idc-ring img { position: relative; z-index: 1; width: 100%; height: 100%; object-fit: cover; object-position: center 18%; border-radius: 7px; background: transparent; transition: transform .8s var(--ease); }
        /* Shown through the <img> when no portrait file exists (broken image has no box). */
        .idc-photo-ph { position: absolute; inset: 4px; z-index: 0; border-radius: 7px; display: grid; place-items: center; background: repeating-linear-gradient(135deg, #f1efe9 0 8px, #e9e6de 8px 16px); color: var(--faint); font: 700 34px/1 var(--f-sans), sans-serif; letter-spacing: -.03em; }
        .idc-card:hover .idc-ring img { transform: scale(1.05); }

        .idc-name { padding-inline: 14px; font-weight: 700; font-size: 22px; letter-spacing: -.035em; line-height: 1.1; }
        .idc-name-hi { font-size: 13px; font-weight: 600; color: var(--ink-2); margin-top: 1px; }
        .idc-role { margin: 7px auto 0; display: inline-block; padding: 3px 13px; border-radius: 999px; background: var(--ip-red); color: #fff; font-size: 11.5px; font-weight: 600; letter-spacing: .01em; }
        .idc-loc { margin-top: 7px; font-size: 9.5px; letter-spacing: .1em; text-transform: uppercase; color: var(--mute); }

        .idc-foot { position: absolute; left: 20px; right: 20px; bottom: 28px; display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; }
        .idc-bar { height: 28px; width: 160px; flex: 1; min-width: 0; }
        .idc-holo { width: 34px; height: 34px; border-radius: 50%; flex: none; background: conic-gradient(from 20deg, var(--ip-gold), #fff6c0, var(--ip-gold-deep), #fffbe0, var(--ip-gold)); box-shadow: inset 0 0 0 1px rgba(124,23,24,.3); animation: idc-holo 6s linear infinite; }
        @keyframes idc-holo { to { transform: rotate(360deg); } }
        .idc-no { position: absolute; left: 0; right: 0; bottom: 11px; font-size: 9px; letter-spacing: .14em; color: var(--faint); }

        /* ── back ── */
        .idc-back { transform: rotateY(180deg); background: linear-gradient(165deg, var(--ip-red-deep), var(--ip-red-ink)); color: #fff; box-shadow: 0 40px 70px -34px rgba(124,23,24,.6); }
        .idc-back-in { position: relative; z-index: 2; height: 100%; padding: 26px 22px 18px; display: flex; flex-direction: column; }
        .idc-watermark { position: absolute; right: -40px; bottom: -14px; width: 240px; height: auto; opacity: .09; filter: grayscale(1) brightness(3); pointer-events: none; }
        .idc-bk-tag { font-size: 10px; letter-spacing: .22em; text-transform: uppercase; color: var(--ip-gold); }
        .idc-bk-list { margin-top: 12px; display: grid; gap: 8px; font-size: 12px; line-height: 1.38; color: rgba(255,255,255,.92); }
        .idc-bk-list li { padding-left: 14px; position: relative; }
        .idc-bk-list li::before { content: ""; position: absolute; left: 0; top: .6em; width: 6px; height: 1px; background: var(--ip-gold); }
        .idc-sign { margin-top: auto; font-family: var(--f-serif), serif; font-style: italic; font-size: 32px; line-height: 1; color: #fff; }
        .idc-sign-cap { margin-top: 4px; font-size: 8.5px; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.45); }
        .idc-found { margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255,221,0,.3); display: grid; gap: 3px; }
        .idc-found b { font-size: 9.5px; font-weight: 500; color: var(--ip-gold); line-height: 1.45; }
        .idc-found i { font-style: normal; font-size: 9.5px; color: rgba(255,255,255,.7); line-height: 1.4; }
        .idc-found u { text-decoration: none; font-size: 9.5px; letter-spacing: .03em; color: #fff; overflow-wrap: anywhere; }

        @media (max-width: 1023px) {
          .idc-zone { margin-top: 0; height: 580px; }
          .idc-strap { height: 76px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .idc-strap-track, .idc-holo { animation: none; }
        }
      `}</style>
    </div>
  );
}
