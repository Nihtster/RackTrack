// Builds the snippet shown in a story's Code tab (`parameters.docs.source.code`).
//
// Stateful stories render through a small helper component, so Storybook can only
// show `<Controlled {...args} />`. These snippets show what a consumer would write:
// the state, and the component bound to it.
//
//   usage('Calendar', {
//     state: "const [value, setValue] = useState('')",
//     bind: { value: 'value', onChange: 'setValue' },
//     props: { min: '2026-09-10' },
//   })
//
// -> const [value, setValue] = useState('')
//
//    <Calendar
//      value={value}
//      onChange={setValue}
//      min="2026-09-10"
//    />

interface Ref {
  __ref: string;
}

/** Print a variable name instead of a value, e.g. `options={filters}`. */
export function ref(name: string): Ref {
  return { __ref: name };
}

const isRef = (v: unknown): v is Ref =>
  typeof v === 'object' && v !== null && '__ref' in (v as object);

const quote = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

// JS-style literal: single quotes, bare keys, one line.
function literal(v: unknown): string {
  if (isRef(v)) return v.__ref;
  if (typeof v === 'string') return quote(v);
  if (Array.isArray(v)) return `[${v.map(literal).join(', ')}]`;
  if (typeof v === 'object' && v !== null) {
    const entries = Object.entries(v).map(([k, val]) => {
      const key = /^[A-Za-z_$][\w$]*$/.test(k) ? k : quote(k);
      return `${key}: ${literal(val)}`;
    });
    return entries.length ? `{ ${entries.join(', ')} }` : '{}';
  }
  return String(v);
}

function attribute(name: string, value: unknown): string {
  if (isRef(value)) return `${name}={${value.__ref}}`;
  if (typeof value === 'string') return `${name}="${value.replace(/"/g, '&quot;')}"`;
  if (value === true) return name;
  return `${name}={${literal(value)}}`;
}

export interface UsageOptions {
  /** Hook lines shown above the JSX, e.g. `const [value, setValue] = useState('')`. */
  state?: string | string[];
  /** Props bound to state or handlers, as raw expressions: `{ onChange: 'setValue' }`. */
  bind?: Record<string, string>;
  /** Plain props, printed as JSX attributes. Use `ref('name')` for a variable. */
  props?: Record<string, unknown>;
}

export function usage(component: string, { state, bind = {}, props = {} }: UsageOptions = {}): string {
  const attributes = [
    ...Object.entries(bind).map(([name, expr]) => `${name}={${expr}}`),
    ...Object.entries(props)
      .filter(([, value]) => value !== undefined)
      .map(([name, value]) => attribute(name, value)),
  ];
  const lines = state ? [...(Array.isArray(state) ? state : [state]), ''] : [];
  const tag = attributes.length
    ? `<${component}\n${attributes.map((a) => `  ${a}`).join('\n')}\n/>`
    : `<${component} />`;
  return [...lines, tag].join('\n');
}
