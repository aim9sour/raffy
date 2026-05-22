import { describe, expect, it } from "vitest";
import { entityInputSchema, groupEntitiesByType } from "./entities";

describe("library entities", () => {
  it("normalizes entity names and rejects empty names", () => {
    expect(entityInputSchema.parse({ type: "AUTHOR", name: "  Naguib Mahfouz  " })).toEqual({
      type: "AUTHOR",
      name: "Naguib Mahfouz",
    });

    expect(() => entityInputSchema.parse({ type: "CATEGORY", name: "" })).toThrow();
  });

  it("groups authors, categories, and shelves for form options", () => {
    const grouped = groupEntitiesByType([
      { id: "1", userId: "u1", type: "AUTHOR", name: "Naguib Mahfouz", createdAt: new Date(), updatedAt: new Date() },
      { id: "2", userId: "u1", type: "CATEGORY", name: "Novel", createdAt: new Date(), updatedAt: new Date() },
      { id: "3", userId: "u1", type: "SHELF", name: "Arabic", createdAt: new Date(), updatedAt: new Date() },
    ]);

    expect(grouped.authors.map((item) => item.name)).toEqual(["Naguib Mahfouz"]);
    expect(grouped.categories.map((item) => item.name)).toEqual(["Novel"]);
    expect(grouped.shelves.map((item) => item.name)).toEqual(["Arabic"]);
  });
});
