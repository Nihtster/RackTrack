import { describe, expect, it } from 'vitest';
import { ref, usage } from './usage';

describe('usage', () => {
  it('prints state, a blank line, then the component with bound and plain props', () => {
    expect(
      usage('Calendar', {
        state: "const [value, setValue] = useState('')",
        bind: { value: 'value', onChange: 'setValue' },
        props: { min: '2026-09-10' },
      }),
    ).toBe(
      [
        "const [value, setValue] = useState('')",
        '',
        '<Calendar',
        '  value={value}',
        '  onChange={setValue}',
        '  min="2026-09-10"',
        '/>',
      ].join('\n'),
    );
  });

  it('prints a self-closing tag with no props', () => {
    expect(usage('Spinner')).toBe('<Spinner />');
  });

  it('formats each kind of prop value', () => {
    const out = usage('X', {
      props: { a: true, b: false, c: 3, d: 'text', e: ['p', 'q'], f: { k: 1 } },
    });
    expect(out).toContain('\n  a\n');
    expect(out).toContain('b={false}');
    expect(out).toContain('c={3}');
    expect(out).toContain('d="text"');
    expect(out).toContain("e={['p', 'q']}");
    expect(out).toContain('f={{ k: 1 }}');
  });

  it('prints a variable name for ref()', () => {
    expect(usage('Tabs', { props: { items: ref('items') } })).toContain('items={items}');
  });

  it('quotes strings inside object literals with single quotes', () => {
    expect(usage('X', { props: { opts: { name: "it's" } } })).toContain("opts={{ name: 'it\\'s' }}");
  });

  it('skips undefined props', () => {
    expect(usage('X', { props: { a: undefined, b: 1 } })).not.toContain('a=');
  });

  it('accepts several state lines', () => {
    const out = usage('X', { state: ['const [a, setA] = useState(0)', 'const [b, setB] = useState(1)'] });
    expect(out.startsWith('const [a, setA] = useState(0)\nconst [b, setB] = useState(1)\n\n<X />')).toBe(true);
  });
});
