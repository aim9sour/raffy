import { describe, expect, it } from "vitest";
import { createLocalId, isLocalId } from "./offline-store";

describe("offline store helpers", () => {
  it("marks generated ids as local ids", () => {
    const id = createLocalId();

    expect(id).toMatch(/^local_/);
    expect(isLocalId(id)).toBe(true);
    expect(isLocalId("remote-id")).toBe(false);
  });
});
