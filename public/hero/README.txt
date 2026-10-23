Hero clip output folder.

Record ~10 seconds of yourself against a plain WHITE wall, save it to the
project root as intro.mp4, then run:

    python -I -X utf8 scripts/build-hero-assets.py intro.mp4 --preview   # check the key
    python -I -X utf8 scripts/build-hero-assets.py intro.mp4             # build

That writes hero.mp4 and hero.webm here, plus public/portrait.webp.
Then set HERO.video = "/hero/hero" in src/lib/hero.ts.

Needs ffmpeg + ffprobe on PATH. Nothing else.
See HERO-VIDEO.md in the project root for the full guide.
