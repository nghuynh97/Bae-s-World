import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

describe("Toast configuration", () => {
  it("sonner.tsx has top-center position prop", () => {
    const source = readFileSync(
      resolve(__dirname, "../../components/ui/sonner.tsx"),
      "utf-8"
    );
    expect(source).toContain('position="top-center"');
  });

  it("sonner.tsx has 3000ms duration prop", () => {
    const source = readFileSync(
      resolve(__dirname, "../../components/ui/sonner.tsx"),
      "utf-8"
    );
    expect(source).toContain("duration={3000}");
  });
});
