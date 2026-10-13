// The manager bundle compiles JSX with the classic transform, so React has to be
// in scope here (unlike the app and stories, which use the automatic runtime).
/** @jsxRuntime classic */
/** @jsx React.createElement */
import React from 'react'
import { AddonPanel, SyntaxHighlighter } from 'storybook/internal/components'
import { useParameter } from 'storybook/manager-api'

// Adds a "Data" tab beside Controls / Actions / Code. A story opts in with
//   parameters: { sampleData: { rows } }
// and the panel shows each entry as `const rows = [...]`.

const quote = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
const key = (k: string) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : quote(k))

function literal(v: unknown): string {
  return typeof v === 'string' ? quote(v) : JSON.stringify(v)
}

const isFlatRow = (v: unknown): v is Record<string, string | number | boolean | null> =>
  typeof v === 'object' &&
  v !== null &&
  !Array.isArray(v) &&
  Object.values(v).every((x) => x === null || ['string', 'number', 'boolean'].includes(typeof x))

// Arrays of flat rows print one row per line; anything else falls back to JSON.
function toSource(name: string, value: unknown) {
  if (Array.isArray(value) && value.every(isFlatRow)) {
    const rows = value.map(
      (row) => `  { ${Object.entries(row).map(([k, v]) => `${key(k)}: ${literal(v)}`).join(', ')} },`,
    )
    return `const ${name} = [\n${rows.join('\n')}\n]`
  }
  const json = JSON.stringify(value, null, 2) ?? 'undefined'
  const body = json
    .replace(/"([A-Za-z_$][\w$]*)":/g, '$1:')
    .replace(/"((?:[^"\\]|\\.)*)"/g, (_, str: string) => quote(str))
  return `const ${name} = ${body}`
}

// Same highlighted, copyable code block the Code tab uses.
function Block({ name, value }: { name: string; value: unknown }) {
  return (
    <SyntaxHighlighter language="typescript" format={false} copyable padded bordered={false}>
      {toSource(name, value)}
    </SyntaxHighlighter>
  )
}

function DataPanel() {
  const data = useParameter<Record<string, unknown> | undefined>('sampleData', undefined)
  const entries = data ? Object.entries(data) : []

  if (!entries.length) {
    return (
      <p style={{ margin: 0, padding: 16, fontSize: 13, opacity: 0.7 }}>
        This story has no sample data. Add <code>parameters.sampleData</code> to show an array here.
      </p>
    )
  }
  return (
    <div>
      {entries.map(([name, value]) => (
        <Block key={name} name={name} value={value} />
      ))}
    </div>
  )
}

// `active` comes from the panel registration in manager.ts.
export function DataPanelTab({ active }: { active: boolean }) {
  return (
    <AddonPanel active={active}>
      <DataPanel />
    </AddonPanel>
  )
}
