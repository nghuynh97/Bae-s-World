import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

describe("Page fade animation", () => {
  it("public template renders children with fade-in class", async () => {
    try {
      const { default: Template } = await import("@/app/(public)/template");
      const { container } = render(<Template><p>test</p></Template>);
      expect(container.firstChild).toHaveClass("motion-safe:animate-page-fade-in");
      expect(screen.getByText("test")).toBeInTheDocument();
    } catch {
      expect.fail("Module not found -- implement feature first");
    }
  });

  it("private template renders children with fade-in class", async () => {
    try {
      const { default: Template } = await import("@/app/(private)/template");
      const { container } = render(<Template><p>test</p></Template>);
      expect(container.firstChild).toHaveClass("motion-safe:animate-page-fade-in");
    } catch {
      expect.fail("Module not found -- implement feature first");
    }
  });

  it("auth template renders children with fade-in class", async () => {
    try {
      const { default: Template } = await import("@/app/(auth)/template");
      const { container } = render(<Template><p>test</p></Template>);
      expect(container.firstChild).toHaveClass("motion-safe:animate-page-fade-in");
    } catch {
      expect.fail("Module not found -- implement feature first");
    }
  });
});
