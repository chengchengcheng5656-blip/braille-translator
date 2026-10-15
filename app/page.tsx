import type { Metadata } from "next";
import { CellOfTheDay } from "./cell-of-the-day";
import { Translator } from "./translator";
import { cellForDate } from "@/lib/braille";

const title = "Braille Translator — Convert Text to Braille Instantly";
const description =
  "Free braille translator: convert text to braille and braille back to text instantly, with a braille alphabet chart, numbers and keyboard guides.";

export async function generateMetadata(): Promise<Metadata> {
  return { title, description };
}

const faqs = [
  {
    q: "Why does a capital letter add a cell in front?",
    a: "Grade 1 uses one cell shape for a letter, upper or lower case. The capital sign, a cell with only dot 6 (⠠), is written immediately before the letter. “H” is ⠠⠓: the first cell is the indicator, and the second cell is h.",
  },
  {
    q: "How does this braille translator write numbers?",
    a: "Digits reuse the cells for a through j, standing for 1 through 9 and 0. A number sign, dots 3-4-5-6 (⠼), is placed in front of the run so those cells are read as digits. “7” is ⠼⠛, the cell for g with the number sign before it.",
  },
  {
    q: "Can I paste Unicode braille and get the letters back?",
    a: "Switch the direction to Braille to text and paste Unicode braille into the box. Capital signs and number signs are read back into uppercase letters and digits. A string this page produced converts back to the same text.",
  },
  {
    q: "Is this Grade 2 contracted braille?",
    a: "This braille translator writes Grade 1, uncontracted braille, one cell per letter. Grade 2 shortens common words with contractions, and those short forms are not produced here. A contracted book will not match this output line for line.",
  },
  {
    q: "Which punctuation does the converter cover?",
    a: "Period, comma, question mark, exclamation mark, apostrophe, hyphen, colon, and semicolon each have a Grade 1 cell. Letters and digits are covered too. Any other character is left unchanged so you can see it was not converted.",
  },
];

const webApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Braille Translator",
  description,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any",
  inLanguage: "en",
  dateModified: "2026-10-15",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  dateModified: "2026-10-15",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function HomePage() {
  const today = cellForDate(new Date());

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <a className="skip" href="#source">
        Skip to input
      </a>
      <p className="updated">Last updated: 2026-10-15</p>
      <h1>Braille translator that turns letters into Unicode dots</h1>
      <p className="hero">
        Paste text. Grade 1 cells appear at once. Switch the direction to read dots as letters.
      </p>
      <Translator />
      <CellOfTheDay initial={today} />

      <section>
        <h2>This tool in one line</h2>
        <p>
          This braille translator turns plain text into Grade 1 Unicode braille, and turns those cells
          back into text.
        </p>
      </section>

      <section>
        <h2>How to use it</h2>
        <ol>
          <li>Leave the switch on Text to braille, or flip it to Braille to text.</li>
          <li>Type or paste into the box. hello world is a useful first check.</li>
          <li>Read the cells in the output. A capital or a number takes an extra cell in front.</li>
          <li>Press Copy to take the Unicode braille string.</li>
          <li>Use Braille Cell of the Day when you want one cell named, with its dot numbers.</li>
        </ol>
        <figure className="slot">
          <p>
            [IMG: 输入 hello world 后输出区是对应 Unicode 盲文的界面 + alt: Braille translator
            converting hello world into Unicode braille cells]
          </p>
          <p>braille-translator-text-to-braille.webp</p>
        </figure>
      </section>

      <section>
        <h2>Grade 1 vs Grade 2</h2>
        <p>
          The output of this braille translator is Grade 1 braille, also called uncontracted braille.
          Each letter keeps its own cell, so a word is spelled the way it is written.
        </p>
        <p>
          Grade 2, the contracted code used in most published books, folds common words and letter
          groups into shorter signs. Grade 1 is the form used here because every cell maps back to one
          character. The conversion stays predictable, reversible, and suited to teaching and to basic
          transcription.
        </p>
      </section>

      <section>
        <h2>What the extra dots mean</h2>
        <p>
          A capital letter is the same cell as its lowercase partner. Grade 1 puts the capital sign,
          dot 6 (⠠), in front of the letter. H is two cells: ⠠⠓. The extra cell tells you the case. It
          is not a second spelling of the letter.
        </p>
        <p>
          Digits reuse the cells for a through j. The number sign, dots 3-4-5-6 (⠼), sits in front of a
          run of digits, and the cells that follow are 1 through 9 and 0. 7 is ⠼⠛. When a letter from a
          to j follows digits in the same word, a letter sign, dots 5-6 (⠰), marks the return to
          letters, so 1a is not read as 11.
        </p>
        <figure className="slot">
          <p>
            [IMG: 大写 H 前面单独一格大写符号的两个盲文格 + alt: Capital indicator cell placed before
            the letter H]
          </p>
          <p>braille-translator-capital-sign.webp</p>
        </figure>
      </section>

      <section>
        <h2>FAQ</h2>
        {faqs.map((item) => (
          <article key={item.q}>
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </article>
        ))}
      </section>

      <section>
        <h2>Where to go next</h2>
        <ul>
          <li>
            <a href="/braille-alphabet">Braille alphabet chart</a>. Each letter cell, with its dots.
          </li>
          <li>
            <a href="/braille-numbers">Braille numbers</a>. The number sign and the digit cells.
          </li>
          <li>
            <a href="/braille-keyboard">Braille keyboard layout</a>. Where the six dots sit on a
            keyboard.
          </li>
        </ul>
      </section>
    </main>
  );
}
