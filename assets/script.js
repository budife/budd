(function () {
  "use strict";

  const canvas = document.getElementById("pondCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  const GRAVITY = 0.6;
  const JUMP_STRENGTH = -12;
  const MOVE_SPEED = 4;
  const FRICTION = 0.8;
  const MAX_FALL = 15;

  const keys = { left: false, right: false, jump: false, down: false };

  // Palette — cozy house interior
  const P = {
    // Walls
    wall: "#d4c4a8",
    wallDark: "#b8a888",
    wallLight: "#e8d8c0",
    // Floor (wooden)
    floor: "#8a6a4a",
    floorDark: "#6a4a2a",
    floorLight: "#a88a6a",
    floorLine: "#7a5a3a",
    // Sofa
    sofa: "#6a5a7a",
    sofaDark: "#4a3a5a",
    sofaLight: "#8a7a9a",
    sofaCushion: "#7a6a8a",
    // Rug
    rug: "#c85050",
    rugDark: "#a03030",
    rugLight: "#e07070",
    rugPattern: "#d06060",
    // Window
    window: "#87CEEB",
    windowFrame: "#6a5a4a",
    windowSill: "#8a7a6a",
    // Lamp
    lamp: "#f5c542",
    lampGlow: "#ffd966",
    lampBase: "#5a4a3a",
    // Cat colors (various)
    catOrange: "#e89040",
    catOrangeDark: "#d07030",
    catGray: "#9a9a9a",
    catGrayDark: "#7a7a7a",
    catBlack: "#2a2a2a",
    catWhite: "#f0e8d8",
    catCalico: "#e8c0a0",
    catBrown: "#8a6a4a",
    catBrownDark: "#6a4a2a",
    // Neutrals
    ink: "#2d2d2d",
  };

  // ============================================================
  // FLAT 2D PIXEL-ART GARDEN BACKGROUND
  // ============================================================
  // Palette: sage green, muted teal, warm cream, soft orange, natural brown

  const GARDEN = {
    sky: "#c8dce8",
    skyLight: "#dce8f0",
    cloud: "#f0f4f8",
    grass: "#8a9a7a",
    grassLight: "#9aaa8a",
    grassDark: "#7a8a6a",
    dirt: "#a89070",
    dirtDark: "#887050",
    water: "#6a9a8a",
    waterLight: "#7aaa9a",
    waterDark: "#5a8a7a",
    stone: "#9a9a8a",
    stoneDark: "#7a7a6a",
    stoneLight: "#b0b0a0",
    bush: "#7a9a6a",
    bushDark: "#5a7a4a",
    bushLight: "#9aaa7a",
    tree: "#6a8a5a",
    treeDark: "#4a6a3a",
    treeLight: "#8aaa6a",
    trunk: "#8a6a4a",
    trunkDark: "#6a4a2a",
    flower: "#e8a0a0",
    flowerDark: "#c88080",
    flowerYellow: "#e8d080",
    flowerPink: "#e8a8c0",
  };

  const PLAYGROUND = [
    { x: 0, y: H * 0.88, w: W, h: 12, type: "ground" },
    { x: W * 0.08, y: H * 0.75, w: W * 0.15, h: 8, type: "shelf" },
    { x: W * 0.5, y: H * 0.72, w: W * 0.12, h: 8, type: "shelf" },
    { x: W * 0.2, y: H * 0.58, w: W * 0.12, h: 8, type: "shelf" },
    { x: W * 0.65, y: H * 0.55, w: W * 0.15, h: 8, type: "shelf" },
    { x: W * 0.35, y: H * 0.42, w: W * 0.12, h: 8, type: "shelf" },
    { x: W * 0.75, y: H * 0.38, w: W * 0.1, h: 8, type: "shelf" },
  ];

  function drawShelf(x, y, w, h) {
    ctx.fillStyle = "#8a6a4a";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#6a4a2a";
    ctx.fillRect(x, y + 2, w, h - 2);
    ctx.fillStyle = "#4a2a1a";
    ctx.fillRect(x, y + h - 2, w, 2);
  }

  function drawGardenBackground(now) {
    const time = now * 0.001;

    // Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.5);
    skyGrad.addColorStop(0, GARDEN.skyLight);
    skyGrad.addColorStop(1, GARDEN.sky);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H * 0.5);

    // Clouds (simple pixel blocks)
    ctx.fillStyle = GARDEN.cloud;
    // Cloud 1
    ctx.fillRect(W * 0.1, H * 0.08, 120, 30);
    ctx.fillRect(W * 0.12, H * 0.06, 80, 20);
    ctx.fillRect(W * 0.14, H * 0.1, 60, 15);
    // Cloud 2
    ctx.fillRect(W * 0.6, H * 0.12, 100, 25);
    ctx.fillRect(W * 0.62, H * 0.1, 70, 18);
    ctx.fillRect(W * 0.64, H * 0.14, 50, 12);
    // Cloud 3
    ctx.fillRect(W * 0.85, H * 0.06, 80, 20);
    ctx.fillRect(W * 0.87, H * 0.04, 50, 15);

    // Distant hills
    ctx.fillStyle = GARDEN.grassLight;
    ctx.fillRect(0, H * 0.42, W, H * 0.08);
    // Hill bumps
    for (let i = 0; i < 5; i++) {
      const hx = i * W * 0.2 + W * 0.05;
      ctx.fillRect(hx, H * 0.38, W * 0.15, H * 0.06);
    }

    // Ground (grass area)
    ctx.fillStyle = GARDEN.grass;
    ctx.fillRect(0, H * 0.5, W, H * 0.5);

    // Grass texture (pixel dots)
    ctx.fillStyle = GARDEN.grassDark;
    for (let i = 0; i < 200; i++) {
      const gx = (i * 37) % W;
      const gy = H * 0.5 + (i * 13) % (H * 0.5);
      ctx.fillRect(gx, gy, 2, 2);
    }
    ctx.fillStyle = GARDEN.grassLight;
    for (let i = 0; i < 150; i++) {
      const gx = (i * 53 + 17) % W;
      const gy = H * 0.5 + (i * 23) % (H * 0.5);
      ctx.fillRect(gx, gy, 2, 2);
    }

    // Pond (center-bottom area)
    const pondX = W * 0.45;
    const pondY = H * 0.65;
    const pondW = W * 0.35;
    const pondH = H * 0.2;
    // Pond water
    ctx.fillStyle = GARDEN.water;
    ctx.fillRect(pondX, pondY, pondW, pondH);
    // Water highlight
    ctx.fillStyle = GARDEN.waterLight;
    ctx.fillRect(pondX + 10, pondY + 5, pondW - 20, 8);
    ctx.fillRect(pondX + 20, pondY + 20, pondW - 40, 6);
    // Water dark edge
    ctx.fillStyle = GARDEN.waterDark;
    ctx.fillRect(pondX, pondY + pondH - 4, pondW, 4);
    // Pond rim (stones)
    ctx.fillStyle = GARDEN.stone;
    ctx.fillRect(pondX - 6, pondY - 4, pondW + 12, 6);
    ctx.fillRect(pondX - 6, pondY + pondH - 2, pondW + 12, 6);
    ctx.fillStyle = GARDEN.stoneDark;
    ctx.fillRect(pondX - 6, pondY + pondH + 2, pondW + 12, 4);
    // Pond lily pads
    ctx.fillStyle = GARDEN.grassLight;
    ctx.fillRect(pondX + pondW * 0.2, pondY + pondH * 0.3, 24, 16);
    ctx.fillRect(pondX + pondW * 0.6, pondY + pondH * 0.5, 20, 14);
    // Lily flowers
    ctx.fillStyle = GARDEN.flowerPink;
    ctx.fillRect(pondX + pondW * 0.2 + 8, pondY + pondH * 0.3 - 4, 8, 8);
    ctx.fillRect(pondX + pondW * 0.6 + 6, pondY + pondH * 0.5 - 4, 6, 6);

    // Ground path (dirt)
    ctx.fillStyle = GARDEN.dirt;
    ctx.fillRect(0, H * 0.88, W, H * 0.12);
    ctx.fillStyle = GARDEN.dirtDark;
    for (let i = 0; i < 80; i++) {
      const dx = (i * 47) % W;
      const dy = H * 0.88 + (i * 11) % (H * 0.12);
      ctx.fillRect(dx, dy, 3, 2);
    }

    // Trees (left and right)
    // Tree 1 (left)
    const t1x = W * 0.08;
    const t1y = H * 0.35;
    ctx.fillStyle = GARDEN.trunk;
    ctx.fillRect(t1x, t1y, 16, H * 0.55);
    ctx.fillStyle = GARDEN.trunkDark;
    ctx.fillRect(t1x + 4, t1y, 4, H * 0.55);
    ctx.fillStyle = GARDEN.tree;
    ctx.fillRect(t1x - 40, t1y - 60, 96, 80);
    ctx.fillStyle = GARDEN.treeLight;
    ctx.fillRect(t1x - 30, t1y - 50, 40, 40);
    ctx.fillStyle = GARDEN.treeDark;
    ctx.fillRect(t1x + 10, t1y - 40, 30, 30);
    // Tree 2 (right)
    const t2x = W * 0.9;
    const t2y = H * 0.38;
    ctx.fillStyle = GARDEN.trunk;
    ctx.fillRect(t2x, t2y, 14, H * 0.52);
    ctx.fillStyle = GARDEN.trunkDark;
    ctx.fillRect(t2x + 3, t2y, 4, H * 0.52);
    ctx.fillStyle = GARDEN.tree;
    ctx.fillRect(t2x - 35, t2y - 50, 84, 70);
    ctx.fillStyle = GARDEN.treeLight;
    ctx.fillRect(t2x - 25, t2y - 40, 35, 35);
    ctx.fillStyle = GARDEN.treeDark;
    ctx.fillRect(t2x + 5, t2y - 30, 25, 25);

    // Bushes
    // Bush 1 (left of pond)
    const b1x = W * 0.3;
    const b1y = H * 0.55;
    ctx.fillStyle = GARDEN.bush;
    ctx.fillRect(b1x, b1y, 60, 40);
    ctx.fillStyle = GARDEN.bushDark;
    ctx.fillRect(b1x + 5, b1y + 5, 20, 20);
    ctx.fillStyle = GARDEN.bushLight;
    ctx.fillRect(b1x + 30, b1y + 3, 20, 15);
    // Bush 2 (right of pond)
    const b2x = W * 0.82;
    const b2y = H * 0.58;
    ctx.fillStyle = GARDEN.bush;
    ctx.fillRect(b2x, b2y, 50, 35);
    ctx.fillStyle = GARDEN.bushDark;
    ctx.fillRect(b2x + 3, b2y + 4, 18, 18);
    ctx.fillStyle = GARDEN.bushLight;
    ctx.fillRect(b2x + 25, b2y + 3, 18, 14);
    // Bush 3 (far left)
    const b3x = W * 0.02;
    const b3y = H * 0.52;
    ctx.fillStyle = GARDEN.bush;
    ctx.fillRect(b3x, b3y, 45, 30);
    ctx.fillStyle = GARDEN.bushDark;
    ctx.fillRect(b3x + 3, b3y + 3, 15, 15);

    // Flowers (scattered)
    const flowerColors = [GARDEN.flower, GARDEN.flowerYellow, GARDEN.flowerPink, GARDEN.flowerDark];
    for (let i = 0; i < 12; i++) {
      const fx = 40 + (i * 137) % (W - 80);
      const fy = H * 0.78 + (i * 23) % 40;
      ctx.fillStyle = flowerColors[i % 4];
      ctx.fillRect(fx, fy, 4, 4);
      ctx.fillRect(fx + 2, fy - 3, 2, 3);
      // Stem
      ctx.fillStyle = GARDEN.grassDark;
      ctx.fillRect(fx + 1, fy + 4, 2, 6);
    }

    // Stones (scattered)
    ctx.fillStyle = GARDEN.stone;
    const stones = [
      { x: W * 0.25, y: H * 0.72 },
      { x: W * 0.7, y: H * 0.75 },
      { x: W * 0.5, y: H * 0.52 },
      { x: W * 0.15, y: H * 0.82 },
      { x: W * 0.88, y: H * 0.8 },
    ];
    for (const st of stones) {
      ctx.fillRect(st.x, st.y, 12, 8);
      ctx.fillStyle = GARDEN.stoneDark;
      ctx.fillRect(st.x + 2, st.y + 6, 8, 2);
      ctx.fillStyle = GARDEN.stoneLight;
      ctx.fillRect(st.x + 2, st.y + 1, 4, 3);
      ctx.fillStyle = GARDEN.stone;
    }

    // Floating leaves (animated)
    ctx.fillStyle = GARDEN.grassLight;
    for (let i = 0; i < 6; i++) {
      const lx = (i * 200 + time * 30 * (i % 2 === 0 ? 1 : -1)) % W;
      const ly = H * 0.3 + Math.sin(time * 0.5 + i) * 20 + i * 15;
      ctx.fillRect(lx, ly, 6, 4);
      ctx.fillStyle = GARDEN.grassDark;
      ctx.fillRect(lx + 2, ly + 1, 2, 2);
      ctx.fillStyle = GARDEN.grassLight;
    }

    // Water ripples (animated)
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    const ripple1 = Math.sin(time * 2) * 3;
    ctx.fillRect(pondX + pondW * 0.3 + ripple1, pondY + pondH * 0.4, 20, 2);
    const ripple2 = Math.sin(time * 1.5 + 1) * 4;
    ctx.fillRect(pondX + pondW * 0.6 + ripple2, pondY + pondH * 0.6, 16, 2);

    // Grass sway (animated) - small grass tufts
    ctx.fillStyle = GARDEN.grassDark;
    for (let i = 0; i < 8; i++) {
      const gx = 50 + i * 180;
      const gy = H * 0.48;
      const sway = Math.sin(time * 1.2 + i * 0.7) * 3;
      ctx.fillRect(gx + sway, gy, 2, 8);
      ctx.fillRect(gx + 4 + sway, gy + 2, 2, 6);
      ctx.fillRect(gx - 2 + sway, gy + 1, 2, 5);
    }
  }

  function drawBackground() {
    drawGardenBackground(performance.now());
    // Draw platforms
    for (const plat of PLAYGROUND) {
      if (plat.type === "ground") {
        ctx.fillStyle = "#6a4a2a";
        ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
        ctx.fillStyle = "#8a6a4a";
        ctx.fillRect(plat.x, plat.y, plat.w, 2);
      } else if (plat.type === "shelf") {
        drawShelf(plat.x, plat.y, plat.w, plat.h);
      }
    }
  }

  // ============================================================
  // CAT SYSTEM (10 cats, various colors)
  // ============================================================
  const CAT_COLORS = [
    { body: "#e89040", bodyDark: "#d07030", white: "#f0e8d8" },  // orange
    { body: "#9a9a9a", bodyDark: "#7a7a7a", white: "#f0f0f0" },  // gray
    { body: "#2a2a2a", bodyDark: "#1a1a1a", white: "#e0e0e0" },  // black
    { body: "#f0e8d8", bodyDark: "#d8d0c0", white: "#ffffff" },  // white
    { body: "#e8c0a0", bodyDark: "#d0a080", white: "#f8f0e8" },  // calico
    { body: "#8a6a4a", bodyDark: "#6a4a2a", white: "#d8c8a8" },  // brown
    { body: "#d4a870", bodyDark: "#b88850", white: "#f0e0c8" },  // cream
    { body: "#6a5a8a", bodyDark: "#4a3a6a", white: "#d8d0e8" },  // lilac
    { body: "#5a7a9a", bodyDark: "#3a5a7a", white: "#d0e0f0" },  // blue-gray
    { body: "#a05030", bodyDark: "#803020", white: "#e8c8b0" },  // chocolate
    { body: "#c87040", bodyDark: "#a85030", white: "#f0d8c0" },  // ginger
    { body: "#4a4a5a", bodyDark: "#2a2a3a", white: "#e0e0e8" },  // tuxedo
    { body: "#b0a0c0", bodyDark: "#9080a0", white: "#f0e8f0" },  // lavender
    { body: "#7a9a7a", bodyDark: "#5a7a5a", white: "#e0f0e0" },  // sage
    { body: "#c09060", bodyDark: "#a07040", white: "#f0e0d0" },  // tan
    { body: "#8a5a3a", bodyDark: "#6a3a2a", white: "#e8d0b8" },  // chestnut
    { body: "#a8a8b8", bodyDark: "#888898", white: "#f0f0f8" },  // silver
    { body: "#d8b090", bodyDark: "#b89070", white: "#f8f0e8" },  // peach
    { body: "#6a6a7a", bodyDark: "#4a4a5a", white: "#e8e8f0" },  // slate
    { body: "#e0a060", bodyDark: "#c08040", white: "#f8e8d0" },  // honey
  ];

  const CATS = [];
  // Positions: on sofa and around the house
  const CAT_POSITIONS = [
    { x: W * 0.12, y: H * 0.78, facing: 1 },
    { x: W * 0.22, y: H * 0.72, facing: -1 },
    { x: W * 0.32, y: H * 0.80, facing: 1 },
    { x: W * 0.40, y: H * 0.60, facing: -1 },
    { x: W * 0.48, y: H * 0.75, facing: 1 },
    { x: W * 0.55, y: H * 0.68, facing: -1 },
    { x: W * 0.62, y: H * 0.78, facing: 1 },
    { x: W * 0.70, y: H * 0.62, facing: -1 },
    { x: W * 0.78, y: H * 0.75, facing: 1 },
    { x: W * 0.85, y: H * 0.68, facing: -1 },
  ];

  for (let i = 0; i < 10; i++) {
    const isPlayer = (i === 0);
    const colors = CAT_COLORS[i];
    const pos = CAT_POSITIONS[i];
    CATS.push({
      index: i,
      colors: colors,
      x: pos.x,
      y: pos.y,
      scale: 2.4 + Math.random() * 0.6,
      facing: pos.facing,
      isPlayer: isPlayer,
      state: "sitting",
      stateTime: Math.random() * 3000,
      stateDuration: 2000 + Math.random() * 3000,
      tailAngle: Math.random() * 10,
      headBob: 0,
      blinkTimer: Math.random() * 3000,
      blinkPhase: 0,
      earTwitch: 0,
      earTwitchTimer: Math.random() * 5000,
      breathing: 0,
      vx: 0,
      onGround: false,
      isPlayer: false,
      npcTimer: Math.random() * 2000,
      npcState: "idle",
      npcDir: 1,
      headTurnX: 0,
      headTurnY: 0,
      reactPhase: 0,
      mouseX: -100,
      mouseY: -100,
      nearestCatDist: Infinity,
      dragging: false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      vy: 0,
      // Movement
      moveState: "sitting", // sitting, walking, jumping
      targetX: pos.x,
      targetY: pos.y,
      vx: 0,
      vy: 0,
      walkPhase: Math.random() * Math.PI * 2,
      jumpPhase: 0,
      jumpStartX: 0,
      jumpStartY: 0,
      jumpEndX: 0,
      jumpEndY: 0,
      jumpHeight: 0,
      moveTimer: Math.random() * 2000,
      moveDuration: 3000 + Math.random() * 4000,
    });
  }

  function drawCat(ctx, cat, now) {
    const s = cat.scale;
    const x = cat.x;
    const y = cat.y;
    const facing = cat.facing;
    const colors = cat.colors;

    const breath = Math.sin(now * 0.0012 + cat.index * 0.5) * 1.5;
    const headBob = cat.headBob;
    const tailSway = Math.sin(now * 0.0025 + cat.index * 0.3) * 6;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(facing, 1);

    // Tail
    ctx.save();
    ctx.translate(-12 * s, -2 * s);
    ctx.rotate((tailSway + cat.tailAngle) * 0.05);
    ctx.fillStyle = colors.body;
    ctx.fillRect(-2 * s, 0, 4 * s, 12 * s);
    ctx.fillStyle = colors.white;
    ctx.fillRect(-2 * s, 8 * s, 4 * s, 4 * s);
    ctx.restore();

    // Body (sitting)
    ctx.fillStyle = colors.body;
    ctx.fillRect(-10 * s, -8 * s + breath, 20 * s, 16 * s);
    ctx.fillStyle = colors.white;
    ctx.fillRect(-6 * s, -4 * s + breath, 12 * s, 12 * s);
    ctx.fillStyle = colors.white;
    ctx.fillRect(-8 * s, -10 * s + breath, 16 * s, 8 * s);

    // Head
    const headX = cat.headTurnX * 0.3;
    const headY = cat.headBob * 0.4;
    ctx.save();
    ctx.translate(headX * s, headY * s + breath);

    ctx.fillStyle = colors.white;
    ctx.fillRect(-12 * s, -22 * s, 24 * s, 18 * s);
    ctx.fillStyle = colors.body;
    ctx.fillRect(-10 * s, -20 * s, 6 * s, 10 * s);
    ctx.fillRect(4 * s, -20 * s, 6 * s, 10 * s);
    ctx.fillRect(-2 * s, -22 * s, 4 * s, 6 * s);

    // Ears
    const earTwitch = Math.sin(now * 0.003 + cat.index) * cat.earTwitch;
    ctx.fillStyle = colors.body;
    ctx.fillRect(-14 * s, -26 * s + earTwitch, 6 * s, 8 * s);
    ctx.fillStyle = colors.white;
    ctx.fillRect(-12 * s, -24 * s + earTwitch, 2 * s, 4 * s);
    ctx.fillStyle = colors.body;
    ctx.fillRect(8 * s, -26 * s - earTwitch, 6 * s, 8 * s);
    ctx.fillStyle = colors.white;
    ctx.fillRect(10 * s, -24 * s - earTwitch, 2 * s, 4 * s);

    // Eyes
    const blink = cat.blinkPhase > 0.9 ? 0.15 : 1;
    const eyeY = -14 * s;
    ctx.fillStyle = P.ink;
    ctx.fillRect(-8 * s, eyeY, 4 * s, 4 * s * blink);
    ctx.fillRect(4 * s, eyeY, 4 * s, 4 * s * blink);
    if (blink > 0.5) {
      ctx.fillStyle = colors.white;
      ctx.fillRect(-7 * s, eyeY + 0.5 * s, 1.5 * s, 1.5 * s);
      ctx.fillRect(5 * s, eyeY + 0.5 * s, 1.5 * s, 1.5 * s);
    }

    // Nose
    ctx.fillStyle = colors.bodyDark;
    ctx.fillRect(-1 * s, -8 * s, 2 * s, 2 * s);

    // Mouth
    ctx.fillStyle = P.ink;
    ctx.fillRect(-2 * s, -6 * s, 1 * s, 1 * s);
    ctx.fillRect(1 * s, -6 * s, 1 * s, 1 * s);

    // Whiskers
    ctx.fillStyle = colors.white;
    ctx.fillRect(-16 * s, -10 * s, 4 * s, 0.5 * s);
    ctx.fillRect(-16 * s, -8 * s, 4 * s, 0.5 * s);
    ctx.fillRect(-16 * s, -6 * s, 4 * s, 0.5 * s);

    ctx.restore();

    // Legs
    if (cat.moveState === "falling") {
      // Tucked legs while falling
      ctx.fillStyle = colors.white;
      ctx.fillRect(-6 * s, 2 * s + breath, 4 * s, 4 * s);
      ctx.fillRect(2 * s, 2 * s + breath, 4 * s, 4 * s);
      ctx.fillStyle = colors.body;
      ctx.fillRect(-4 * s, 2 * s + breath, 2 * s, 4 * s);
      ctx.fillRect(2 * s, 2 * s + breath, 2 * s, 4 * s);
    } else if (cat.moveState === "walking") {
      const legSwing = Math.sin(cat.walkPhase) * 4 * s;
      ctx.fillStyle = colors.white;
      ctx.fillRect(-8 * s, 6 * s + breath + legSwing, 4 * s, 6 * s);
      ctx.fillRect(4 * s, 6 * s + breath - legSwing, 4 * s, 6 * s);
      ctx.fillStyle = colors.body;
      ctx.fillRect(-6 * s, 6 * s + breath - legSwing, 4 * s, 6 * s);
      ctx.fillRect(2 * s, 6 * s + breath + legSwing, 4 * s, 6 * s);
    } else {
      // Sitting paws
      ctx.fillStyle = colors.white;
      ctx.fillRect(-8 * s, 6 * s + breath, 6 * s, 4 * s);
      ctx.fillRect(2 * s, 6 * s + breath, 6 * s, 4 * s);
      ctx.fillStyle = P.ink;
      ctx.fillRect(-7 * s, 8 * s + breath, 1 * s, 1 * s);
      ctx.fillRect(-5 * s, 8 * s + breath, 1 * s, 1 * s);
      ctx.fillRect(3 * s, 8 * s + breath, 1 * s, 1 * s);
      ctx.fillRect(5 * s, 8 * s + breath, 1 * s, 1 * s);
    }

    ctx.restore();
  }

  function updateCat(cat, dt, now) {
    cat.breathing = Math.sin(now * 0.0012 + cat.index * 0.5);
    cat.tailAngle = Math.sin(now * 0.0025 + cat.index * 0.3) * 12;
    cat.blinkTimer += dt;
    if (cat.blinkTimer > 3000 + cat.index * 500) {
      cat.blinkPhase = 1;
      cat.blinkTimer = 0;
    }
    if (cat.blinkPhase > 0) {
      cat.blinkPhase -= dt / 120;
      if (cat.blinkPhase < 0) cat.blinkPhase = 0;
    }
    cat.earTwitchTimer += dt;
    if (cat.earTwitchTimer > 5000 + cat.index * 1000) {
      cat.earTwitch = 1;
      cat.earTwitchTimer = 0;
    }
    cat.earTwitch *= 0.95;
    cat.headBob = Math.sin(now * 0.0008 + cat.index * 0.7) * 2;

    if (cat.dragging) return;

    // Falling state
    if (cat.moveState === "falling") {
      cat.vy += 0.8;
      cat.y += cat.vy;
      let landY = H * 0.88 - 2;
      for (const plat of PLAYGROUND) {
        if (plat.type === "tree") continue;
        if (cat.x >= plat.x && cat.x <= plat.x + plat.w) {
          if (plat.y > cat.y && plat.y < landY) landY = plat.y - 2;
        }
      }
      if (cat.y >= landY) {
        cat.y = landY;
        cat.vy = 0;
        cat.moveState = "sitting";
        cat.moveTimer = 0;
        cat.moveDuration = 3000 + Math.random() * 5000;
        cat.targetX = cat.x;
        cat.targetY = cat.y;
        cat.onGround = true;
      }
      const mdx = cat.mouseX - cat.x;
      const mdy = cat.mouseY - cat.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 120) {
        cat.headTurnX = Math.max(-10, Math.min(10, mdx * 0.03));
        cat.headTurnY = Math.max(-6, Math.min(6, mdy * 0.03));
      } else {
        cat.headTurnX *= 0.95;
        cat.headTurnY *= 0.95;
      }
      return;
    }

    // Player cat
    if (cat.isPlayer) {
      if (keys.left) { cat.vx -= 0.8; cat.facing = -1; }
      else if (keys.right) { cat.vx += 0.8; cat.facing = 1; }
      else { cat.vx *= FRICTION; }
      cat.vx = Math.max(-MOVE_SPEED, Math.min(MOVE_SPEED, cat.vx));
      if (Math.abs(cat.vx) < 0.1) cat.vx = 0;

      if (keys.jump && cat.onGround) {
        cat.vy = JUMP_STRENGTH;
        cat.onGround = false;
      }

      if (keys.down && cat.onGround) {
        cat.y += 5;
        cat.onGround = false;
        cat.vy = 2;
      }

      cat.vy += GRAVITY;
      cat.vy = Math.min(cat.vy, MAX_FALL);

      const newX = cat.x + cat.vx;
      if (newX < 10 * (cat.scale || 2.5)) cat.vx = 0;
      else if (newX > W - 10 * (cat.scale || 2.5)) cat.vx = 0;
      else cat.x = newX;

      const newY = cat.y + cat.vy;
      const coll = checkPlatformCollision(cat, cat.x, newY);
      if (coll) {
        if (coll.type === "land") {
          cat.y = coll.y;
          cat.vy = 0;
          cat.onGround = true;
        } else if (coll.type === "hit") {
          cat.y = coll.y;
          cat.vy = 0;
        }
      } else {
        cat.y = newY;
        cat.onGround = false;
      }

      if (cat.y > H * 0.88 - 2) {
        cat.y = H * 0.88 - 2;
        cat.vy = 0;
        cat.onGround = true;
      }

      if (Math.abs(cat.vx) > 0.5) {
        cat.walkPhase = (cat.walkPhase || 0) + Math.abs(cat.vx) * 0.1;
        cat.moveState = "walking";
      } else {
        cat.moveState = "sitting";
      }

      const mdx = cat.mouseX - cat.x;
      const mdy = cat.mouseY - cat.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 120) {
        cat.headTurnX = Math.max(-10, Math.min(10, mdx * 0.03));
        cat.headTurnY = Math.max(-6, Math.min(6, mdy * 0.03));
      } else {
        cat.headTurnX *= 0.95;
        cat.headTurnY *= 0.95;
      }
      return;
    }

    // NPC physics
    if (!cat.onGround) {
      cat.vy += GRAVITY;
      cat.vy = Math.min(cat.vy, MAX_FALL);
      const newY = cat.y + cat.vy;
      const coll = checkPlatformCollision(cat, cat.x, newY);
      if (coll && coll.type === "land") {
        cat.y = coll.y;
        cat.vy = 0;
        cat.onGround = true;
      } else {
        cat.y = newY;
      }
      if (cat.y > H * 0.88 - 2) {
        cat.y = H * 0.88 - 2;
        cat.vy = 0;
        cat.onGround = true;
      }
    }

    // NPC behavior
    cat.npcTimer = (cat.npcTimer || 0) + dt;
    if (cat.npcTimer > 3000 + Math.random() * 4000) {
      cat.npcTimer = 0;
      const r = Math.random();
      if (r < 0.5) cat.npcState = "idle";
      else if (r < 0.8) {
        cat.npcState = "walk";
        cat.npcDir = Math.random() < 0.5 ? -1 : 1;
        cat.npcWalkDuration = 1000 + Math.random() * 2000;
        cat.npcWalkTimer = 0;
      } else if (cat.onGround && r < 0.9) {
        cat.npcState = "jump";
        cat.vy = JUMP_STRENGTH * 0.8;
        cat.onGround = false;
        cat.npcDir = Math.random() < 0.5 ? -1 : 1;
      }
    }

    if (cat.npcState === "walk") {
      cat.npcWalkTimer = (cat.npcWalkTimer || 0) + dt;
      if (cat.npcWalkTimer > (cat.npcWalkDuration || 2000)) {
        cat.npcState = "idle";
        cat.npcTimer = 0;
      } else {
        const step = cat.npcDir * 0.5;
        const newX = cat.x + step;
        if (newX > 10 * (cat.scale || 2.5) && newX < W - 10 * (cat.scale || 2.5)) {
          cat.x = newX;
          cat.facing = cat.npcDir;
          cat.walkPhase = (cat.walkPhase || 0) + 0.1;
          cat.moveState = "walking";
        } else {
          cat.npcState = "idle";
        }
        const below = checkPlatformCollision(cat, cat.x, cat.y + 5);
        if (!below && cat.onGround) {
          cat.onGround = false;
        }
      }
    } else {
      cat.moveState = "sitting";
      cat.walkPhase = 0;
    }

    if (cat.npcState === "jump") {
      cat.moveState = "walking";
      cat.walkPhase = (cat.walkPhase || 0) + 0.1;
    }

    const mdx = cat.mouseX - cat.x;
    const mdy = cat.mouseY - cat.y;
    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
    if (mdist < 120) {
      cat.headTurnX = Math.max(-10, Math.min(10, mdx * 0.03));
      cat.headTurnY = Math.max(-6, Math.min(6, mdy * 0.03));
    } else {
      cat.headTurnX *= 0.95;
      cat.headTurnY *= 0.95;
    }
  }

  // INTERACTION
  // ============================================================
  const mouse = { x: -100, y: -100, down: false };

  function getCanvasPos(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  }

  function handlePointerMove(e) {
    const pos = getCanvasPos(e.clientX, e.clientY);
    mouse.x = pos.x; mouse.y = pos.y;
    let overCat = false;
    for (const cat of CATS) {
      if (cat.dragging) {
        cat.x = pos.x - cat.dragOffsetX;
        cat.y = pos.y - cat.dragOffsetY;
        cat.facing = 1;
        canvas.style.cursor = "grabbing";
        return;
      }
      cat.mouseX = pos.x; cat.mouseY = pos.y;
      const dx = pos.x - cat.x; const dy = pos.y - cat.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 30 * cat.scale) overCat = true;
    }
    canvas.style.cursor = overCat ? "grab" : "default";
  }

  function handlePointerDown(e) {
    const pos = getCanvasPos(e.clientX, e.clientY);
    mouse.down = true;
    mouse.downTime = performance.now();
    for (const c of CATS) c._clicked = false;
    mouse.downPos = { x: pos.x, y: pos.y };
    // Check if clicking on a cat to drag
    for (let i = CATS.length - 1; i >= 0; i--) {
      const cat = CATS[i];
      const dx = pos.x - cat.x; const dy = pos.y - cat.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 30 * cat.scale) {
        cat.dragging = true;
        canvas.style.cursor = "grabbing";
        cat.dragOffsetX = pos.x - cat.x;
        cat.dragOffsetY = pos.y - cat.y;
        cat.moveState = "sitting";
        return;
      }
    }
    // Otherwise react
    for (const cat of CATS) {
      const dx = pos.x - cat.x; const dy = pos.y - cat.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        cat.headTurnX = Math.max(-10, Math.min(10, dx * 0.03));
        cat.headTurnY = Math.max(-6, Math.min(6, dy * 0.03));
      }
    }
  }

  function handlePointerUp() {
    mouse.down = false;
    const wasClick = performance.now() - (mouse.downTime || 0) < 200;
    for (const cat of CATS) {
      if (cat.dragging) {
        cat.dragging = false;
        cat.moveState = "falling";
        cat.vy = 0;
        cat.moveTimer = 0;
        // Keep X position, fall vertically
      }
    }
  }
  function handleKeyDown(e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    switch (e.code) {
      case "ArrowLeft": case "KeyA": keys.left = true; e.preventDefault(); break;
      case "ArrowRight": case "KeyD": keys.right = true; e.preventDefault(); break;
      case "ArrowUp": case "KeyW": case "Space": keys.jump = true; e.preventDefault(); break;
      case "ArrowDown": case "KeyS": keys.down = true; e.preventDefault(); break;
    }
  }
  function handleKeyUp(e) {
    switch (e.code) {
      case "ArrowLeft": case "KeyA": keys.left = false; break;
      case "ArrowRight": case "KeyD": keys.right = false; break;
      case "ArrowUp": case "KeyW": case "Space": keys.jump = false; break;
      case "ArrowDown": case "KeyS": keys.down = false; break;
    }
  }
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  function getPlatforms() {
    return PLAYGROUND.filter(p => p.type !== "tree");
  }

  function checkPlatformCollision(cat, newX, newY) {
    const catW = 10 * (cat.scale || 2.5);
    const catH = 16 * (cat.scale || 2.5);
    const catLeft = newX - catW / 2;
    const catRight = newX + catW / 2;
    const catTop = newY - catH;
    const catBottom = newY;

    for (const plat of getPlatforms()) {
      const platLeft = plat.x;
      const platRight = plat.x + plat.w;
      const platTop = plat.y;

      if (catRight > platLeft && catLeft < platRight) {
        if (cat.vy >= 0 && catBottom >= platTop && catBottom <= platTop + plat.h + 5) {
          return { type: "land", y: platTop };
        }
        if (cat.vy < 0 && catTop <= platTop + plat.h && catTop >= platTop - 5) {
          return { type: "hit", y: platTop + plat.h + catH };
        }
      }
    }
    return null;
  }


  canvas.addEventListener("mousemove", handlePointerMove);
  canvas.addEventListener("mousedown", handlePointerDown);
  canvas.addEventListener("mouseup", handlePointerUp);
  canvas.addEventListener("mouseleave", function () { mouse.x = -100; mouse.y = -100; });
  canvas.addEventListener("touchmove", function (e) {
    e.preventDefault(); const touch = e.touches[0];
    handlePointerMove({ clientX: touch.clientX, clientY: touch.clientY });
  }, { passive: false });
  canvas.addEventListener("touchstart", function (e) {
    e.preventDefault(); const touch = e.touches[0];
    handlePointerDown({ clientX: touch.clientX, clientY: touch.clientY });
  }, { passive: false });
  canvas.addEventListener("touchend", function () { handlePointerUp(); });

  // Secondary CTA
  const secondaryCta = document.querySelector(".btn--secondary");
  if (secondaryCta) {
    secondaryCta.addEventListener("click", function (e) {
      e.preventDefault();
      const projects = document.getElementById("projects");
      if (projects) projects.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Navbar
  const navbar = document.getElementById("navbar");
  function updateNavbar() {
    const scrollY = window.scrollY;
    if (scrollY > 60) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  }
  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();

  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", function () {
      const expanded = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", String(!expanded));
      mobileMenu.classList.toggle("open");
    });
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ============================================================
  // MAIN LOOP
  // ============================================================
  let lastTime = performance.now();
  let running = true;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function render(now) {
    try {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;
      ctx.clearRect(0, 0, W, H);
      drawBackground();

      if (!prefersReducedMotion) {
        for (const cat of CATS) { updateCat(cat, dt, now); drawCat(ctx, cat, now); }
      } else {
        for (const cat of CATS) drawCat(ctx, cat, now);
      }

      if (running) requestAnimationFrame(render);
    } catch (e) {
      console.error("Render error:", e.message, e.stack);
    }
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) running = false;
    else { running = true; lastTime = performance.now(); requestAnimationFrame(render); }
  });

  requestAnimationFrame(render);

  // Injected scrolled navbar styles
  const style = document.createElement("style");
  style.textContent = `
    .navbar.scrolled {
      background: rgba(10, 30, 20, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom-color: rgba(74, 222, 128, 0.15);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
    }
    .navbar.scrolled .navbar__logo-text { color: var(--ink); }
    .navbar.scrolled .nav-link { color: var(--ink-soft); }
    .navbar.scrolled .nav-link:hover { color: var(--accent); background: rgba(74, 222, 128, 0.08); }
    .navbar.scrolled .navbar__status { color: var(--ink-soft); background: rgba(74, 222, 128, 0.08); }
    .navbar.scrolled .navbar__menu-btn { color: var(--ink); border-color: var(--border-strong); }
  `;
  document.head.appendChild(style);


})();
