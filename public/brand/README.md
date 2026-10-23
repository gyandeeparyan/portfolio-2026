# Brand assets

Both files were downloaded from the official India Post website,
<https://www.indiapost.gov.in>, on 23 October 2026.

| File | Source | Used for |
|---|---|---|
| `india-post-logo.png` | `https://www.indiapost.gov.in/images/Logo.png` | ID card, hero chip, nav menu, footer, timeline, honours |
| `ashok-emblem.svg` | `https://www.indiapost.gov.in/images/home/ashok-thumb-logo.svg` | State Emblem on the ID card header |

Brand colours sampled from the logo:

| Token | Value |
|---|---|
| `--ip-red` | `#c62829` |
| `--ip-red-deep` | `#9c1d1e` |
| `--ip-red-ink` | `#7d1718` |
| `--ip-gold` | `#ffdd00` |
| `--ip-gold-deep` | `#e8b900` |

## Terms

**India Post logo** — a trademark of the Department of Posts, Ministry of
Communications, Government of India. It is reproduced here to identify the employer
on a personal portfolio. That is nominative use, not a claim of ownership,
endorsement or affiliation beyond employment.

**State Emblem of India** — use is governed by the **State Emblem of India
(Prohibition of Improper Use) Act, 2005**, which restricts use by private persons
independently of copyright. The Act is the binding consideration here, not the
image's licence.

To render the card without the emblem:

```ts
// src/lib/data.ts
export const SHOW_STATE_EMBLEM = false;
```

If your department has published brand guidelines or an approved logo pack, prefer
those files — drop them in at these same paths and nothing else needs to change.
