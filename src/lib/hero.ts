import { asset } from "./asset";

/* ───────────────────────────────────────────────────────────────────────────
   What stands in the hero.

   "video"  — the reference site's approach: a short looping clip of you, shot
              against a white backdrop and levelled so the backdrop blows out to
              pure white. `mix-blend-mode: darken` then drops it straight into
              the paper background, so you appear cut out with no green screen
              and no alpha channel. A button plays the clip once with sound.
              Run `scripts/build-hero-assets.py` to produce the files.

   "avatar3d" — the three.js route: a rigged .glb that breathes and follows the
              cursor. See AVATAR.md. Everything for it is still in the repo.

   "portrait" — a still photo. No video, no WebGL.

   Whatever is selected, if its file is missing the hero falls back to the
   portrait card and nothing breaks.
   ─────────────────────────────────────────────────────────────────────────── */

export const HERO = {
  media: "video" as "video" | "avatar3d" | "portrait",

  /** Basename of the hero clip under /public, with no extension — the component
   *  asks for .webm first, then .mp4. Leave "" until the files exist. */
  video: "" as string, // set to "/hero/hero" once scripts/build-hero-assets.py has run

  /** Aspect ratio of the clip. The build script outputs 768x960. */
  videoRatio: "768 / 960",

  /** Show the play button that replays the intro once with sound.
   *  Set false for a silent clip with no audio track. */
  sound: true,
} as const;

export const heroVideoSources = (base: string) => ({
  webm: asset(`${base}.webm`),
  mp4: asset(`${base}.mp4`),
});
