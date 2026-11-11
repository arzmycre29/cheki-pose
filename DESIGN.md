# ChekiPose Design System & Art Direction

Reading this as: utility web app for idol event attendees in the Tokutenkai cheki queue, in an analog Instax contact-sheet and livehouse ticket style, dial `ENERGY 2 / RHYTHM 2 / MOTION 2`.

Dial: ENERGY 2 / RHYTHM 2 / MOTION 2

## Concept Card

```text
Idea:        An instant-film darkroom and 19-frame contact sheet (ベタ焼き) where rolling ejects an uncropped Instax print ready to show across the idol booth partition.
Metaphor:    Fuji Instax film stock, camera viewfinder gate, and Japanese livehouse Tokutenkai admission stubs (整理券).
Signature:   Shutter-blade clip-path snap + chemical exposure develop transition paired with an interactive 19-frame contact sheet index.
Emotion:     Tactile analog precision: calm, decisive, and rooted in Tokyo idol subculture.
Motion verb: Snap, eject, and develop (crisp shutter cut, smooth card slide on cubic-bezier(0.16, 1, 0.3, 1)).
Screenshot:  The Asymmetric Studio Stage: an off-white Instax print with film-edge serial codes framing 100% of the uncropped pose on a matte black viewfinder gate, paired with heavy typographic cue cards and a numbered contact sheet below.
```

## Palette (WCAG AA Verified)

Every active mode uses neutral paper/darkroom surfaces plus a single deliberate mode accent (R-29). All foreground/background pairs exceed WCAG AA 4.5:1 contrast (R-25):

- `ground` (`#F4F1EA`): Warm contact-sheet paper backing that prevents glare under venue lighting (`16.4:1` with `ink`).
- `surface-film` (`#FCFBF9`): Bright ivory Instax card stock used for the physical print frame and ticket surface (`18.3:1` with `ink`).
- `bezel` / `curtain` (`#111113`): Deep matte black viewfinder gate that frames uncropped portrait, square, and landscape photos cleanly (`18.5:1` with `#FFFFFF`).
- `ink` (`#111113`): Carbon ink for primary typography and structural borders.
- `muted` (`#52525B`): Graphite secondary text for technical metadata and Japanese transliterations (`6.8:1` on `ground`, `7.5:1` on `surface-film`).
- `line` (`rgba(17, 17, 19, 0.14)`): 1px architectural grid hairlines and ticket perforation borders.
- `accent` (one active per mode):
  - Cute Mode (`#C81E5B`, hover `#9F1239`, tint `#FCE7F0`): Safelight rose (`6.12:1` with `#FFFFFF`).
  - Fun Mode (`#B45309`, hover `#92400E`, tint `#FEF3C7`): Tungsten amber (`5.02:1` with `#FFFFFF`).
  - Meme Mode (`#5B21B6`, hover `#4C1D95`, tint `#EDE9FE`): Ultraviolet ink (`8.41:1` with `#FFFFFF`).
  - All Modes (`#1D4ED8`, hover `#1E40AF`, tint `#DBEAFE`): Cobalt press (`6.70:1` with `#FFFFFF`).

## Typography

- Display (`--f-display`): `'Syne'` (700, 800) for display titles with tight negative tracking (`-0.03em`) and `'Mochiy Pop One'` for Japanese subculture stamps (`チェキ`, `片ハート`).
- Text & UI (`--f-text`): `'Plus Jakarta Sans'` (500, 600, 700) for Indonesian and Japanese cue sentences and stance instructions at `16px` base size with `1.5` line-height.
- Technical Film Edge (`--f-mono`): `'JetBrains Mono'` (`tabular-nums`, `12px`, tracking `+0.04em`) strictly for film exposure counters (`EXP 01 / 19`), native image dimensions (`768x1024`), and SOP badges.

## Grid, Shape & Motion Decisions (R-31)

- Why this color palette: Warm paper (`#F4F1EA`) and a darkroom black camera gate (`#111113`) let uncropped photos of any aspect ratio sit without visual gaps while keeping text contrast above 5.0:1.
- Why this layout: A 12-column asymmetric split on desktop puts the sticky Instax print beside the Seiriken cue deck, while a 19-frame contact sheet below lets users jump directly to any pose in one tap.
- Why this typography: Syne provides bold poster-grade hierarchy for pose titles, Plus Jakarta Sans keeps spoken Indonesian cues effortless to read in a noisy queue, and JetBrains Mono aligns tabular exposure numbers on the film edge.
- Why this spacing: Three distinct vertical spacing registers (compact header bar, asymmetric studio stage, and dense contact-sheet archive) establish section variation matching RHYTHM 2.
- Why use cards: The Instax print frame and perforated Seiriken cue box directly model the two physical objects of an idol cheki session (the polaroid film and the queue stub).
- Why use icons and SVG diagrams: Functional inline SVGs mark sound state, fullscreen expansion, copy actions, and schematic pose fallback without decorative emoji noise.
- Idle motion decision: The app stays calm at rest so users in a moving queue can read cues without distraction; life comes from tactile shutter transitions, pointer-fill CTAs, and letter-roll hover responses (`idleMotion: false` by design).
