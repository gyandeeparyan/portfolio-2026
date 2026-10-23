# The hero clip

This is how the reference site does its "avatar": not a 3D model, but a short
looping video of the person, levelled so the backdrop blows out to white. The
page then draws it with `mix-blend-mode: darken`, which keeps only pixels darker
than the paper behind — so you appear cut out, with **no green screen and no
alpha channel**, and it costs nothing at runtime.

It looks better than a 3D avatar because it is actually you.

---

## 1. Record

About **10 seconds**, filmed in portrait or cropped to portrait later.

| | |
|---|---|
| **Backdrop** | A plain **white or very light** wall. This is the one thing that matters — the trick is blowing the background to pure white, and it cannot recover detail that was never there. |
| **Light** | Face the window. Soft, even, front-on. No hard shadow on the wall behind you. |
| **Clothing** | Anything clearly darker than the wall. Avoid white or very pale shirts, or parts of you will vanish with the background. |
| **Framing** | Head and upper body, centred, a little headroom. |
| **Motion** | Small and natural — a slight sway, a blink, a half-smile. It loops, so avoid any big one-off gesture. |
| **Audio** | Optional. If you say a line of intro, the page gets a play button that runs it once with sound. |

Save it to the project root as `intro.mp4`.

> Starting and ending in roughly the same pose makes the loop invisible. The
> script cross-fades the last half-second into the first, which hides a lot,
> but not a jump from arms-down to arms-up.

---

## 2. Check the key before encoding

```bash
python -I -X utf8 scripts/build-hero-assets.py intro.mp4 --preview
```

Opens as `hero-preview.png`. You want:

- the backdrop reading as **flat white**, and
- detail still visible in your **hair and clothing**.

Tune with `--white` (default `0.90`):

| Symptom | Fix |
|---|---|
| Backdrop still looks grey | **Lower** it — `--white 0.84` |
| Face washed out, hair edges eaten | **Raise** it — `--white 0.95` |
| Only part of the wall keys out | The wall was lit unevenly; re-light or accept a soft edge |

---

## 3. Build

```bash
python -I -X utf8 scripts/build-hero-assets.py intro.mp4
```

Needs **ffmpeg and ffprobe** on PATH, nothing else — no Python packages.

```bash
winget install Gyan.FFmpeg     # Windows
brew install ffmpeg            # macOS
sudo apt install ffmpeg        # Linux
```

It writes:

```
public/hero/hero.mp4      H.264
public/hero/hero.webm     VP9
public/portrait.webp      a still, for the ID card and the fallback
```

---

## 4. Switch it on

```ts
// src/lib/hero.ts
video: "/hero/hero",

// src/lib/data.ts
portrait: "/portrait.webp",
```

If your clip has no audio track, also set `sound: false` to hide the play button.

`npm run dev` and the hero is live.

---

## Options

| Flag | What it does |
|---|---|
| `--white 0.90` | Input white point. The main dial. |
| `--crop w:h:x:y` | Manual crop in source pixels. Default is a centred 4:5 window of the full frame height. |
| `--still 1.0` | Timestamp used for the portrait still. |
| `--no-loop` | Skip the cross-fade (use if your clip already loops). |
| `--preview` | Write a single frame and stop. |

Off-centre in frame? Pass the crop yourself. For a 1920×1080 source where you
sit left of centre:

```bash
python -I -X utf8 scripts/build-hero-assets.py intro.mp4 --crop 864:1080:400:0
```

---

## Switching hero modes

`src/lib/hero.ts`:

```ts
media: "video",      // the clip (default)
media: "avatar3d",   // the three.js model — see AVATAR.md
media: "portrait",   // a still photo, no video and no WebGL
```

Both stages are dynamically imported, so choosing `"video"` keeps three.js out
of the bundle entirely rather than merely deferring it.

Whichever is selected, if its files are missing the hero falls back to the
portrait card. Nothing breaks, and the build still passes.
