// ── Theme canvas color palettes ───────────────────────────────────────────
const THEMES = {
  default: {
    labelBg:        'rgba(0,0,0,0.65)',
    bgOuter:        '#07071a',
    bgDevice:       '#13132e',
    gridColor:      '#111130',
    deviceBorder:   '#3a3aaa',
    consoleFill:    'rgba(255,107,53,0.12)',
    consoleBorder:  '#ff6b35',
    consoleLabel:   '#ff9966',
    deviceLabel:    '#5555bb',
    bars:           'rgba(0,0,0,0.25)',
    scanlines:      'rgba(0,0,0,0.18)',
    cornerMark:     '#ffaa44',
    overflowFill:   'rgba(220,30,30,0.28)',
    overflowBorder: '#ff2222',
  },
  light: {
    labelBg:        'rgba(255,255,255,0.75)',
    bgOuter:        '#d8d8ee',
    bgDevice:       '#f0f0ff',
    gridColor:      '#e0e0f0',
    deviceBorder:   '#5555aa',
    consoleFill:    'rgba(180,60,0,0.12)',
    consoleBorder:  '#cc4400',
    consoleLabel:   '#cc4400',
    deviceLabel:    '#7777cc',
    bars:           'rgba(0,0,40,0.10)',
    scanlines:      'rgba(0,0,0,0.05)',
    cornerMark:     '#cc6600',
    overflowFill:   'rgba(200,0,0,0.18)',
    overflowBorder: '#cc0000',
  },
};

// ── DOM refs ──────────────────────────────────────────────────────────────
const deviceWInput       = document.getElementById("deviceW");
const deviceHInput       = document.getElementById("deviceH");
const deviceInchInput    = document.getElementById("deviceInch");
const consoleSelect      = document.getElementById("consoleSelect");
const integerScalingChk  = document.getElementById("integerScaling");
const integerScalingLbl  = document.getElementById("integerScalingState");
const overscalingChk     = document.getElementById("overscaling");
const overscalingLbl     = document.getElementById("overscalingState");
const overscaleField     = document.getElementById("overscaleField");
const crtModeChk         = document.getElementById("crtMode");
const crtModeLbl         = document.getElementById("crtModeState");
const crtField           = document.getElementById("crtField");
const crtNoteEl          = document.getElementById("crtNote");
const vizScaleInput      = document.getElementById("vizScale");
const vizScaleVal        = document.getElementById("vizScaleVal");
const canvas             = document.getElementById("vizCanvas");
const ctx                = canvas.getContext("2d");

// Info panel
const infoConEl          = document.getElementById("infoCon");
const infoScaleEl        = document.getElementById("infoScale");
const infoFinalEl        = document.getElementById("infoFinal");
const infoOutDiagEl      = document.getElementById("infoOutDiag");
const infoCoverageEl     = document.getElementById("infoCoverage");
const infoLeftoverEl        = document.getElementById("infoLeftover");
const infoWarningEl         = document.getElementById("infoWarning");
const infoOverscaleRow      = document.getElementById("overscaleRow");
const infoOverscaleCutRow   = document.getElementById("overscaleCutRow");
const infoOverscaleNativeRow = document.getElementById("overscaleNativeRow");
const infoOverscaleEl       = document.getElementById("infoOverscale");
const infoOverscaleCutEl    = document.getElementById("infoOverscaleCut");
const infoOverscaleNativeEl = document.getElementById("infoOverscaleNative");

// ── State ─────────────────────────────────────────────────────────────────
const state = {
  deviceW: 640,
  deviceH: 480,
  deviceInch: null,
  consoleId: "nes",
  integerScaling: false,
  overscaling: false,
  crtMode: false,
  vizZoom: 1.0,
  theme: 'default',
};

// ── Console helpers ───────────────────────────────────────────────────────
function getCurrentConsole() {
  return CONSOLES.find(c => c.id === state.consoleId);
}

function getDisplayRes(con) {
  if (state.crtMode && con.hasCRT) {
    return { w: con.crtDisplayW, h: con.crtDisplayH };
  }
  return { w: con.displayW, h: con.displayH };
}

function getTheme() {
  return THEMES[state.theme] || THEMES.default;
}

// ── Output diagonal ──────────────────────────────────────────────────────
function calcOutputDiag(outW, outH) {
  if (!state.deviceInch || state.deviceInch <= 0) return "—";
  const ppi  = Math.sqrt(state.deviceW ** 2 + state.deviceH ** 2) / state.deviceInch;
  const diag = Math.sqrt(outW ** 2 + outH ** 2) / ppi;
  return `${diag.toFixed(2)}"`;
}

// ── Scale math ────────────────────────────────────────────────────────────
function calcIntScale(devW, devH, conW, conH) {
  return Math.max(1, Math.min(Math.floor(devW / conW), Math.floor(devH / conH)));
}

function calcMaxFill(devW, devH, conW, conH) {
  return Math.min(devW / conW, devH / conH);
}

// ── Draw helpers ──────────────────────────────────────────────────────────
function drawDotGrid(ctx, x0, y0, w, h, step, color) {
  if (step < 4) return;
  ctx.fillStyle = color;
  for (let x = x0; x < x0 + w; x += step) {
    for (let y = y0; y < y0 + h; y += step) {
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

function drawCornerMarks(ctx, x, y, w, h, color) {
  const mk = Math.min(10, w * 0.08, h * 0.08);
  if (mk < 2) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].forEach(([cx, cy], i) => {
    const dx = i % 2 === 0 ? 1 : -1;
    const dy = i < 2 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(cx + dx * mk, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + dy * mk);
    ctx.stroke();
  });
}

function drawLabel(ctx, text, x, y, fontSize, textColor, bgColor) {
  const m   = ctx.measureText(text);
  const pad = 3;
  ctx.fillStyle = bgColor;
  ctx.fillRect(x - pad, y - fontSize - pad, m.width + pad * 2, fontSize + pad * 2);
  ctx.fillStyle = textColor;
  ctx.fillText(text, x, y);
}

function drawBars(ctx, dX, dY, dW, dH, cX, cY, cW, cH, color) {
  ctx.fillStyle = color;
  const x2 = dX + dW, y2 = dY + dH;
  const cx2 = cX + cW, cy2 = cY + cH;
  if (cY > dY + 1)  ctx.fillRect(dX, dY, dW, cY - dY);
  if (cy2 < y2 - 1) ctx.fillRect(dX, cy2, dW, y2 - cy2);
  if (cX > dX + 1)  ctx.fillRect(dX, cY, cX - dX, cH);
  if (cx2 < x2 - 1) ctx.fillRect(cx2, cY, x2 - cx2, cH);
}

// ── Main draw ─────────────────────────────────────────────────────────────
function draw() {
  const con  = getCurrentConsole();
  const res  = getDisplayRes(con);
  const tc   = getTheme();
  const devW = state.deviceW;
  const devH = state.deviceH;
  const conW = res.w;
  const conH = res.h;

  const container = document.getElementById("canvasContainer");
  const maxW = (container.clientWidth || 700) - 48;
  const maxH = 520;
  const baseScale = Math.min(maxW / devW, maxH / devH);
  const vizScale  = baseScale * state.vizZoom;

  const devVizW = Math.max(1, Math.round(devW * vizScale));
  const devVizH = Math.max(1, Math.round(devH * vizScale));
  const gridStep = Math.max(8, Math.round(32 * vizScale));

  const fontSize = Math.max(7, Math.min(11, vizScale * 9));
  ctx.font = `${fontSize}px monospace`;

  // ── Disable overscale when console fits perfectly at integer scale ─────────
  if (state.integerScaling) {
    const intS = calcIntScale(devW, devH, conW, conH);
    const perfectFit = (intS * conW === devW && intS * conH === devH);
    overscaleField.classList.toggle("disabled", perfectFit);
    overscalingChk.disabled = perfectFit;
    if (perfectFit && state.overscaling) {
      state.overscaling = false;
      overscalingChk.checked = false;
      overscalingLbl.textContent = "OFF";
    }
  }

  // ── Overscale preview ─────────────────────────────────────────────────────
  if (state.overscaling && state.integerScaling) {
    const intScale  = calcIntScale(devW, devH, conW, conH);
    const maxFill   = calcMaxFill(devW, devH, conW, conH);
    const overScale = intScale + 1;
    const overConW  = conW * overScale;
    const overConH  = conH * overScale;
    const cutW      = Math.max(0, overConW - devW);
    const cutH      = Math.max(0, overConH - devH);

    // Canvas margin sized to reveal overflow
    const marginW = Math.max(30, Math.ceil((cutW / 2 + 20) * vizScale));
    const marginH = Math.max(30, Math.ceil((cutH / 2 + 20) * vizScale));
    const MARGIN  = Math.max(marginW, marginH);

    const cW = devVizW + MARGIN * 2;
    const cH = devVizH + MARGIN * 2;
    canvas.width  = cW;
    canvas.height = cH;

    const dX = MARGIN, dY = MARGIN;

    // Outer background (outside device)
    ctx.fillStyle = tc.bgOuter;
    ctx.fillRect(0, 0, cW, cH);

    // Device background
    ctx.fillStyle = tc.bgDevice;
    ctx.fillRect(dX, dY, devVizW, devVizH);

    // Dot grid inside device
    drawDotGrid(ctx, dX, dY, devVizW, devVizH, gridStep, tc.gridColor);

    // Overscaled console rect dimensions
    const ovVizW = overConW * vizScale;
    const ovVizH = overConH * vizScale;
    const ovX    = dX + (devVizW - ovVizW) / 2;
    const ovY    = dY + (devVizH - ovVizH) / 2;

    // Overflow fill (full rect including outside device)
    ctx.fillStyle = tc.overflowFill;
    ctx.fillRect(ovX, ovY, ovVizW, ovVizH);

    // Normal fill for the portion inside the device
    const ix  = Math.max(ovX, dX),       iy  = Math.max(ovY, dY);
    const ix2 = Math.min(ovX + ovVizW, dX + devVizW);
    const iy2 = Math.min(ovY + ovVizH, dY + devVizH);
    if (ix2 > ix && iy2 > iy) {
      ctx.fillStyle = tc.consoleFill;
      ctx.fillRect(ix, iy, ix2 - ix, iy2 - iy);
      ctx.fillStyle = tc.scanlines;
      for (let y = iy; y < iy2; y += 3) ctx.fillRect(ix, y, ix2 - ix, 1);
    }

    // Overscale border (dashed)
    ctx.strokeStyle = tc.overflowBorder;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    ctx.strokeRect(ovX, ovY, ovVizW, ovVizH);
    ctx.setLineDash([]);

    // Device border (solid, on top)
    ctx.strokeStyle = tc.deviceBorder;
    ctx.lineWidth = 2;
    ctx.strokeRect(dX, dY, devVizW, devVizH);

    // Info panel
    const normalFW = conW * intScale;
    const normalFH = conH * intScale;
    const coverage = (normalFW * normalFH) / (devW * devH) * 100;

    infoConEl.textContent      = `${conW}×${conH}`;
    infoScaleEl.textContent    = `${intScale.toFixed(3)}x`;
    infoFinalEl.textContent    = `${normalFW}×${normalFH}`;
    infoOutDiagEl.textContent  = calcOutputDiag(normalFW, normalFH);
    infoCoverageEl.textContent = `${coverage.toFixed(1)}%`;
    infoLeftoverEl.textContent = `${devW - normalFW} / ${devH - normalFH} px`;
    infoScaleEl.classList.remove("warning");
    infoWarningEl.style.display = "none";
    infoOverscaleRow.style.display       = "";
    infoOverscaleCutRow.style.display    = "";
    infoOverscaleNativeRow.style.display = "";
    infoOverscaleEl.textContent          = `${overScale}x`;
    infoOverscaleCutEl.textContent       = `${cutW} / ${cutH} px`;
    infoOverscaleNativeEl.textContent    = `${Math.round(cutW / overScale)} / ${Math.round(cutH / overScale)} px`;
    return;
  }

  // ── Normal draw ───────────────────────────────────────────────────────────
  infoOverscaleRow.style.display       = "none";
  infoOverscaleCutRow.style.display    = "none";
  infoOverscaleNativeRow.style.display = "none";

  canvas.width  = devVizW;
  canvas.height = devVizH;

  // Background + grid
  ctx.fillStyle = tc.bgDevice;
  ctx.fillRect(0, 0, devVizW, devVizH);
  drawDotGrid(ctx, 0, 0, devVizW, devVizH, gridStep, tc.gridColor);

  // Scale
  let emuScale = state.integerScaling
    ? calcIntScale(devW, devH, conW, conH)
    : calcMaxFill(devW, devH, conW, conH);

  const isUnscalable = state.integerScaling && (conW > devW || conH > devH);
  if (isUnscalable) {
    emuScale = calcMaxFill(devW, devH, conW, conH);
  }

  const scaledConW = conW * emuScale * vizScale;
  const scaledConH = conH * emuScale * vizScale;
  const conX = (devVizW - scaledConW) / 2;
  const conY = (devVizH - scaledConH) / 2;

  // Bars
  drawBars(ctx, 0, 0, devVizW, devVizH, conX, conY, scaledConW, scaledConH, tc.bars);

  // Console fill + scanlines
  ctx.fillStyle = tc.consoleFill;
  ctx.fillRect(conX, conY, scaledConW, scaledConH);
  ctx.fillStyle = tc.scanlines;
  for (let y = conY; y < conY + scaledConH; y += 3) {
    ctx.fillRect(conX, y, scaledConW, 1);
  }

  // Console border + corner marks
  ctx.strokeStyle = isUnscalable ? '#ff2222' : tc.consoleBorder;
  ctx.lineWidth = 2;
  ctx.strokeRect(conX, conY, scaledConW, scaledConH);
  drawCornerMarks(ctx, conX, conY, scaledConW, scaledConH, tc.cornerMark);

  // Device border
  ctx.strokeStyle = tc.deviceBorder;
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, devVizW - 2, devVizH - 2);

  const finalW = Math.round(scaledConW / vizScale);
  const finalH = Math.round(scaledConH / vizScale);

  // Info panel
  const maxFill   = calcMaxFill(devW, devH, conW, conH);
  const coverage  = (finalW * finalH) / (devW * devH) * 100;

  infoConEl.textContent      = `${conW}×${conH}`;
  infoScaleEl.textContent    = `${emuScale.toFixed(3)}x`;
  infoFinalEl.textContent    = `${finalW}×${finalH}`;
  infoOutDiagEl.textContent  = calcOutputDiag(finalW, finalH);
  infoCoverageEl.textContent = `${coverage.toFixed(1)}%`;
  infoLeftoverEl.textContent = `${devW - finalW} / ${devH - finalH} px`;

  infoScaleEl.classList.toggle("warning", isUnscalable);

  infoWarningEl.style.display = "none";
}

// ── Dropdown init ─────────────────────────────────────────────────────────
function initDropdown() {
  const categories = [...new Set(CONSOLES.map(c => c.category))];
  categories.forEach(cat => {
    const group = document.createElement("optgroup");
    group.label = cat;
    CONSOLES.filter(c => c.category === cat).sort((a, b) => a.name.localeCompare(b.name)).forEach(con => {
      const opt = document.createElement("option");
      opt.value = con.id;
      opt.textContent = con.name;
      group.appendChild(opt);
    });
    consoleSelect.appendChild(group);
  });
  consoleSelect.value = state.consoleId;
}

// ── Field visibility helpers ──────────────────────────────────────────────
function updateCRTField() {
  const con = getCurrentConsole();
  if (con.hasCRT) {
    crtField.style.display = "flex";
    crtNoteEl.textContent = con.note || "";
  } else {
    crtField.style.display = "none";
    state.crtMode = false;
    crtModeChk.checked = false;
    crtModeLbl.textContent = "OFF";
  }
}

function updateOverscaleField() {
  const disabled = !state.integerScaling;
  overscaleField.classList.toggle("disabled", disabled);
  overscalingChk.disabled = disabled;
  if (disabled) {
    state.overscaling = false;
    overscalingChk.checked = false;
    overscalingLbl.textContent = "OFF";
  }
}

// ── Theme init ────────────────────────────────────────────────────────────
function initThemes() {
  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.theme = btn.dataset.theme;
      document.documentElement.dataset.theme = state.theme;
      document.querySelectorAll(".theme-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      draw();
    });
  });
}

// ── Event listeners ───────────────────────────────────────────────────────
deviceWInput.addEventListener("input", () => {
  state.deviceW = Math.max(1, parseInt(deviceWInput.value) || 1);
  draw();
});

deviceHInput.addEventListener("input", () => {
  state.deviceH = Math.max(1, parseInt(deviceHInput.value) || 1);
  draw();
});

deviceInchInput.addEventListener("input", () => {
  const v = parseFloat(deviceInchInput.value);
  state.deviceInch = v > 0 ? v : null;
  draw();
});

consoleSelect.addEventListener("change", () => {
  state.consoleId = consoleSelect.value;
  updateCRTField();
  draw();
});

integerScalingChk.addEventListener("change", () => {
  state.integerScaling = integerScalingChk.checked;
  integerScalingLbl.textContent = state.integerScaling ? "ON" : "OFF";
  updateOverscaleField();
  draw();
});

overscalingChk.addEventListener("change", () => {
  state.overscaling = overscalingChk.checked;
  overscalingLbl.textContent = state.overscaling ? "ON" : "OFF";
  draw();
});

crtModeChk.addEventListener("change", () => {
  state.crtMode = crtModeChk.checked;
  crtModeLbl.textContent = state.crtMode ? "ON" : "OFF";
  draw();
});

vizScaleInput.addEventListener("input", () => {
  state.vizZoom = parseFloat(vizScaleInput.value);
  vizScaleVal.textContent = `${state.vizZoom.toFixed(1)}x`;
  draw();
});

window.addEventListener("resize", draw);

// ── Bootstrap ─────────────────────────────────────────────────────────────
initDropdown();
updateCRTField();
initThemes();

// Auto-select theme from system preference
(function applySystemTheme() {
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const autoTheme = prefersLight ? 'light' : 'default';
  state.theme = autoTheme;
  document.documentElement.dataset.theme = autoTheme;
  document.querySelectorAll('.theme-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.theme === autoTheme);
  });

  // React to OS-level changes at runtime
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
    const t = e.matches ? 'light' : 'default';
    state.theme = t;
    document.documentElement.dataset.theme = t;
    document.querySelectorAll('.theme-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.theme === t);
    });
    draw();
  });
})();

// ── Help modal ────────────────────────────────────────────────────────────
const helpModal = document.getElementById("helpModal");
document.getElementById("helpBtn").addEventListener("click", () => {
  helpModal.classList.add("open");
});
document.getElementById("helpClose").addEventListener("click", () => {
  helpModal.classList.remove("open");
});
helpModal.addEventListener("click", e => {
  if (e.target === helpModal) helpModal.classList.remove("open");
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") helpModal.classList.remove("open");
});

document.fonts.ready.then(draw);
