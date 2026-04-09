# RetroScale

A browser-based visualizer for emulation display scaling. Pick a retro console and a target device resolution — see how the output fills the screen, with or without integer scaling.

---

## What it does

- Shows a scaled rectangle of the console output inside the device screen
- Supports **integer scaling** (pixel-perfect, no sub-pixel blending) and **max fill** (stretches to fit)
- **Overscale preview** — when integer scaling is on, toggle to see what the next scale step would crop (useful for devices like Anbernic RG Cube XX where slight overscan is acceptable)
- **CRT aspect ratio** correction for NES and SNES (native 8:7 PAR vs. 4:3 display)
- **PPI calculator** — enter the screen diagonal in inches to get pixels per inch
- Dark and light themes, auto-selected from system preference

## Consoles included

| Category | Systems |
|---|---|
| TV Consoles | Atari 2600/7800, NES, SNES, Master System, PC Engine, Neo Geo, Mega Drive, Saturn, PlayStation, N64, Dreamcast, PS2, GameCube, Wii |
| Handhelds | Game Boy, Game Gear, Lynx, Neo Geo Pocket Color, GBC, WonderSwan, WonderSwan Color, GBA, Virtual Boy, Watara Supervision, Mega Duck, PSP, PS Vita |
| Computers | ZX Spectrum, MSX, Commodore 64, Atari ST, Amiga 500, DOS/PC |
| Fantasy Consoles | PICO-8, TIC-80, CHIP-8, Arduboy |

## Running locally

No build step, no dependencies — just open `index.html` in a browser.

For a local server (avoids potential font CORS issues in some browsers):

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Structure

```
index.html        # entry point
css/style.css     # all styles (rem units, CSS variables for theming)
js/consoles.js    # console database
js/app.js         # logic, scaling math, canvas rendering
```

---

Created by [Smoldosh](mailto:smoldosh@gmail.com) · Built with [Claude Code](https://claude.ai/claude-code)
