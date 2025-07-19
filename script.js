function generatePalette() {
  const palette = document.getElementById("palette");
  const baseColor = document.getElementById("colorPicker").value;
  palette.innerHTML = "";

  const hsl = hexToHSL(baseColor);
  const variations = [-30, -15, 0, 15, 30];

  variations.forEach((shift) => {
    const newL = Math.min(100, Math.max(0, hsl.l + shift));
    const hslColor = `hsl(${hsl.h}, ${hsl.s}%, ${newL}%)`;
    const hex = hslToHex(hsl.h, hsl.s, newL);

    const colorBox = document.createElement("div");
    colorBox.className = "color-box";
    colorBox.style.backgroundColor = hslColor;

    const hexText = document.createElement("div");
    hexText.className = "hex-code";
    hexText.innerText = hex;

    colorBox.appendChild(hexText);

    colorBox.addEventListener("click", () => {
      navigator.clipboard.writeText(hex);
      hexText.innerText = "Copied!";
      setTimeout(() => (hexText.innerText = hex), 1000);
    });

    palette.appendChild(colorBox);
  });
}

// Convert HEX to HSL
function hexToHSL(hex) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max != min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h *= 60;
  }

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Convert HSL to HEX
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    Math.round(
      255 *
        (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))
    );

  return `#${[f(0), f(8), f(4)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('')}`;
}

// Load initial palette
window.onload = () => {
  document.getElementById("colorPicker").value = "#5e60ce";
  generatePalette();
};
