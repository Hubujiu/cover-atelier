export type SelectDirection = "next" | "previous";

export function getNextSelectIndex(
  currentIndex: number,
  direction: SelectDirection,
  optionCount: number,
): number {
  if (optionCount <= 0) return 0;
  const delta = direction === "next" ? 1 : -1;
  return (currentIndex + delta + optionCount) % optionCount;
}
