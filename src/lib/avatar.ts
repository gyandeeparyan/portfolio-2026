import { asset } from "./asset";

/* ───────────────────────────────────────────────────────────────────────────
   Your 3D head.

   Ready Player Me shut down on 31 January 2026 (Netflix acquired it and never
   relaunched it), so use one of these instead — see AVATAR.md for the full
   comparison:

     • Avaturn        https://avaturn.me            selfie → realistic rigged GLB
     • MetaPerson     https://avatarsdk.com/avatar-creator/   first avatar free
     • VRoid Studio   https://vroid.com             free, stylised, desktop app

   Whichever you use:
     1. Upload a front-facing selfie.
     2. Fix the hair, beard, brows and glasses by hand — every one of these
        tools reconstructs face shape well and guesses hair badly.
     3. Export GLB and save it as  public/avatar/avatar.glb   (default), or set
        NEXT_PUBLIC_AVATAR_URL to a remote .glb URL.

   Rig naming does not matter: bones are resolved by alias below, so plain
   "Head", Mixamo's "mixamorig:Head" and similar all resolve.

   If no model is found the hero falls back to a portrait card — nothing breaks.
   ─────────────────────────────────────────────────────────────────────────── */

export const AVATAR = {
  /** Local file by default; override with NEXT_PUBLIC_AVATAR_URL at build time. */
  url: process.env.NEXT_PUBLIC_AVATAR_URL || asset("/avatar/avatar.glb"),

  /** "bust" frames head + shoulders — recommended, because it keeps a bare
   *  T-pose's arms safely out of shot.
   *  "full" shows the whole body (only use it if your GLB has an idle animation). */
  framing: "bust" as "bust" | "full",

  /** Camera. The model is measured on load and the camera is fitted to it, so
   *  these are proportions rather than metres and work for any export height.
   *
   *  `span` is how much of the model's total height to show, measured down from
   *  the crown: 0.28 ≈ head + shoulders + collar. Raise it to pull back and show
   *  more chest, lower it to tighten onto the face.
   *
   *  `fov` is the vertical lens angle — lower is flatter and more portrait-like,
   *  higher is wider and distorts features nearer the edges. */
  frame: {
    bust: { span: 0.28, fov: 26 },
    full: { span: 1.08, fov: 30 },
  },

  /** Empty space above the crown, as a fraction of `span`. */
  headroom: 0.14,

  /** How far the head turns towards the cursor, in radians. 0 disables tracking. */
  lookYaw: 0.42,
  lookPitch: 0.26,

  /** Vertical nudge, in metres. Raise if the head sits low in the frame. */
  offsetY: 0,

  /** Candidate bone names, tried in order. Matching ignores case, whitespace,
   *  underscores and any rig prefix ("mixamorig:Head" matches "head"), so this
   *  covers Avaturn, MetaPerson, Mixamo, VRoid and most humanoid rigs.
   *  Add your own name at the front of a list if a rig uses something exotic. */
  bones: {
    head: ["head"],
    neck: ["neck", "neck1", "neck01"],
    spine: ["spine2", "upperchest", "chest", "spine1", "spine"],
  },

  /** Log the bone names found in the model to the console in development.
   *  Handy the first time you load a GLB from a new tool. */
  debugBones: process.env.NODE_ENV === "development",
} as const;
