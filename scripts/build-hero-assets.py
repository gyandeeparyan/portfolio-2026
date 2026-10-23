#!/usr/bin/env python3
"""
Build the hero clip from a recording of yourself.

    python -I -X utf8 scripts/build-hero-assets.py intro.mp4

Needs only ffmpeg and ffprobe on PATH — no Python packages.

What it does
------------
1.  Crops to a 4:5 portrait and scales to 768x960.
2.  Raises the white point so the backdrop blows out to near-pure white. The page
    draws the clip with `mix-blend-mode: darken`, so anything at white disappears
    into the paper and you appear cut out — no green screen, no alpha channel.
3.  Makes it loop seamlessly by cross-fading the last half-second into the first.
4.  Encodes H.264 (.mp4) and VP9 (.webm), and pulls a still for the ID card.

Outputs
-------
    public/hero/hero.mp4
    public/hero/hero.webm
    public/portrait.webp

Then set these in src/lib/hero.ts and src/lib/data.ts:

    HERO.video       = "/hero/hero"
    PROFILE.portrait = "/portrait.webp"

Check the key before encoding
-----------------------------
    python -I -X utf8 scripts/build-hero-assets.py intro.mp4 --preview

writes `hero-preview.png`. Open it: the backdrop should read as flat white, and
you should still have detail in your shirt and hair. If the backdrop is grey,
lower --white. If your face looks washed out, raise it.
"""

import argparse
import json
import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public")

W, H = 768, 960  # output size, 4:5
XF = 0.5  # seconds of loop cross-fade


def need(tool: str) -> str:
    path = shutil.which(tool)
    if not path:
        sys.exit(
            f"{tool} not found on PATH.\n"
            "  Windows:  winget install Gyan.FFmpeg\n"
            "  macOS:    brew install ffmpeg\n"
            "  Linux:    sudo apt install ffmpeg"
        )
    return path


def run(cmd: list[str]) -> bytes:
    r = subprocess.run(cmd, capture_output=True)
    if r.returncode:
        sys.exit(r.stderr.decode(errors="replace")[-2500:])
    return r.stdout


def probe(src: str) -> tuple[int, int, float, bool]:
    raw = run([need("ffprobe"), "-v", "error", "-print_format", "json", "-show_streams", "-show_format", src])
    info = json.loads(raw)
    v = next((s for s in info["streams"] if s["codec_type"] == "video"), None)
    if not v:
        sys.exit(f"{src} has no video stream.")
    has_audio = any(s["codec_type"] == "audio" for s in info["streams"])
    return int(v["width"]), int(v["height"]), float(info["format"]["duration"]), has_audio


def main() -> None:
    ap = argparse.ArgumentParser(description="Build hero video assets.")
    ap.add_argument("source", nargs="?", default="intro.mp4", help="your recording (default: intro.mp4)")
    ap.add_argument("--crop", help="w:h:x:y in source pixels. Default is a centred 4:5 crop of the full height.")
    ap.add_argument("--white", type=float, default=0.90,
                    help="input white point, 0-1. Anything at or above this becomes pure white. "
                         "Lower it if the backdrop stays grey (default: 0.90)")
    ap.add_argument("--still", type=float, default=1.0, help="timestamp in seconds for the portrait still (default: 1.0)")
    ap.add_argument("--no-loop", action="store_true", help="skip the seamless-loop cross-fade")
    ap.add_argument("--preview", action="store_true", help="write hero-preview.png and stop")
    args = ap.parse_args()

    ffmpeg = need("ffmpeg")
    src = args.source if os.path.isabs(args.source) else os.path.join(ROOT, args.source)
    if not os.path.exists(src):
        sys.exit(f"Not found: {src}\nRecord a short clip and save it there, or pass a path.")

    sw, sh, dur, has_audio = probe(src)

    if args.crop:
        crop = f"crop={args.crop}"
    else:
        # Centred 4:5 window, as tall as the source allows.
        ch = sh
        cw = int(round(sh * W / H))
        if cw > sw:
            cw, ch = sw, int(round(sw * H / W))
        crop = f"crop={cw}:{ch}:{(sw - cw) // 2}:{(sh - ch) // 2}"

    levels = f"colorlevels=rimax={args.white}:gimax={args.white}:bimax={args.white}"
    base_vf = f"{crop},scale={W}:{H}:flags=lanczos,{levels},setsar=1"

    print(f"source   {sw}x{sh}  {dur:.2f}s  audio={'yes' if has_audio else 'no'}")
    print(f"crop     {crop}")
    print(f"white    {args.white}")

    if args.preview:
        out = os.path.join(ROOT, "hero-preview.png")
        run([ffmpeg, "-v", "error", "-y", "-ss", str(args.still), "-i", src, "-frames:v", "1", "-vf", base_vf, out])
        print(f"\nwrote {out}")
        print("Backdrop should be flat white; you should keep detail in hair and clothing.")
        print("Too grey -> lower --white.  Washed out -> raise --white.")
        return

    os.makedirs(os.path.join(OUT, "hero"), exist_ok=True)

    loop = not args.no_loop and dur > XF * 3
    if loop:
        main_end = dur - XF
        fc = (
            f"[0:v]{base_vf},format=yuv420p,split=3[a][b][c];"
            f"[a]trim={XF}:{main_end},setpts=PTS-STARTPTS[main];"
            f"[b]trim={main_end}:{dur},setpts=PTS-STARTPTS[tail];"
            f"[c]trim=0:{XF},setpts=PTS-STARTPTS[head];"
            f"[tail][head]xfade=transition=fade:duration={XF}:offset=0[x];"
            f"[main][x]concat=n=2:v=1:a=0[v]"
        )
        if has_audio:
            fc += (
                f";[0:a]asplit=3[aa][ab][ac];"
                f"[aa]atrim={XF}:{main_end},asetpts=PTS-STARTPTS[amain];"
                f"[ab]atrim={main_end}:{dur},asetpts=PTS-STARTPTS[atail];"
                f"[ac]atrim=0:{XF},asetpts=PTS-STARTPTS[ahead];"
                f"[atail][ahead]acrossfade=d={XF}:c1=qsin:c2=qsin[ax];"
                f"[amain][ax]concat=n=2:v=0:a=1[aout]"
            )
    else:
        fc = f"[0:v]{base_vf},format=yuv420p[v]"
        if has_audio:
            fc += ";[0:a]anull[aout]"

    maps = ["-map", "[v]"] + (["-map", "[aout]"] if has_audio else ["-an"])
    base = [ffmpeg, "-v", "error", "-y", "-i", src, "-filter_complex", fc, *maps]

    mp4 = os.path.join(OUT, "hero", "hero.mp4")
    webm = os.path.join(OUT, "hero", "hero.webm")

    print("encoding mp4  ...")
    run(base + ["-c:v", "libx264", "-crf", "24", "-preset", "slow", "-pix_fmt", "yuv420p",
                *(["-c:a", "aac", "-b:a", "96k"] if has_audio else []),
                "-movflags", "+faststart", mp4])

    print("encoding webm ...")
    run(base + ["-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1", "-pix_fmt", "yuv420p",
                *(["-c:a", "libopus", "-b:a", "80k"] if has_audio else []),
                webm])

    print("portrait still ...")
    portrait = os.path.join(OUT, "portrait.webp")
    run([ffmpeg, "-v", "error", "-y", "-ss", str(args.still), "-i", src, "-frames:v", "1",
         "-vf", f"{crop},scale=480:600:flags=lanczos", "-quality", "88", portrait])

    def mb(p: str) -> str:
        return f"{os.path.getsize(p) / 1e6:.2f} MB"

    print(f"\n  public/hero/hero.mp4    {mb(mp4)}")
    print(f"  public/hero/hero.webm   {mb(webm)}")
    print(f"  public/portrait.webp    {mb(portrait)}")
    print("\nNow set:")
    print('  src/lib/hero.ts   HERO.video       = "/hero/hero"')
    print('  src/lib/data.ts   PROFILE.portrait = "/portrait.webp"')
    if not has_audio:
        print('\nNo audio track, so also set  HERO.sound = false  to hide the play button.')


if __name__ == "__main__":
    main()
