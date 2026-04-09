# RetroScale — CLAUDE.md

## Co je to za projekt

Webová vizualizační aplikace (čistý HTML/CSS/JS, bez backendu, bez build toolů)
sloužící k vizualizaci výstupu emulovaných retro konzolí na reálných zařízeních.
Uživatel zadá rozlišení zařízení, vybere konzoli a vidí, jak výstup vyplní displej.

## Struktura

```
r_scr_vis/
├── index.html          # jediný HTML soubor, vstupní bod
├── css/
│   └── style.css       # veškeré styly, retro 8-bit tema (Press Start 2P)
├── js/
│   ├── consoles.js     # databáze konzolí (pole objektů CONSOLES)
│   └── app.js          # hlavní logika: stav, výpočty, canvas kreslení
├── tasks/              # zadání a plánování funkcí
│   └── 0001.md         # původní vize projektu
├── CLAUDE.md           # tento soubor
└── main.py             # pozůstatek, nepoužívá se
```

## Architektura

### Data (`js/consoles.js`)
Pole `CONSOLES` — každý objekt:
```js
{
  id: string,           // unikátní identifikátor
  name: string,         // zobrazované jméno
  category: string,     // "TV Consoles" | "Handhelds" | "Computers" | "Fantasy Consoles" | "Modern Consoles"
  displayW: number,     // efektivní šířka zobrazení (native nebo korigovaná)
  displayH: number,     // efektivní výška zobrazení
  crtDisplayW?: number, // šířka při CRT aspektu (pouze hasCRT: true)
  crtDisplayH?: number, // výška při CRT aspektu
  hasCRT: boolean,      // zda konzole má CRT korekci (NES, SNES, PC Engine)
  note?: string,        // volitelná poznámka pro UI
}
```

### Stav (`js/app.js` — objekt `state`)
```js
{
  deviceW, deviceH,    // rozlišení emulačního zařízení
  consoleId,           // id z CONSOLES
  integerScaling,      // boolean — integer scaling vs. max fill
  overscaling,         // boolean — overscale preview (jen při integerScaling)
  crtMode,             // boolean — 4:3 CRT korekce (jen pro hasCRT konzole)
  vizZoom,             // zoom vizualizačního canvasu (slider)
  theme,               // 'default' | 'light'
}
```

### Výpočet scalingu
- **Integer scaling**: `scale = min(floor(devW/conW), floor(devH/conH))`, min. 1×
- **Max fill**: `scale = min(devW/conW, devH/conH)` (float)
- **Console > device**: `isUnscalable = true`, použije se max fill scale, zobrazí se červeně (bez warning boxu)

### Canvas (`draw`)
1. Spočítá `vizScale` = jak velký je device rect na obrazovce (max 700×520 px) × vizZoom
2. Nakreslí pozadí s dot-grid patternem
3. Overlay pro letterbox/pillarbox pruhy
4. Konzolový obdélník se scanlines a corner marks
5. Border zařízení
6. Aktualizuje info panel (bez canvas labelů — rozlišení jen v info panelu)

## CRT korekce (NES, SNES, PC Engine)

NES, SNES a PC Engine / TurboGrafx-16 mají native pixel aspect ratio 8:7.
Na CRT televizorech se obraz roztáhl na 4:3. Proto:
- NES native: `256×240`, CRT: `320×240`
- SNES native: `256×224`, CRT: `298×224`
- PC Engine native: `256×240`, CRT: `320×240`

Přepínač "CRT ASPECT" se zobrazí pouze u konzolí s `hasCRT: true`.

## Overscale preview (`state.overscaling`)

Aktivuje se pouze když je zároveň zapnuto integer scaling. Zobrazí konzoli na `intScale + 1` násobku, přičemž:
- Canvas se rozšíří o dynamický margin (bgOuter = `#07071a`, shoduje se s CSS `.canvas-wrap` pozadím)
- Část UVNITŘ device: normální barva konzole
- Část VNĚ device: barva přetékání (`tc.overflowFill`), přerušovaný border
- Info panel zobrazuje tři řádky:
  - **OVERSCALE** — next integer scale (např. 3x)
  - **CUT W/H** — pixely oříznuté v rozlišení zařízení
  - **CUT NATIVE** — pixely oříznuté v nativním rozlišení konzole (cutW / overScale)

Typický use case: NES (256×240) na Anbernic RG Cube XX (720×720) — 2x = 512×480, 3x = 768×720 → CUT W/H: 48/0 px, CUT NATIVE: 16/0 px.

## Warning systém

- Žádné warning boxy se nezobrazují
- Jediná indikace problému: SCALE v info panelu svítí červeně (bez glow efektu) když `isUnscalable`
- "! MIN SCALE (1x)" odstraněno — 1x je validní výsledek
- "! CONSOLE > DEVICE" odstraněno — červený scale faktor stačí

## Theme systém

Dvě témata, přepínatelná v panelu THEMES (tlačítka vedle sebe, plná šířka):

| Téma    | Popis                                                        |
|---------|--------------------------------------------------------------|
| Default | Tmavé pozadí `#0d0d1a`, zelené glow, oranžová konzole       |
| Light   | Světlé pozadí `#eeeeff`, zelené/modré akcenty, tmavý text   |

Implementace: `html[data-theme="..."]` CSS proměnné + `THEMES` JS objekt s canvas barvami. Aktivní téma se automaticky detekuje ze systémového preferences (`prefers-color-scheme`).

## Help modál

Tlačítko "? HOW TO USE" pod sekcí THEMES (cyan border, centrovaný text).
Otevírá modál s popisem všech sekcí aplikace v angličtině.
Zavírání: tlačítko ✕, klik mimo modál, nebo `Escape`.

## Konzole — kategorie

- **TV Consoles** — Atari 2600/7800, NES, SNES, Master System, PC Engine, Neo Geo, Mega Drive, Saturn, PSX, N64, Dreamcast, PS2, GameCube, Wii
- **Handhelds** — GB, Game Gear, Lynx, NGPC, GBC, WonderSwan, GBA, Virtual Boy, Supervision, Mega Duck, PSP, PS Vita
- **Computers** — ZX Spectrum, MSX, C64, Atari ST, Amiga 500, DOS/PC
- **Fantasy Consoles** — PICO-8, TIC-80, CHIP-8, Arduboy
- **Modern Consoles** — Xbox (Original), Xbox 360, PS3, Switch (handheld), Switch (docked) — emulace v rané fázi

## Styl

- Font: **Press Start 2P** (Google Fonts), fallback monospace — písma v panelech zvětšena ~30% oproti originálu
- Barevná paleta: tmavé pozadí `#0d0d1a`, zeleň `#00ff41`, oranžová `#ff6b35`, cyan `#00e5ff`
- Žádné border-radius, pixelový look
- Scan-line efekt kreslený přímo na canvas
- Bez CRT vignette overlay (odstraněno)
- Number inputy bez spinner šipek (webkit + moz)

## Spuštění

Stačí otevřít `index.html` v prohlížeči — žádný server není potřeba.
Pro lokální development lze použít:
```
python3 -m http.server 8080
```
a otevřít `http://localhost:8080`.
