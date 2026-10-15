"use client";

import { useState } from "react";
import { CELLS, type CellInfo } from "@/lib/braille";

export function CellOfTheDay({ initial }: { initial: CellInfo }) {
  const [cell, setCell] = useState(initial);

  function refresh() {
    if (CELLS.length < 2) return;
    let next = cell;
    while (next.glyph === cell.glyph && next.name === cell.name) {
      next = CELLS[Math.floor(Math.random() * CELLS.length)];
    }
    setCell(next);
  }

  return (
    <section className="day" aria-labelledby="day-heading">
      <div className="day-copy">
        <h2 id="day-heading">Braille Cell of the Day</h2>
        <p>One cell from the Grade 1 set, picked for today. Refresh for another.</p>
        <button type="button" onClick={refresh}>
          New cell
        </button>
      </div>
      <div className="day-cell">
        <p className="day-glyph" aria-hidden="true">
          {cell.glyph}
        </p>
        <p className="day-name">{cell.name}</p>
        <p className="day-dots">dots {cell.dots}</p>
      </div>
    </section>
  );
}
