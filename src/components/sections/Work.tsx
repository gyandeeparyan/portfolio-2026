"use client";
import { useEffect, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import TechLogo from "@/components/ui/TechLogo";
import { PROJECTS, type Project } from "@/lib/data";

/* Illustrative mini-UIs. Deliberately abstract — they suggest the product
   without pretending to be a screenshot of it. */
function Visual({ kind }: { kind: Project["visual"] }) {
  if (kind === "temple")
    return (
      <div className="mu mu-temple" aria-hidden="true">
        <div className="mu-bar">
          <i />
          <b />
          <em className="mu-lang">हि / EN</em>
        </div>
        <div className="mu-hero">
          <span className="mu-arch" />
          <b />
          <span />
        </div>
        <div className="mu-rows">
          {["Kirtan", "Gita course", "Yatra"].map((r) => (
            <div key={r}>
              <i />
              <span>{r}</span>
              <u />
            </div>
          ))}
        </div>
        <div className="mu-cta">Donate</div>
      </div>
    );

  if (kind === "video")
    return (
      <div className="mu mu-mesh" aria-hidden="true">
        <svg viewBox="0 0 220 130" className="mu-net">
          <g stroke="#c9c6c0" strokeWidth="1">
            <path d="M40 30 110 95M40 30 180 34M110 95 180 34M40 30 110 20M110 20 180 34M110 20 110 95" />
          </g>
          {[
            [40, 30],
            [110, 20],
            [180, 34],
            [110, 95],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="9" fill={i === 3 ? "var(--ip-red)" : "#141210"} />
          ))}
        </svg>
        <div className="mu-tiles2">
          <div className="on" />
          <div />
          <div />
        </div>
        <div className="mu-ctrls">
          <i />
          <i />
          <i className="end" />
        </div>
      </div>
    );

  if (kind === "canvas")
    return (
      <div className="mu mu-canvas" aria-hidden="true">
        <div className="mu-tools">
          {["pen", "erase", "undo", "redo"].map((t, i) => (
            <i key={t} className={i === 0 ? "on" : ""} />
          ))}
        </div>
        <div className="mu-board">
          <svg viewBox="0 0 240 130">
            <path d="M24 96c22-54 44-10 60-36s34 40 56 8 38 12 58-20" fill="none" stroke="#141210" strokeWidth="3" strokeLinecap="round" />
            <path d="M40 112c30-16 70-8 120-24" fill="none" stroke="var(--ip-red)" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="mu-cur a" />
          <span className="mu-cur b" />
        </div>
      </div>
    );

  return (
    <div className="mu mu-fb" aria-hidden="true">
      <div className="mu-bar">
        <i />
        <i />
        <i />
        <b />
      </div>
      <div className="mu-link">
        <span />
        <em>Copy link</em>
      </div>
      {[0, 1, 2].map((n) => (
        <div className="mu-msg" key={n}>
          <i className="mu-anon" />
          <div>
            <b />
            <span />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Work() {
  const [open, setOpen] = useState(0);
  /* Below 900px the panels become a vertical accordion: tapping toggles.
     On desktop, hover or focus opens a panel. */
  const [stacked, setStacked] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 899px)");
    const sync = () => setStacked(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <section id="work" className="section" aria-labelledby="work-heading">
      <style>{css}</style>
      <div className="wrap">
        <SectionHeading id="work" lead="Things I've" accent="built." />
        <div className="wk-row rv" role="list">
          {PROJECTS.map((p, i) => {
            const isOpen = open === i;
            return (
              <article
                key={p.id}
                role="listitem"
                className={`wk-panel${isOpen ? " is-open" : ""}`}
                onMouseEnter={() => {
                  if (!stacked) setOpen(i);
                }}
                aria-labelledby={`wk-t-${p.id}`}
              >
                <button
                  type="button"
                  className="wk-spine"
                  aria-expanded={isOpen}
                  aria-controls={`wk-b-${p.id}`}
                  onFocus={() => {
                    if (!stacked) setOpen(i);
                  }}
                  onClick={() => setOpen((cur) => (stacked && cur === i ? -1 : i))}
                  tabIndex={isOpen && !stacked ? -1 : 0}
                >
                  <span className="wk-sn mono">{p.number}</span>
                  <span className="wk-st">{p.title}</span>
                  <span className="wk-plus" aria-hidden="true">
                    +
                  </span>
                </button>

                <div className="wk-bw" id={`wk-b-${p.id}`}>
                  <div className="wk-body">
                    <div className="wk-left">
                      <p className="wk-kick mono">
                        {p.number} · {p.kicker} · {p.date}
                      </p>
                      <h3 id={`wk-t-${p.id}`} className="wk-title">
                        {p.title}
                      </h3>
                      <p className="wk-desc">{p.description}</p>
                      <ul className="wk-feat">
                        {p.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                      <ul className="wk-tech" aria-label="Technologies">
                        {p.tech.map((t) => (
                          <li key={t.name}>
                            {t.logo && <TechLogo name={t.logo} size={16} />}
                            {t.name}
                          </li>
                        ))}
                      </ul>
                      <div className="wk-links">
                        {p.link && (
                          <a className="btn btn-primary btn-sm" href={p.link.href} target="_blank" rel="noopener noreferrer" tabIndex={isOpen ? 0 : -1}>
                            {p.link.label} <span aria-hidden="true">↗</span>
                          </a>
                        )}
                        {p.repo && (
                          <a className="btn btn-secondary btn-sm" href={p.repo.href} target="_blank" rel="noopener noreferrer" tabIndex={isOpen ? 0 : -1}>
                            {p.repo.label} <span aria-hidden="true">↗</span>
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="wk-right">
                      <div className="wk-vis">
                        <Visual kind={p.visual} />
                      </div>
                      <p className="wk-cap mono">Illustrative UI</p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const css = `
.wk-row{display:flex;gap:12px;margin-top:56px;height:min(78svh,620px)}
.wk-panel{position:relative;flex:1 1 0;min-width:0;overflow:hidden;border-radius:26px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);transition:flex-grow .9s var(--ease),box-shadow .6s var(--ease)}
.wk-panel.is-open{flex-grow:10;box-shadow:inset 0 0 0 1px var(--line),0 40px 80px -30px rgba(124,23,24,.3)}
.wk-panel:has(.wk-spine:focus-visible){outline:2px solid var(--ip-red);outline-offset:3px}
.wk-spine{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:24px 0;width:100%;transition:opacity .4s var(--ease)}
.wk-spine:focus-visible{outline:none}
.wk-panel.is-open .wk-spine{opacity:0;pointer-events:none}
.wk-sn{font-size:12px;letter-spacing:.08em;color:var(--ip-red)}
.wk-st{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:700;font-size:20px;letter-spacing:-.03em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-height:calc(100% - 100px)}
.wk-plus{font-size:26px;line-height:1;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;box-shadow:inset 0 0 0 1px rgba(20,18,16,.2);transition:transform .6s var(--ease),background .4s var(--ease),color .4s var(--ease)}
.wk-panel:hover .wk-plus,.wk-spine:focus-visible .wk-plus{transform:rotate(90deg);background:var(--ip-red);color:#fff}
.wk-bw{position:absolute;inset:0;opacity:0;pointer-events:none;transition:opacity .3s var(--ease)}
.wk-panel.is-open .wk-bw{opacity:1;pointer-events:auto;transition:opacity .6s var(--ease) .3s}
.wk-body{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:28px;height:100%;padding:36px;min-width:min(100%,760px)}
.wk-left{display:flex;flex-direction:column;min-width:0;overflow:hidden}
.wk-kick{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.wk-title{margin-top:12px;font-weight:700;font-size:clamp(26px,2.9vw,42px);letter-spacing:-.045em;line-height:1.02;text-wrap:balance}
.wk-desc{margin-top:14px;font-size:14.5px;line-height:1.5;color:var(--ink-2)}
.wk-feat{margin-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:6px 16px}
.wk-feat li{font-size:13px;line-height:1.3;color:var(--ink-2);padding-left:14px;position:relative}
.wk-feat li::before{content:"";position:absolute;left:0;top:.6em;width:6px;height:1px;background:var(--ip-red)}
.wk-tech{margin-top:16px;display:flex;flex-wrap:wrap;gap:6px}
.wk-tech li{display:inline-flex;align-items:center;gap:6px;height:28px;padding-inline:11px;border-radius:999px;font-size:12px;font-weight:500;box-shadow:inset 0 0 0 1px var(--line);background:var(--paper)}
.wk-tech li:has(img),.wk-tech li:has(svg){padding-left:7px}
.wk-links{margin-top:auto;padding-top:20px;display:flex;flex-wrap:wrap;gap:8px}
.wk-right{display:flex;flex-direction:column;min-width:0}
.wk-vis{flex:1;min-height:0;border-radius:18px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line);overflow:hidden;clip-path:inset(0 100% 0 0);transition:clip-path .1s linear;display:grid;place-items:center;padding:20px}
.wk-panel.is-open .wk-vis{clip-path:inset(0 0 0 0);transition:clip-path 1.1s var(--ease) .35s}
.wk-cap{margin-top:10px;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--faint);text-align:right}

/* ── mini UIs ── */
.mu{width:100%;max-width:340px;max-height:100%;border-radius:14px;background:#fff;box-shadow:0 20px 40px -24px rgba(20,18,16,.4),inset 0 0 0 1px var(--line);padding:14px;display:grid;gap:10px;overflow:hidden}
.mu span,.mu b{display:block;height:7px;border-radius:4px;background:#e4e0d8}
.mu b{background:#c9c6c0;width:55%}
.mu-bar{display:flex;gap:5px;align-items:center}
.mu-bar i{width:8px;height:8px;border-radius:50%;background:#d6d3cd}
.mu-bar b{margin-left:auto;width:34%;height:7px}

/* temple / IYF */
.mu-temple .mu-bar i:first-child{width:14px;height:14px;border-radius:4px;background:var(--ip-red)}
.mu-lang{font-style:normal;margin-left:auto;font-size:10px;font-weight:700;color:var(--ip-red);background:#fdf0f0;border-radius:999px;padding:3px 9px}
.mu-temple .mu-bar b{margin-left:0;width:30%}
.mu-hero{position:relative;height:72px;border-radius:10px;background:linear-gradient(160deg,#fdf1e4,#f6e3d2);display:grid;align-content:end;gap:6px;padding:10px;overflow:hidden}
.mu-arch{position:absolute!important;top:8px;right:14px;width:34px;height:44px;border-radius:17px 17px 2px 2px;background:var(--ip-red)!important;opacity:.85}
.mu-hero b{width:62%;background:rgba(124,23,24,.4)}
.mu-hero span{width:44%;background:rgba(124,23,24,.2)}
.mu-rows{display:grid;gap:6px}
.mu-rows>div{display:flex;align-items:center;gap:8px;padding:7px 9px;border-radius:9px;box-shadow:inset 0 0 0 1px var(--line);font-size:10.5px;font-weight:600;color:var(--ink-2)}
.mu-rows i{width:16px;height:16px;border-radius:5px;background:#eee9e0;flex:none}
.mu .mu-rows span{height:auto;background:none;border-radius:0;flex:1}
.mu-rows u{width:16px;height:5px;border-radius:3px;background:#dcd8d0;text-decoration:none}
.mu-cta{text-align:center;padding:8px;border-radius:999px;background:var(--ip-red);color:#fff;font-size:11px;font-weight:700}

/* mesh video */
.mu-mesh{gap:8px}
.mu-net{width:100%;height:auto}
.mu-tiles2{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.mu-tiles2>div{aspect-ratio:4/3;border-radius:8px;background:#eee9e0}
.mu-tiles2>div.on{background:#141210;box-shadow:0 0 0 2px var(--ip-red)}
.mu-ctrls{display:flex;justify-content:center;gap:8px}
.mu-ctrls i{width:24px;height:24px;border-radius:50%;background:#eee9e0}
.mu-ctrls i.end{background:var(--ip-red)}

/* canvas */
.mu-canvas{gap:8px}
.mu-tools{display:flex;gap:6px}
.mu-tools i{width:24px;height:24px;border-radius:7px;background:#eee9e0}
.mu-tools i.on{background:var(--ip-red)}
.mu-board{position:relative;border-radius:10px;background:#fbfaf7;box-shadow:inset 0 0 0 1px var(--line);overflow:hidden}
.mu-board svg{width:100%;height:auto}
.mu-cur{position:absolute;width:9px;height:9px;border-radius:50% 50% 50% 2px;transform:rotate(-20deg)}
.mu-cur.a{top:26%;left:58%;background:var(--ip-red)}
.mu-cur.b{top:62%;left:26%;background:#141210}

/* anonymous feedback */
.mu-link{display:flex;gap:8px;align-items:center;padding:9px 10px;border-radius:9px;box-shadow:inset 0 0 0 1px var(--line)}
.mu-link span{flex:1;height:7px}
.mu-link em{font-style:normal;font-size:10px;font-weight:700;background:var(--ip-red);color:#fff;border-radius:999px;padding:4px 10px}
.mu-msg{display:flex;gap:9px;align-items:flex-start;padding:8px 2px;border-top:1px solid var(--line)}
.mu-msg>div{flex:1;display:grid;gap:6px}
.mu-anon{width:24px;height:24px;border-radius:50%;background:#dcd8d0;flex:none;position:relative}
.mu-anon::after{content:"?";position:absolute;inset:0;display:grid;place-items:center;font:700 12px/1 var(--f-sans),sans-serif;color:#fff}

@media (max-width:1180px){
 .wk-body{padding:26px;gap:20px}
 .wk-feat{grid-template-columns:1fr}
 .wk-desc{font-size:13.5px}
 .wk-feat li{font-size:12.5px}
}
@media (max-width:899px){
 .wk-row{flex-direction:column;height:auto;margin-top:40px}
 .wk-panel{flex:none;display:flex;flex-direction:column}
 .wk-spine{position:relative;inset:auto;flex-direction:row;gap:14px;padding:0 18px;height:76px;justify-content:flex-start;text-align:left}
 .wk-st{writing-mode:horizontal-tb;transform:none;font-size:17px;max-height:none;flex:1;min-width:0;text-align:left;line-height:1.15;white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
 .wk-panel.is-open .wk-spine{opacity:1;pointer-events:auto}
 .wk-plus{flex:none}
 .wk-panel.is-open .wk-plus{transform:rotate(45deg)}
 .wk-bw{position:relative;inset:auto;display:grid;grid-template-rows:0fr;opacity:1;pointer-events:auto;transition:grid-template-rows .8s var(--ease)}
 .wk-panel.is-open .wk-bw{grid-template-rows:1fr}
 .wk-bw>.wk-body{overflow:hidden;min-height:0}
 .wk-body{grid-template-columns:minmax(0,1fr);padding:0 18px;min-width:0;height:auto;gap:18px}
 .wk-panel.is-open .wk-body{padding-bottom:22px}
 .wk-feat{grid-template-columns:1fr 1fr}
 .wk-vis{min-height:280px}
 .wk-left{overflow:visible}
 .wk-links{margin-top:20px;padding-top:0}
}
@media (max-width:420px){.wk-feat{grid-template-columns:1fr}}
`;
