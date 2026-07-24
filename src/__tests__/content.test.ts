import { describe, expect, it } from "vitest";

import { contentSectionDraftSchema } from "src/lib/content";

const draft = {
  sectionKey: "summer-collection",
  sectionType: "image_banner",
  locale: "en",
  displayOrder: 100,
  isVisible: true,
  content: {
    title: "Summer collection",
    imageUrl: "https://cdn.example.test/summer.jpg",
    linkUrl: "/products?collection=summer",
  },
};

describe("homepage content validation", () => {
  it("accepts a lower-section content payload with safe URLs", () => {
    expect(contentSectionDraftSchema.safeParse(draft).success).toBe(true);
  });

  it.each([
    { imageUrl: "javascript:alert(1)" },
    { linkUrl: "//attacker.example/path" },
    { linkUrl: "data:text/html,unsafe" },
  ])("rejects executable or protocol-relative URLs", (unsafe) => {
    expect(
      contentSectionDraftSchema.safeParse({
        ...draft,
        content: { ...draft.content, ...unsafe },
      }).success,
    ).toBe(false);
  });

  it("keeps configurable homepage sections below the protected order range", () => {
    expect(
      contentSectionDraftSchema.safeParse({ ...draft, displayOrder: 99 })
        .success,
    ).toBe(false);
  });
});
