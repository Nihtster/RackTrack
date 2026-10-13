import { describe, expect, it } from 'vitest';
import { collapseLongArrays } from './sourceTransform';

const longArray = `[${Array.from({ length: 12 }, (_, i) => `{ id: ${i}, name: 'item ${i}' }`).join(', ')}]`;

describe('collapseLongArrays', () => {
  it('collapses a long array prop to its own name', () => {
    const out = collapseLongArrays(`<Chart data={${longArray}} xKey="date" />`);
    expect(out).toBe('<Chart data={data} xKey="date" />');
  });

  it('leaves short arrays inline', () => {
    const code = `<Chart series={[{ key: 'a', label: 'A' }]} />`;
    expect(collapseLongArrays(code)).toBe(code);
  });

  it('collapses a long literal that is mapped over', () => {
    const out = collapseLongArrays(`<ul>{${longArray}.map((r) => <li key={r.id} />)}</ul>`);
    expect(out).toBe('<ul>{items.map((r) => <li key={r.id} />)}</ul>');
  });

  it('is not fooled by brackets inside strings', () => {
    const tricky = `[{ label: 'a ] b' }, ${Array.from({ length: 10 }, (_, i) => `{ label: 'row ${i}' }`).join(', ')}]`;
    expect(collapseLongArrays(`<X rows={${tricky}} />`)).toBe('<X rows={rows} />');
  });

  it('strips the sampleData parameter, which is for the Data tab', () => {
    const code = `{\n  parameters: {\n    sampleData: {\n      ammo\n    }\n  },\n  render: () => null\n}`;
    expect(collapseLongArrays(code)).not.toContain('sampleData');
    expect(collapseLongArrays(code)).toContain('render');
  });

  it('collapses several long props independently', () => {
    const out = collapseLongArrays(`<A first={${longArray}} second={${longArray}} />`);
    expect(out).toBe('<A first={first} second={second} />');
  });
});
