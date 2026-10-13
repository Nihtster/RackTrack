export const DOTS = 'dots' as const;
export type PageItem = number | typeof DOTS;

const range = (from: number, to: number) =>
  Array.from({ length: Math.max(to - from + 1, 0) }, (_, i) => from + i);

// Which items to show: always the first and last `boundaries` pages, the
// current page with `siblings` on each side, and DOTS where pages are skipped.
// The number of slots stays constant as you page, so the control doesn't jump.
export function paginationRange(
  page: number,
  pageCount: number,
  siblings = 1,
  boundaries = 1,
): PageItem[] {
  const slots = siblings * 2 + 3 + boundaries * 2;
  if (pageCount <= slots) return range(1, pageCount);

  const leftSibling = Math.max(page - siblings, boundaries);
  const rightSibling = Math.min(page + siblings, pageCount - boundaries + 1);
  const showLeftDots = leftSibling > boundaries + 2;
  const showRightDots = rightSibling < pageCount - (boundaries + 1);

  if (!showLeftDots && showRightDots) {
    const leftCount = siblings * 2 + boundaries + 2;
    return [...range(1, leftCount), DOTS, ...range(pageCount - boundaries + 1, pageCount)];
  }
  if (showLeftDots && !showRightDots) {
    const rightCount = boundaries + 1 + 2 * siblings;
    return [...range(1, boundaries), DOTS, ...range(pageCount - rightCount, pageCount)];
  }
  return [
    ...range(1, boundaries),
    DOTS,
    ...range(leftSibling, rightSibling),
    DOTS,
    ...range(pageCount - boundaries + 1, pageCount),
  ];
}
