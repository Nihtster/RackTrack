import { describe, expect, it } from 'vitest';
import { targetIndex } from './useRovingSelection';

// `enabled` lists the indexes of items that are not disabled; `current` is the
// selected item's index.
describe('targetIndex', () => {
  const all = [0, 1, 2, 3];

  it('moves right and down to the next item', () => {
    expect(targetIndex('ArrowRight', all, 0)).toBe(1);
    expect(targetIndex('ArrowDown', all, 1)).toBe(2);
  });

  it('moves left and up to the previous item', () => {
    expect(targetIndex('ArrowLeft', all, 2)).toBe(1);
    expect(targetIndex('ArrowUp', all, 3)).toBe(2);
  });

  it('wraps around at both ends', () => {
    expect(targetIndex('ArrowRight', all, 3)).toBe(0);
    expect(targetIndex('ArrowLeft', all, 0)).toBe(3);
  });

  it('jumps to the first and last enabled items', () => {
    expect(targetIndex('Home', [1, 2, 3], 3)).toBe(1);
    expect(targetIndex('End', [0, 1, 2], 0)).toBe(2);
  });

  it('skips disabled items', () => {
    // index 2 is disabled
    const enabled = [0, 1, 3];
    expect(targetIndex('ArrowRight', enabled, 1)).toBe(3);
    expect(targetIndex('ArrowLeft', enabled, 3)).toBe(1);
  });

  it('ignores keys it does not handle', () => {
    expect(targetIndex('a', all, 0)).toBeUndefined();
    expect(targetIndex('Tab', all, 0)).toBeUndefined();
    expect(targetIndex('Enter', all, 0)).toBeUndefined();
  });

  it('copes with a selection that is not among the enabled items', () => {
    // e.g. the selected item became disabled: start from the first enabled one
    expect(targetIndex('ArrowRight', [1, 2], 0)).toBe(2);
  });
});
