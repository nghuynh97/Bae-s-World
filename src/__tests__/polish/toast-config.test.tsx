import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

describe("Toast configuration", () => {
  it("Toaster renders with top-center position", async () => {
    try {
      const { Toaster } = await import("@/components/ui/sonner");
      const { container } = render(<Toaster />);
      const toaster = container.querySelector("[data-sonner-toaster]");
      expect(toaster).toBeTruthy();
      expect(toaster?.getAttribute("data-position")).toBe("top-center");
    } catch {
      expect.fail("Module not found -- implement feature first");
    }
  });
});
