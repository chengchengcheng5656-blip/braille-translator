"use client";

import { useMemo, useState } from "react";
import { brailleToText, textToBraille } from "@/lib/braille";

type Mode = "to-braille" | "to-text";
type CopyState = "idle" | "copied" | "failed";

async function writeClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await Promise.race([
        navigator.clipboard.writeText(text),
        new Promise((_, reject) => window.setTimeout(() => reject(new Error("timeout")), 800)),
      ]);
      return true;
    } catch {
      /* The async clipboard API is blocked in some browsers. */
    }
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "0";
    area.style.left = "0";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.focus();
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

export function Translator() {
  const [source, setSource] = useState("");
  const [mode, setMode] = useState<Mode>("to-braille");
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const output = useMemo(() => {
    if (source.length === 0) return "";
    return mode === "to-braille" ? textToBraille(source) : brailleToText(source);
  }, [source, mode]);

  const toBraille = mode === "to-braille";

  async function copy() {
    if (!output) return;
    const wrote = await writeClipboard(output);
    setCopyState(wrote ? "copied" : "failed");
    window.setTimeout(() => setCopyState("idle"), 1600);
  }

  return (
    <div className="tool">
      <div className="dir-row">
        <span className="dir-label" id="dir-label">
          Direction
        </span>
        <button
          type="button"
          className="dir"
          aria-pressed={!toBraille}
          onClick={() => {
            setMode(toBraille ? "to-text" : "to-braille");
            setCopyState("idle");
          }}
        >
          {toBraille ? "Text → braille" : "Braille → text"}
        </button>
      </div>
      <label htmlFor="source">Input</label>
      <textarea
        id="source"
        value={source}
        onChange={(event) => {
          setSource(event.target.value);
          setCopyState("idle");
        }}
        rows={5}
        spellCheck={toBraille}
        autoComplete="off"
        placeholder={toBraille ? "Type here. Try hello world." : "Paste Unicode braille here."}
      />
      <div className="out-wrap">
        <span id="out-label">{toBraille ? "Braille" : "Text"}</span>
        <div className="out-box">
          <pre
            className={output.length === 0 ? "out is-empty" : "out"}
            aria-labelledby="out-label"
            aria-live="polite"
          >
            {output.length === 0 ? "Output shows up here." : output}
          </pre>
          <button type="button" className="copy" onClick={copy} disabled={output.length === 0}>
            {copyState === "copied" ? "Copied" : copyState === "failed" ? "Copy failed" : "Copy"}
          </button>
        </div>
      </div>
      <p className="grade">
        Grade 1 braille (uncontracted), based on the Unicode Braille Patterns standard.
      </p>
    </div>
  );
}
