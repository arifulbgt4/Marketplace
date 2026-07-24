import { describe, expect, it } from "vitest";
import {
  buildSuggestionRequestUrl,
  getNextSuggestionIndex,
  SUGGESTION_DEBOUNCE_MS,
} from "src/app/[locale]/(WrappedPages)/products/product-search-suggestions";

describe("product search suggestion controls", () => {
  it("uses the documented debounce interval and safely encodes the request", () => {
    expect(SUGGESTION_DEBOUNCE_MS).toBe(250);
    expect(buildSuggestionRequestUrl(" phone & tablet ")).toBe(
      "/api/catalog/suggestions?query=phone+%26+tablet&limit=8",
    );
  });

  it("wraps keyboard navigation in both directions", () => {
    expect(getNextSuggestionIndex(-1, 3, "next")).toBe(0);
    expect(getNextSuggestionIndex(2, 3, "next")).toBe(0);
    expect(getNextSuggestionIndex(0, 3, "previous")).toBe(2);
    expect(getNextSuggestionIndex(2, 3, "previous")).toBe(1);
    expect(getNextSuggestionIndex(0, 0, "next")).toBe(-1);
  });
});
