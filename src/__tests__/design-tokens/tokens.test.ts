import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const globalsCSS = readFileSync(
  resolve(__dirname, "../../app/globals.css"),
  "utf-8"
);

describe("Design Tokens", () => {
  it("contains dominant color token", () => {
    expect(globalsCSS).toContain("--color-dominant: #F8F6FF");
  });

  it("contains accent color token", () => {
    expect(globalsCSS).toContain("--color-accent: #E8B4B8");
  });

  it("contains accent-hover color token", () => {
    expect(globalsCSS).toContain("--color-accent-hover: #D4A0A5");
  });

  it("contains text-primary color token", () => {
    expect(globalsCSS).toContain("--color-text-primary: #2D2235");
  });

  it("contains text-secondary color token", () => {
    expect(globalsCSS).toContain("--color-text-secondary: #6B5F76");
  });

  it("contains display font token", () => {
    expect(globalsCSS).toContain("--font-display: 'Playfair Display'");
  });

  it("contains body font token", () => {
    expect(globalsCSS).toContain("--font-body: 'Inter'");
  });

  it("contains radius-sm token", () => {
    expect(globalsCSS).toContain("--radius-sm: 6px");
  });

  it("contains radius-md token", () => {
    expect(globalsCSS).toContain("--radius-md: 10px");
  });

  it("contains radius-lg token", () => {
    expect(globalsCSS).toContain("--radius-lg: 16px");
  });

  it("contains shadow-sm token", () => {
    expect(globalsCSS).toContain("--shadow-sm:");
  });

  it("contains shadow-md token", () => {
    expect(globalsCSS).toContain("--shadow-md:");
  });

  it("contains shadow-lg token", () => {
    expect(globalsCSS).toContain("--shadow-lg:");
  });

  it("contains surface color token", () => {
    expect(globalsCSS).toContain("--color-surface: #FFFFFF");
  });

  it("contains success color token", () => {
    expect(globalsCSS).toContain("--color-success: #059669");
  });

  it("contains border color token", () => {
    expect(globalsCSS).toContain("--color-border: #E8E4EE");
  });

  it("contains border-accent color token", () => {
    expect(globalsCSS).toContain("--color-border-accent: #E8B4B8");
  });

  it("contains bg-hover color token", () => {
    expect(globalsCSS).toContain("--color-bg-hover: #F0ECF5");
  });
});
