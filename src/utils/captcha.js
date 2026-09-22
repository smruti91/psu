/**
 * High-clarity CAPTCHA generator (replaces `svg-captcha`).
 *
 * Renders crisp SVG <text> characters with:
 *  - solid black bold font (#000)
 *  - white background
 *  - very light grey noise (lines + dots) that does NOT obscure text
 *  - no path distortion, so characters stay clearly readable
 *
 * Pure JS, zero native dependencies. API is compatible with `svg-captcha`:
 *   const { text, data } = Captcha.create({ size: 5 });
 *
 * `data` is an SVG string, `text` is the answer.
 */

'use strict';

const DEFAULT_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CONFUSING_CHARS = new Set(['0', 'O', 'o', '1', 'I', 'i', 'l']);

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickChar(chars) {
  return chars[randInt(0, chars.length - 1)];
}

function randomText(size = 5, charPreset, ignoreChars = '') {
  let chars = (charPreset || DEFAULT_CHARSET).split('');
  if (ignoreChars) {
    const ignore = new Set(ignoreChars.split(''));
    chars = chars.filter((c) => !ignore.has(c));
  }
  // Always strip visually confusing chars for clarity
  chars = chars.filter((c) => !CONFUSING_CHARS.has(c));
  if (chars.length === 0) chars = DEFAULT_CHARSET.split('');

  let out = '';
  for (let i = 0; i < size; i++) out += pickChar(chars);
  return out;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function createCaptcha(text, options = {}) {
  const width = options.width || 200;
  const height = options.height || 70;
  const bg = options.background || '#ffffff';
  const noiseLines = options.noise != null ? options.noise : 2;

  const len = text.length;
  const spacing = width / (len + 1);

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0,0,${width},${height}">`;
  svg += `<rect width="100%" height="100%" fill="${bg}"/>`;

  // Light background dots (very faint, won't hurt readability)
  const dots = options.dots != null ? options.dots : 25;
  for (let i = 0; i < dots; i++) {
    const cx = randInt(4, width - 4);
    const cy = randInt(4, height - 4);
    const r = randInt(1, 2);
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#d0d0d0"/>`;
  }

  // Light interference lines drawn FIRST so text stays on top
  for (let i = 0; i < noiseLines; i++) {
    const x1 = randInt(5, Math.floor(width * 0.3));
    const y1 = randInt(5, height - 5);
    const x2 = randInt(Math.floor(width * 0.7), width - 5);
    const y2 = randInt(5, height - 5);
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#c8c8c8" stroke-width="1.5" opacity="0.7"/>`;
  }

  // Solid black bold characters — always rendered last (on top)
  const fontSize = options.fontSize || 42;
  for (let i = 0; i < len; i++) {
    const x = Math.round(spacing * (i + 1) + randInt(-5, 5));
    const y = Math.round(height / 2 + randInt(12, 16));
    const rotate = randInt(-12, 12);
    const ch = escapeXml(text[i]);
    svg += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" ` +
      `font-family="Arial, Helvetica, Verdana, sans-serif" ` +
      `font-size="${fontSize}px" font-weight="900" font-style="normal" ` +
      `fill="#000000" stroke="#000000" stroke-width="0.6" ` +
      `transform="rotate(${rotate} ${x} ${y})" ` +
      `style="user-select:none;">${ch}</text>`;
  }

  svg += '</svg>';
  return svg;
}

function create(options = {}) {
  const size = options.size || 5;
  const text = randomText(size, options.charPreset, options.ignoreChars);
  const data = createCaptcha(text, options);
  return { text, data };
}

module.exports = createCaptcha;
module.exports.create = create;
module.exports.randomText = randomText;
