# Gyandeep Aryan — portfolio

A portfolio for **Gyandeep Aryan**, Software Developer, Department of Posts,
Ministry of Communications, Government of India.

Structure and interaction are modelled on
[ajay-bobbili/my-portfolio](https://github.com/ajay-bobbili/my-portfolio); the design
language, palette, ID card and 3D hero are India Post's.

- **Next.js 15** (App Router) · **React 19** · **TypeScript** · **Tailwind CSS 4**
- Hero is a **looping video of you**, keyed with `mix-blend-mode: darken` — the
  reference site's approach. A **three.js** avatar is available as an alternative.
- **Lenis** for smooth scrolling
- Static export (`output: "export"`) — deploys anywhere that serves files

---

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
```

---

## Everything you need to edit

### 1. `src/lib/data.ts` — all the content

One file drives the whole page: profile, skills, projects, experience, honours.
Lines marked **`⚠ VERIFY`** are reconstructions from public sources (your GitHub
profile, peerlist.io, iyfpatna.in) because LinkedIn blocks automated reads.
**Check these before publishing:**

| Field | Current value | Why it is flagged |
|---|---|---|
| `PROFILE.since` | `Jul 2025` | Joining date — guessed |
| `PROFILE.location` | `Patna, Bihar` | Posting |
| `PROFILE.circle` | `Bihar Circle` | Shown on the ID card |
| `PROFILE.idNo` | `DOP/BR/2025/0000` | Placeholder. Put your real staff number, or `""` to hide the row |
| `PROFILE.phone` | `""` | Empty, so every phone row is hidden. Fill it to show them |
| `EXPERIENCE[0].bullets` | starter copy | **Rewrite these.** They are generic, written from your GitHub bio |
| `EDUCATION[0]` | B.P. Poddar Institute, 2018–2022 | From peerlist.io |

### 2. Files to add

| Path | What | If missing |
|---|---|---|
| `intro.mp4` (project root) | ~10s of you against a white wall → run `scripts/build-hero-assets.py`. See **[HERO-VIDEO.md](HERO-VIDEO.md)** | Hero shows the portrait card |
| `public/portrait.webp` | 4:5 portrait photo (the build script also writes this) | ID card and hero show an initials placeholder |
| `public/cv.pdf` | Résumé | The "Résumé ↓" buttons 404 |
| `public/avatar/avatar.glb` | Only for `media: "avatar3d"` — see **[AVATAR.md](AVATAR.md)** | — |

After adding files, point the config at them:

```ts
// src/lib/hero.ts
video: "/hero/hero",
// src/lib/data.ts
portrait: "/portrait.webp",
```

### 3. Sections that are off

**Certifications** renders nothing while `CERT_RAW` in `data.ts` is empty — the whole
section hides itself. Add entries and it reappears:

```ts
const CERT_RAW = [
  { id: "x", title: "…", issuer: "…", date: "Mar 2024", url: "https://…" },
];
```

---

## The India Post ID card

`src/components/ui/IdCard.tsx`. It hangs from a lanyard on a damped-pendulum
simulation, swings when you move the mouse across it, and flips on hover (tap on
touch).

- **Front** — tricolour rule, State Emblem, "भारत सरकार / GOVERNMENT OF INDIA" band,
  the India Post logo with "डाक विभाग / Department of Posts", photo in a gold frame,
  name in English and Devanagari, designation, posting, barcode, holographic seal.
- **Back** — what you build, signature, and *"यदि यह कार्ड मिले तो कृपया निकटतम लेटर बॉक्स
  में डाल दें"* — the real convention printed on postal property.

### On the State Emblem

Use of the State Emblem of India is governed by the **State Emblem of India
(Prohibition of Improper Use) Act, 2005**, which restricts its use by private
individuals independently of copyright. This is a decorative card on a personal
site, not an official document, but it is your call. To remove it:

```ts
// src/lib/data.ts
export const SHOW_STATE_EMBLEM = false;
```

The layout closes up cleanly without it.

---

## Deploy

### Vercel (recommended — matches your other projects)

```bash
npx vercel --prod
```

Set `NEXT_PUBLIC_SITE_URL=https://your-domain` so the link-preview card resolves to an
absolute URL.

### GitHub Pages

`.github/workflows/deploy.yml` is included. Push to `main`, then set
**Settings → Pages → Source → GitHub Actions**. For a project site (not
`username.github.io`), set the sub-path in the workflow:

```yaml
NEXT_PUBLIC_BASE_PATH: /portfolio-2026
```

> Next writes the generated favicon and link-preview card as extensionless files
> (`out/icon`, `out/opengraph-image`). Vercel serves these with the right content
> type; some static hosts do not. If previews look broken on GitHub Pages, that is
> why — Vercel avoids it.

---

## Layout

```
src/
  app/
    layout.tsx              fonts, metadata
    page.tsx
    globals.css             design tokens — India Post red #c62829, gold #ffdd00
    icon.tsx                favicon, generated at build
    opengraph-image.tsx     link-preview card, generated at build
  components/
    App.tsx                 section order
    Navigation.tsx
    hero/
      Hero.tsx              headline, CTAs, picks the stage
      VideoStage.tsx        the looping clip, darken keying, sound toggle  (default)
      PortraitFallback.tsx  shown whenever there is no media to render
      AvatarStage.tsx       <Canvas>, lighting, auto-fit camera, error boundary
      Avatar.tsx            GLB loading, bone lookup, cursor tracking, breathing
    sections/               About · Skills · Work · Certifications ·
                            Experience · Achievements · Contact
    ui/
      IdCard.tsx            the India Post identity card
      TechLogo.tsx          logo registry + hand-drawn concept icons
      Button · SectionHeading · RevealObserver
  lib/
    data.ts                 ← all content
    hero.ts                 ← which hero stage, and the clip
    avatar.ts               ← 3D settings
    hooks.ts · scroll.tsx · asset.ts
public/
  brand/                    India Post logo, State Emblem — see brand/README.md
  logos/                    devicon tech marks (MIT)
  hero/                     built hero.mp4 / hero.webm go here
  avatar/                   your .glb goes here (only for media: "avatar3d")
scripts/
  build-hero-assets.py      intro.mp4 -> hero.mp4 + hero.webm + portrait.webp
```

## The hero

Three modes, set in `src/lib/hero.ts`:

```ts
media: "video",      // looping clip of you, keyed to the paper  (default)
media: "avatar3d",   // three.js model, follows the cursor
media: "portrait",   // a still photo
```

Both stages are dynamically imported, so `"video"` keeps three.js out of the
bundle entirely. Whichever you pick, a missing file falls back to the portrait
card — the build always passes.

## Credits

- Reference structure — [ajay-bobbili/my-portfolio](https://github.com/ajay-bobbili/my-portfolio)
- Tech logos — [devicon](https://github.com/devicons/devicon) (MIT)
- Fonts — Inter Tight, Instrument Serif, JetBrains Mono (SIL OFL; licences in `src/fonts/`)
- India Post logo and State Emblem — see [`public/brand/README.md`](public/brand/README.md)
