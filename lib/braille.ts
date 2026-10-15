/** English Grade 1 (uncontracted) as Unicode Braille Patterns.
 *  Dot numbers are the literary alphabet: letters, digit reuse of a–j,
 *  and the punctuation cells shared by that alphabet.
 *  U+2800 + bit (dot 1 = bit 0 … dot 6 = bit 5).
 */

export type CellInfo = {
  name: string;
  glyph: string;
  dots: string;
};

type DotList = readonly number[];

function glyphFromDots(dots: DotList): string {
  let mask = 0;
  for (const dot of dots) mask |= 1 << (dot - 1);
  return String.fromCodePoint(0x2800 + mask);
}

function dotsLabel(dots: DotList): string {
  return dots.join("-");
}

const LETTER_DOTS: Record<string, DotList> = {
  a: [1],
  b: [1, 2],
  c: [1, 4],
  d: [1, 4, 5],
  e: [1, 5],
  f: [1, 2, 4],
  g: [1, 2, 4, 5],
  h: [1, 2, 5],
  i: [2, 4],
  j: [2, 4, 5],
  k: [1, 3],
  l: [1, 2, 3],
  m: [1, 3, 4],
  n: [1, 3, 4, 5],
  o: [1, 3, 5],
  p: [1, 2, 3, 4],
  q: [1, 2, 3, 4, 5],
  r: [1, 2, 3, 5],
  s: [2, 3, 4],
  t: [2, 3, 4, 5],
  u: [1, 3, 6],
  v: [1, 2, 3, 6],
  w: [2, 4, 5, 6],
  x: [1, 3, 4, 6],
  y: [1, 3, 4, 5, 6],
  z: [1, 3, 5, 6],
};

const PUNCT_DOTS: Record<string, DotList> = {
  ",": [2],
  ";": [2, 3],
  ":": [2, 5],
  ".": [2, 5, 6],
  "!": [2, 3, 5],
  "?": [2, 3, 6],
  "'": [3],
  "-": [3, 6],
};

const CAPITAL_DOTS: DotList = [6];
const NUMBER_DOTS: DotList = [3, 4, 5, 6];
const LETTER_SIGN_DOTS: DotList = [5, 6];

export const CAPITAL_SIGN = glyphFromDots(CAPITAL_DOTS);
export const NUMBER_SIGN = glyphFromDots(NUMBER_DOTS);
export const LETTER_SIGN = glyphFromDots(LETTER_SIGN_DOTS);

const letterCell: Record<string, string> = {};
const cellToLetter: Record<string, string> = {};
for (const [letter, dots] of Object.entries(LETTER_DOTS)) {
  const glyph = glyphFromDots(dots);
  letterCell[letter] = glyph;
  cellToLetter[glyph] = letter;
}

const digitCell: Record<string, string> = {
  "1": letterCell.a,
  "2": letterCell.b,
  "3": letterCell.c,
  "4": letterCell.d,
  "5": letterCell.e,
  "6": letterCell.f,
  "7": letterCell.g,
  "8": letterCell.h,
  "9": letterCell.i,
  "0": letterCell.j,
};

const cellToDigit: Record<string, string> = {};
for (const [digit, glyph] of Object.entries(digitCell)) cellToDigit[glyph] = digit;

const punctCell: Record<string, string> = {};
const cellToPunct: Record<string, string> = {};
for (const [mark, dots] of Object.entries(PUNCT_DOTS)) {
  const glyph = glyphFromDots(dots);
  punctCell[mark] = glyph;
  cellToPunct[glyph] = mark;
}

const PUNCT_NAMES: Record<string, string> = {
  ",": "comma",
  ";": "semicolon",
  ":": "colon",
  ".": "period",
  "!": "exclamation mark",
  "?": "question mark",
  "'": "apostrophe",
  "-": "hyphen",
};

export const CELLS: CellInfo[] = [
  ...Object.entries(LETTER_DOTS).map(([letter, dots]) => ({
    name: `letter ${letter}`,
    glyph: glyphFromDots(dots),
    dots: dotsLabel(dots),
  })),
  ...Object.entries(PUNCT_DOTS).map(([mark, dots]) => ({
    name: PUNCT_NAMES[mark],
    glyph: glyphFromDots(dots),
    dots: dotsLabel(dots),
  })),
  { name: "capital sign", glyph: CAPITAL_SIGN, dots: dotsLabel(CAPITAL_DOTS) },
  { name: "number sign", glyph: NUMBER_SIGN, dots: dotsLabel(NUMBER_DOTS) },
  { name: "letter sign", glyph: LETTER_SIGN, dots: dotsLabel(LETTER_SIGN_DOTS) },
];

export function cellForDate(date: Date): CellInfo {
  const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  let n = 0;
  for (const ch of key) n = (Math.imul(n, 33) + ch.charCodeAt(0)) >>> 0;
  return CELLS[n % CELLS.length];
}

function isDigit(ch: string): boolean {
  return ch >= "0" && ch <= "9";
}

function isLetterAtoJ(letter: string): boolean {
  return letter >= "a" && letter <= "j";
}

export function textToBraille(input: string): string {
  let out = "";
  const chars = Array.from(input);
  let i = 0;
  while (i < chars.length) {
    const ch = chars[i];
    if (ch === "\r") {
      i += 1;
      continue;
    }
    if (isDigit(ch)) {
      out += NUMBER_SIGN;
      while (i < chars.length && isDigit(chars[i])) {
        out += digitCell[chars[i]];
        i += 1;
      }
      continue;
    }
    const lower = ch.toLowerCase();
    if (letterCell[lower]) {
      const prev = i > 0 ? chars[i - 1] : "";
      if (isDigit(prev) && isLetterAtoJ(lower)) out += LETTER_SIGN;
      if (ch !== lower) out += CAPITAL_SIGN;
      out += letterCell[lower];
      i += 1;
      continue;
    }
    if (punctCell[ch]) {
      out += punctCell[ch];
      i += 1;
      continue;
    }
    out += ch;
    i += 1;
  }
  return out;
}

export function brailleToText(input: string): string {
  let out = "";
  let numeric = false;
  let capital = false;
  let forceLetter = false;
  for (const ch of input) {
    if (ch === "\r") continue;
    if (ch === CAPITAL_SIGN) {
      capital = true;
      continue;
    }
    if (ch === NUMBER_SIGN) {
      numeric = true;
      forceLetter = false;
      capital = false;
      continue;
    }
    if (ch === LETTER_SIGN) {
      numeric = false;
      forceLetter = true;
      continue;
    }
    if (ch === " " || ch === "\n" || ch === "\t") {
      numeric = false;
      capital = false;
      forceLetter = false;
      out += ch;
      continue;
    }
    if (cellToPunct[ch]) {
      numeric = false;
      capital = false;
      forceLetter = false;
      out += cellToPunct[ch];
      continue;
    }
    if (numeric && !forceLetter && cellToDigit[ch]) {
      out += cellToDigit[ch];
      capital = false;
      continue;
    }
    if (cellToLetter[ch]) {
      const letter = cellToLetter[ch];
      out += capital ? letter.toUpperCase() : letter;
      numeric = false;
      capital = false;
      forceLetter = false;
      continue;
    }
    numeric = false;
    capital = false;
    forceLetter = false;
    out += ch;
  }
  return out;
}
