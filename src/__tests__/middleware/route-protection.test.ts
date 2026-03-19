import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

function readSrc(filePath: string): string {
  return fs.readFileSync(path.resolve(__dirname, "../../", filePath), "utf-8");
}

describe("Middleware route protection", () => {
  it("middleware.ts exports a middleware function and config with matcher", () => {
    const content = readSrc("middleware.ts");
    expect(content).toContain("export async function middleware");
    expect(content).toContain("export const config");
    expect(content).toContain("matcher");
  });

  it("middleware.ts contains correct protected path prefixes", () => {
    const content = readSrc("lib/supabase/middleware.ts");
    expect(content).toContain("/dashboard");
    expect(content).toContain("/beauty");
    expect(content).toContain("/journal");
    expect(content).toContain("/upload");
  });

  it("middleware.ts imports updateSession from the correct path", () => {
    const content = readSrc("middleware.ts");
    expect(content).toMatch(/import.*updateSession.*middleware/);
  });

  it("supabase middleware uses getUser() not getSession()", () => {
    const content = readSrc("lib/supabase/middleware.ts");
    expect(content).toContain("getUser()");
    expect(content).not.toContain("getSession()");
  });

  it("seed script contains both invite codes FNGH01 and BF0001", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "../../../scripts/seed-invite-codes.ts"),
      "utf-8"
    );
    expect(content).toContain("FNGH01");
    expect(content).toContain("BF0001");
  });

  it("seed script is idempotent with onConflictDoNothing", () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, "../../../scripts/seed-invite-codes.ts"),
      "utf-8"
    );
    expect(content).toContain("onConflictDoNothing");
  });
});
