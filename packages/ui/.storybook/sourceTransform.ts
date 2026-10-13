// Keeps the Code tab readable: long inline arrays in a story's source collapse
// to a variable name, and the array itself is shown in the Data tab
// (`parameters.sampleData`).
const MAX_INLINE = 160;

// Index of the bracket that closes the one at `open`, skipping string contents.
function closingBracket(code: string, open: number) {
  let depth = 0;
  let quote: string | null = null;
  for (let i = open; i < code.length; i++) {
    const ch = code[i];
    if (quote) {
      if (ch === '\\') i++;
      else if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
    } else if (ch === '[') {
      depth++;
    } else if (ch === ']') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

export function collapseLongArrays(code: string) {
  // The sampleData parameter is for the Data tab; it isn't part of the usage.
  let result = code.replace(/\n?[ \t]*parameters:\s*\{\s*sampleData:\s*\{[^}]*\}\s*\},?/g, '');

  // prop={[ ...long... ]}  ->  prop={prop}
  for (const m of [...result.matchAll(/(\w+)=\{\[/g)].reverse()) {
    const open = m.index + m[0].length - 1;
    const close = closingBracket(result, open);
    if (close < 0 || result[close + 1] !== '}' || close - open <= MAX_INLINE) continue;
    result = `${result.slice(0, m.index)}${m[1]}={${m[1]}}${result.slice(close + 2)}`;
  }

  // {[ ...long... ].map(  ->  {items.map(
  for (const m of [...result.matchAll(/(?<!=)\{\[/g)].reverse()) {
    const open = m.index + 1;
    const close = closingBracket(result, open);
    if (close < 0 || !result.startsWith('.map(', close + 1) || close - open <= MAX_INLINE) continue;
    result = `${result.slice(0, open)}items${result.slice(close + 1)}`;
  }

  return result;
}
