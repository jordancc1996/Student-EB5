/** Parse rgb()/rgba() to [r,g,b] or null. */
export function parseRgb(color) {
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return null;
  return m.slice(1, 4).map(Number);
}

/** WCAG 2.x relative luminance contrast ratio. */
export function contrastRatio(foreground, background) {
  const channel = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const lum = (rgb) => {
    const [r, g, b] = rgb.map(channel);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const fg = parseRgb(foreground);
  const bg = parseRgb(background);
  if (!fg || !bg) return null;

  const l1 = lum(fg);
  const l2 = lum(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** Resolve effective background color walking up the DOM. */
export function readEffectiveBackground(el) {
  let node = el;
  while (node && node !== document.documentElement) {
    const bg = getComputedStyle(node).backgroundColor;
    const rgb = parseRgb(bg);
    if (rgb && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      return bg;
    }
    node = node.parentElement;
  }
  return getComputedStyle(document.body).backgroundColor;
}

export function readElementContrast(el) {
  const style = getComputedStyle(el);
  const background = readEffectiveBackground(el);
  return {
    color: style.color,
    background,
    ratio: contrastRatio(style.color, background),
  };
}
