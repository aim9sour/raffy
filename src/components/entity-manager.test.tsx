/**
 * @vitest-environment jsdom
 */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EntityManager, type EntityView } from "./entity-manager";

const entities: EntityView[] = [
  { id: "1", type: "CATEGORY", name: "Novel", category: null },
  { id: "2", type: "SHELF", name: "Classics", category: "Novel" },
];

afterEach(() => cleanup());

describe("EntityManager", () => {
  it("opens creation controls inside a dialog instead of inline", () => {
    render(
      <EntityManager
        entities={entities}
        locale="en"
        onCreate={vi.fn()}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.queryByPlaceholderText("Name Author")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Add item" }));

    expect(screen.getByRole("dialog", { name: "Add item" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Name Author")).toBeInTheDocument();
  });

  it("opens edit controls inside a dialog", () => {
    render(
      <EntityManager
        entities={entities}
        locale="en"
        onCreate={vi.fn()}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Edit Classics" }));

    expect(screen.getByRole("dialog", { name: "Edit item" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("Classics")).toBeInTheDocument();
  });
});
