import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  buildProductSearchUrl,
  buildProductShortcutUrl,
} from "src/forms/SearchFilterForm/product-search";

const projectFile = (relativePath: string) =>
  path.resolve(process.cwd(), relativePath);

describe("protected homepage product-search contract", () => {
  it("builds only supported product catalog parameters", () => {
    const url = new URL(
      buildProductSearchUrl({
        query: "  wireless headphones  ",
        minPrice: "49.90",
        sort: "price_asc",
      }),
      "https://marketplace.example",
    );

    expect(url.pathname).toBe("/products");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      query: "wireless headphones",
      minPrice: "49.90",
      sort: "price_asc",
    });
  });

  it("drops invalid price input and falls back to a supported sort", () => {
    const url = new URL(
      buildProductSearchUrl({
        query: "   ",
        minPrice: "-5",
        sort: "asc",
      }),
      "https://marketplace.example",
    );

    expect(url.pathname).toBe("/products");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      sort: "newest",
    });
  });

  it("builds real catalog destinations for product shortcuts", () => {
    const url = new URL(
      buildProductShortcutUrl("home living"),
      "https://marketplace.example",
    );

    expect(url.pathname).toBe("/products");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      query: "home living",
    });
  });

  it("contains no property, location, date, film or placeholder-link mock", () => {
    const bannerSource = readFileSync(
      projectFile("src/widgets/SearchBanner/index.tsx"),
      "utf8",
    );
    const formSource = readFileSync(
      projectFile("src/forms/SearchFilterForm/index.tsx"),
      "utf8",
    );
    const headerSource = readFileSync(
      projectFile("src/widgets/Header/index.tsx"),
      "utf8",
    );
    const source = [bannerSource, formSource, headerSource].join("\n");

    expect(source).not.toMatch(/href\s*=\s*["']#/);
    expect(source).not.toMatch(
      /Where\s*to|Where\?|When\?|Find Activity|25,000\+|top100Films|The Godfather|Mapbox|dateSelect|Real Estate|booking|rental|location/i,
    );
    expect(source).not.toContain('createQueryString("sort", "asc")');
    expect(bannerSource).toContain("router.push(routes.products)");
    expect(formSource).toContain("router.push(buildProductSearchUrl(values)");
    expect(bannerSource.match(/<CategoryButton/g)).toHaveLength(5);
    expect(formSource.match(/<Grid item xs=\{12\} md=\{4\}>/g)).toHaveLength(3);
  });

  it("removes the superseded location and film autocomplete modules", () => {
    for (const file of [
      "src/forms/SearchFilterForm/SearchLocation.tsx",
      "src/forms/SearchFilterForm/action.ts",
      "src/forms/SearchKeyword/index.tsx",
      "src/forms/SearchKeyword/Types.ts",
    ]) {
      expect(existsSync(projectFile(file))).toBe(false);
    }
  });
});
