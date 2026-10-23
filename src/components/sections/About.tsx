import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import IdCard from "@/components/ui/IdCard";
import { PROFILE } from "@/lib/data";

const FACTS: { k: string; v: string; href?: string }[] = [
  { k: "Current role", v: `${PROFILE.role}, ${PROFILE.dept}` },
  { k: "", v: `${PROFILE.ministry}, ${PROFILE.govt}` },
  { k: "Education", v: "B.Tech, Computer Science and Engineering" },
  { k: "Location", v: PROFILE.location },
  { k: "Email", v: PROFILE.email, href: `mailto:${PROFILE.email}` },
  ...(PROFILE.phone ? [{ k: "Phone", v: PROFILE.phone, href: PROFILE.phoneHref }] : []),
  { k: "GitHub", v: PROFILE.githubHandle, href: PROFILE.github },
];

export default function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-heading">
      <div className="wrap about-grid">
        <div className="about-l">
          <SectionHeading id="about" lead="Hi, I'm" accent="Gyandeep." />
          <p className="about-p rv" style={{ ["--i" as string]: 1 }}>
            {PROFILE.summary}
          </p>
          <div className="about-btns rv" style={{ ["--i" as string]: 2 }}>
            <Button href={PROFILE.resume} download variant="primary">
              Résumé
            </Button>
            <Button href={PROFILE.github} external variant="secondary">
              GitHub
            </Button>
            <Button href={PROFILE.linkedin} external variant="secondary">
              LinkedIn
            </Button>
          </div>
        </div>

        <div className="about-c">
          <IdCard />
        </div>

        <aside className="about-r" aria-labelledby="facts-h">
          <h3 id="facts-h" className="about-fh mono rv">
            Quick facts
          </h3>
          <dl className="about-facts">
            {FACTS.map((f, i) => (
              <div key={i} className="about-row rv" style={{ ["--i" as string]: i }}>
                <dt className="mono">{f.k}</dt>
                <dd>{f.href ? <a href={f.href}>{f.v}</a> : f.v}</dd>
              </div>
            ))}
          </dl>
          <figure className="about-q rv" style={{ ["--i" as string]: 7 }}>
            <blockquote>
              Shipping Next.js for a department that has been delivering <span className="accent">since 1854.</span>
            </blockquote>
          </figure>
        </aside>
      </div>

      <style>{`
        .about { overflow-x: clip; }
        .about-grid { display: grid; grid-template-columns: minmax(0,1fr) 324px minmax(0,1fr); gap: clamp(24px,3vw,48px); align-items: stretch; }
        .about-p { margin-top: 28px; max-width: 46ch; font-size: clamp(16px,1.25vw,18px); line-height: 1.6; color: var(--ink-2); }
        .about-btns { margin-top: 32px; display: flex; flex-wrap: wrap; gap: 10px; }
        .about-c { position: relative; min-width: 0; }
        .about-r { align-self: start; margin-top: 72px; }
        .about-fh { font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--mute); font-weight: 400; margin-bottom: 14px; }
        .about-facts { background: #fff; border-radius: 24px; box-shadow: inset 0 0 0 1px var(--line); padding: 6px 22px; }
        .about-row { display: grid; grid-template-columns: 96px minmax(0,1fr); gap: 14px; padding: 14px 0; border-top: 1px solid var(--line); font-size: 14.5px; line-height: 1.4; }
        .about-row:first-child { border-top: 0; }
        .about-row dt { font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--mute); padding-top: 3px; }
        .about-row dd { margin: 0; overflow-wrap: anywhere; font-weight: 500; }
        .about-row a { text-decoration: underline; text-underline-offset: 3px; text-decoration-color: var(--faint); transition: text-decoration-color .3s var(--ease), color .3s var(--ease); }
        .about-row a:hover { text-decoration-color: var(--ip-red); color: var(--ip-red); }
        .about-q { margin-top: 22px; padding: 0 4px; }
        .about-q blockquote { font-size: clamp(22px,2vw,28px); font-weight: 600; letter-spacing: -.03em; line-height: 1.15; text-wrap: balance; }
        @media (max-width: 1023px) {
          .about-grid { grid-template-columns: minmax(0,1fr); gap: 40px; }
          .about-r { margin-top: 0; order: 3; }
          .about-c { order: 2; }
        }
      `}</style>
    </section>
  );
}
