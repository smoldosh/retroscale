// Console database
// displayW/displayH: effective display dimensions (aspect-corrected)
// crtDisplayW/crtDisplayH: CRT-corrected dimensions (for NES/SNES with 8:7 PAR)
// hasCRT: whether this console has a known CRT aspect ratio correction

const CONSOLES = [
  // ── TV Consoles ──────────────────────────────────────────────────────────
  {
    id: "atari2600",
    name: "Atari 2600",
    category: "TV Consoles",
    displayW: 256, displayH: 192,
    hasCRT: false,
    note: "160×192 native pixels, displayed at ~4:3"
  },
  {
    id: "atari7800",
    name: "Atari 7800",
    category: "TV Consoles",
    displayW: 320, displayH: 240,
    hasCRT: false
  },
  {
    id: "nes",
    name: "NES / Famicom",
    category: "TV Consoles",
    displayW: 256, displayH: 240,
    crtDisplayW: 320, crtDisplayH: 240,
    hasCRT: true,
    note: "Native 8:7 PAR → CRT stretches to 4:3 (320×240)"
  },
  {
    id: "snes",
    name: "SNES / Super Famicom",
    category: "TV Consoles",
    displayW: 256, displayH: 224,
    crtDisplayW: 298, crtDisplayH: 224,
    hasCRT: true,
    note: "Native 8:7 PAR → CRT stretches to ~4:3 (298×224)"
  },
  {
    id: "mastersystem",
    name: "Sega Master System",
    category: "TV Consoles",
    displayW: 256, displayH: 192,
    hasCRT: false
  },
  {
    id: "pcengine",
    name: "PC Engine / TurboGrafx-16",
    category: "TV Consoles",
    displayW: 256, displayH: 240,
    crtDisplayW: 320, crtDisplayH: 240,
    hasCRT: true,
    note: "Native 8:7 PAR → CRT stretches to 4:3 (320×240)"
  },
  {
    id: "neogeo",
    name: "Neo Geo AES",
    category: "TV Consoles",
    displayW: 320, displayH: 224,
    hasCRT: false
  },
  {
    id: "megadrive",
    name: "Sega Mega Drive / Genesis",
    category: "TV Consoles",
    displayW: 320, displayH: 224,
    hasCRT: false
  },
  {
    id: "saturn",
    name: "Sega Saturn",
    category: "TV Consoles",
    displayW: 320, displayH: 240,
    hasCRT: false
  },
  {
    id: "psx",
    name: "PlayStation",
    category: "TV Consoles",
    displayW: 320, displayH: 240,
    hasCRT: false
  },
  {
    id: "n64",
    name: "Nintendo 64",
    category: "TV Consoles",
    displayW: 320, displayH: 240,
    hasCRT: false
  },
  {
    id: "dreamcast",
    name: "Dreamcast",
    category: "TV Consoles",
    displayW: 640, displayH: 480,
    hasCRT: false
  },
  {
    id: "ps2",
    name: "PlayStation 2",
    category: "TV Consoles",
    displayW: 640, displayH: 448,
    hasCRT: false
  },
  {
    id: "gamecube",
    name: "GameCube",
    category: "TV Consoles",
    displayW: 640, displayH: 480,
    hasCRT: false
  },
  {
    id: "wii",
    name: "Nintendo Wii",
    category: "TV Consoles",
    displayW: 640, displayH: 480,
    hasCRT: false
  },

  // ── Handhelds ─────────────────────────────────────────────────────────────
  {
    id: "gb",
    name: "Game Boy",
    category: "Handhelds",
    displayW: 160, displayH: 144,
    hasCRT: false
  },
  {
    id: "gamegear",
    name: "Sega Game Gear",
    category: "Handhelds",
    displayW: 160, displayH: 144,
    hasCRT: false
  },
  {
    id: "lynx",
    name: "Atari Lynx",
    category: "Handhelds",
    displayW: 160, displayH: 102,
    hasCRT: false
  },
  {
    id: "ngpc",
    name: "Neo Geo Pocket Color",
    category: "Handhelds",
    displayW: 160, displayH: 152,
    hasCRT: false
  },
  {
    id: "gbc",
    name: "Game Boy Color",
    category: "Handhelds",
    displayW: 160, displayH: 144,
    hasCRT: false
  },
  {
    id: "wonderswan",
    name: "WonderSwan",
    category: "Handhelds",
    displayW: 224, displayH: 144,
    hasCRT: false
  },
  {
    id: "wonderswancolor",
    name: "WonderSwan Color",
    category: "Handhelds",
    displayW: 224, displayH: 144,
    hasCRT: false
  },
  {
    id: "gba",
    name: "Game Boy Advance",
    category: "Handhelds",
    displayW: 240, displayH: 160,
    hasCRT: false
  },
  {
    id: "virtualboy",
    name: "Virtual Boy",
    category: "Handhelds",
    displayW: 384, displayH: 224,
    hasCRT: false,
    note: "Per-eye resolution"
  },
  {
    id: "supervision",
    name: "Watara Supervision",
    category: "Handhelds",
    displayW: 160, displayH: 160,
    hasCRT: false
  },
  {
    id: "megaduck",
    name: "Mega Duck / Cougar Boy",
    category: "Handhelds",
    displayW: 160, displayH: 144,
    hasCRT: false
  },
  {
    id: "psp",
    name: "PlayStation Portable",
    category: "Handhelds",
    displayW: 480, displayH: 272,
    hasCRT: false
  },
  {
    id: "psvita",
    name: "PlayStation Vita",
    category: "Handhelds",
    displayW: 960, displayH: 544,
    hasCRT: false
  },

  // ── Computers ─────────────────────────────────────────────────────────────
  {
    id: "zxspectrum",
    name: "ZX Spectrum",
    category: "Computers",
    displayW: 256, displayH: 192,
    hasCRT: false
  },
  {
    id: "msx",
    name: "MSX",
    category: "Computers",
    displayW: 256, displayH: 192,
    hasCRT: false
  },
  {
    id: "c64",
    name: "Commodore 64",
    category: "Computers",
    displayW: 320, displayH: 200,
    hasCRT: false
  },
  {
    id: "atarist",
    name: "Atari ST",
    category: "Computers",
    displayW: 320, displayH: 200,
    hasCRT: false
  },
  {
    id: "amiga",
    name: "Amiga 500",
    category: "Computers",
    displayW: 320, displayH: 256,
    hasCRT: false
  },
  {
    id: "dos",
    name: "DOS / PC",
    category: "Computers",
    displayW: 320, displayH: 200,
    hasCRT: false
  },

  // ── Modern Consoles (Early Emulation) ────────────────────────────────────
  {
    id: "xbox",
    name: "Xbox (Original)",
    category: "Modern Consoles",
    displayW: 640, displayH: 480,
    hasCRT: false,
    note: "Most games render at 480p (640×480)"
  },
  {
    id: "xbox360",
    name: "Xbox 360",
    category: "Modern Consoles",
    displayW: 1280, displayH: 720,
    hasCRT: false,
    note: "Standard 720p output; some titles at 1080p"
  },
  {
    id: "ps3",
    name: "PlayStation 3",
    category: "Modern Consoles",
    displayW: 1280, displayH: 720,
    hasCRT: false,
    note: "Most games target 720p; select titles at 1080p"
  },
  {
    id: "switch_handheld",
    name: "Nintendo Switch (handheld)",
    category: "Modern Consoles",
    displayW: 1280, displayH: 720,
    hasCRT: false,
    note: "720p handheld screen; games often render lower and upscale"
  },
  {
    id: "switch_docked",
    name: "Nintendo Switch (docked)",
    category: "Modern Consoles",
    displayW: 1920, displayH: 1080,
    hasCRT: false,
    note: "1080p docked output; games often render at 720p–900p"
  },

  // ── Fantasy Consoles ──────────────────────────────────────────────────────
  {
    id: "pico8",
    name: "PICO-8",
    category: "Fantasy Consoles",
    displayW: 128, displayH: 128,
    hasCRT: false
  },
  {
    id: "tic80",
    name: "TIC-80",
    category: "Fantasy Consoles",
    displayW: 240, displayH: 136,
    hasCRT: false
  },
  {
    id: "chip8",
    name: "CHIP-8",
    category: "Fantasy Consoles",
    displayW: 64, displayH: 32,
    hasCRT: false
  },
  {
    id: "arduboy",
    name: "Arduboy",
    category: "Fantasy Consoles",
    displayW: 128, displayH: 64,
    hasCRT: false
  },
];
