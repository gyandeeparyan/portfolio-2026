# Your own 3D model — with your face and your hair

> **Not the default.** The hero now uses the reference site's approach: a looping
> clip of you, keyed to the paper — see **[HERO-VIDEO.md](HERO-VIDEO.md)**. It
> looks better than any avatar because it is actually you.
>
> To use a 3D model instead, set `media: "avatar3d"` in `src/lib/hero.ts`.
> Everything below still works.

Short answer: **yes.** You do not model anything. You upload a selfie, a service
builds the mesh, and you fix the hair by hand — every one of these tools
reconstructs face shape well and guesses hair badly.

The hero is already wired for it. Drop a `.glb` in at `public/avatar/avatar.glb`
and it turns on. No code change.

---

## Ready Player Me is gone

If you tried readyplayer.me and it would not load, that is not your connection.
Netflix acquired Ready Player Me in December 2025 and **the avatar creator, the
hub and the developer API all went offline on 31 January 2026.** It has not
relaunched.

GLB files people exported before the shutdown still work — they are ordinary
glTF — but there is no way to make a new one. Use one of the options below.

---

## Pick a tool

| Tool | Likeness | Rigged? | Cost | Verdict |
|---|---|---|---|---|
| **[Avaturn](https://avaturn.me)** | Realistic | **Yes** — humanoid rig, ARKit blendshapes, Mixamo-compatible | Free tier, paid plans | **Start here.** Closest thing to the old RPM workflow. |
| **[MetaPerson](https://avatarsdk.com/avatar-creator/)** | Realistic | **Yes** — humanoid, Mixamo-compatible | First avatar free, then credits, no subscription | Strong second. Exports GLB, glTF and FBX. |
| **[VRoid Studio](https://vroid.com)** | Stylised / anime | Yes (VRM) | Free | Free and unlimited, but a very different look, and VRM needs converting. |
| **[Hyper3D Rodin](https://hyper3d.ai)** · **[Meshy](https://www.meshy.ai)** · **[Tripo3D](https://www.tripo3d.ai)** | Best raw likeness | **No** | Credits | Image-to-3D. Gorgeous, but unrigged — see the rigging detour below. |
| **[Polycam](https://poly.cam)** · **[Luma AI](https://lumalabs.ai)** | A literal scan of you | No | Free tier | Your actual hair, but noisy around it and heavy. Needs Blender cleanup. |

> **Check the licence before you publish.** Reports on Avaturn's free tier
> mention watermarked or non-commercial exports, and MetaPerson's free-avatar
> terms are not spelled out publicly. A personal portfolio is usually fine, but
> both are vendor-controlled and the terms move — read their pricing page
> rather than trusting this table.

---

## Path A — Avaturn (recommended)

1. Go to **<https://avaturn.me>** and start an avatar.
2. Upload a clear, front-facing photo. Even lighting, no sunglasses, hair off the
   forehead. Avaturn may ask for a side photo too — give it one, the result is better.
3. Now fix what the photo could not give it:
   - **Hair** — closest style, then colour. Biggest single win.
   - **Beard / stubble**, **eyebrows**, **skin tone**, **glasses**.
4. Export as **GLB**.
5. Save it to `public/avatar/avatar.glb`.
6. `npm run dev` — the hero switches from the portrait card to the live 3D head.

## Path B — MetaPerson

Same shape: **<https://avatarsdk.com/avatar-creator/>**, upload one front-facing
selfie, pick from dozens of hairstyles, export **GLB**, save to the same path.
Your first avatar is free at default settings (LOD1, 1K JPG textures); further
avatars cost credits.

## Path C — the unrigged generators

Rodin, Meshy, Tripo3D and phone scans give the best likeness and **no skeleton**,
so the head cannot turn. Two ways forward:

- **Accept it.** The model still renders, breathes and floats. Set
  `lookYaw: 0` and `lookPitch: 0` in `src/lib/avatar.ts` so it does not try to
  find bones that are not there.
- **Rig it for free with [Mixamo](https://www.mixamo.com).** Upload the mesh,
  let the auto-rigger place the skeleton, download. Mixamo exports **FBX**, so
  convert to GLB — open in [Blender](https://www.blender.org) and
  *File → Export → glTF 2.0*, or:
  ```bash
  npx @gltf-transform/cli copy model.fbx model.glb   # FBX support varies; Blender is the reliable route
  ```
  A Mixamo rig names bones `mixamorig:Head`. That resolves automatically — see below.

---

## Bone names resolve themselves

You do not need to configure the rig. The component normalises every bone name
— lowercases it, drops any prefix before a `:` or `|`, strips spaces, dots,
dashes and underscores — then matches on the bare word. So `Head`,
`mixamorig:Head`, `Neck_01` and `upper_chest` all resolve.

In `npm run dev`, if no head bone matches, the console prints **every bone name in
your model** so you can see what the rig actually calls things. Add the right name
to the front of the list in `src/lib/avatar.ts`:

```ts
bones: {
  head:  ["head"],
  neck:  ["neck", "neck1", "neck01"],
  spine: ["spine2", "upperchest", "chest", "spine1", "spine"],
},
```

---

## Why the hero frames a bust

These tools export a **T-pose with no animation**. A full body standing with its
arms straight out looks like a crash-test dummy on a portfolio.

So `framing` defaults to `"bust"`: the camera sits close on head and shoulders and
the arms are simply out of shot. You get the face and the hair, which is the part
that is actually you.

If you later export a model **with a baked idle animation**, the component plays the
first clip automatically — then switch:

```ts
framing: "full",
```

---

## Tuning

All in **`src/lib/avatar.ts`**:

```ts
lookYaw:   0.42,   // how far the head turns left/right. 0 = stop tracking
lookPitch: 0.26,   // up/down
offsetY:   0,      // raise if the head sits low in the frame
framing:   "bust", // "bust" | "full"
```

Camera distance and lens live in `FRAME` at the top of
`src/components/hero/AvatarStage.tsx` — lower `fov` for a flatter, more
portrait-like look; raise `pos[2]` to pull back.

The head/neck split is deliberate: the neck takes about a third of the turn and the
head the rest, which reads as a glance rather than an owl.

---

## Keeping it fast

Aim for **under ~3 MB**. Realistic avatars from Avaturn and Rodin run heavier than
the old RPM models did, so this matters more now.

```bash
ls -lh public/avatar/avatar.glb
```

Too big? [gltf-transform](https://gltf-transform.dev) does most of it in one pass:

```bash
npx @gltf-transform/cli optimize public/avatar/avatar.glb public/avatar/avatar.glb \
  --texture-compress webp --texture-size 1024
```

To also drop blendshapes you are not animating (this hero moves bones, not faces):

```bash
npx @gltf-transform/cli prune public/avatar/avatar.glb public/avatar/avatar.glb --keep-morph-targets false
```

The three.js bundle is **dynamically imported**, so readers who never reach the hero
on a slow connection do not pay for it.

---

## Accessibility and failure

- **No model present** → the hero renders a portrait card. Nothing breaks, the build
  still passes. That is the state you are in now.
- **`prefers-reduced-motion`** → tracking, breathing and float all stop. The model
  stays, perfectly still.
- **WebGL unavailable, or the file 404s** → the error boundary in `AvatarStage.tsx`
  catches it and falls back to the same portrait card.

For that fallback, save a 4:5 portrait photo at **`public/portrait.webp`** and set
`PROFILE.portrait = "/portrait.webp"` in `src/lib/data.ts`. It is also the ID card
photo, so it is worth adding either way.
