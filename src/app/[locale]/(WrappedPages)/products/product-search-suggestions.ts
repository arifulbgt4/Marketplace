export const SUGGESTION_DEBOUNCE_MS = 250;

export function buildSuggestionRequestUrl(query: string, limit = 8) {
  const searchParams = new URLSearchParams({
    query: query.trim(),
    limit: String(limit),
  });
  return `/api/catalog/suggestions?${searchParams.toString()}`;
}

export function getNextSuggestionIndex(
  currentIndex: number,
  suggestionCount: number,
  direction: "next" | "previous",
) {
  if (suggestionCount <= 0) return -1;
  if (direction === "next") return (currentIndex + 1) % suggestionCount;
  return currentIndex <= 0 ? suggestionCount - 1 : currentIndex - 1;
}
