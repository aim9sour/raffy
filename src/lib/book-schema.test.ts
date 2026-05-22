import { describe, expect, it } from "vitest";
import { bookInputSchema } from "./book-schema";

describe("book input schema", () => {
  it("requires only the title and defaults optional catalog fields", () => {
    expect(bookInputSchema.parse({ title: "  The Days  " })).toMatchObject({
      title: "The Days",
      author: "",
      category: "Uncategorized",
      shelf: "General",
      status: "UNREAD",
      rating: null,
      notes: "",
    });
  });

  it("rejects books without a title", () => {
    expect(() => bookInputSchema.parse({ title: "" })).toThrow();
  });
});
