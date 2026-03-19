import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

function readSrc(filePath: string): string {
  return fs.readFileSync(
    path.resolve(__dirname, "../../", filePath),
    "utf-8"
  );
}

describe("Auth invite code", () => {
  it("auth actions use admin.createUser (not auth.signUp)", () => {
    const content = readSrc("actions/auth.ts");
    expect(content).toContain("admin.createUser");
    expect(content).not.toContain("auth.signUp");
  });

  it("auth actions contain validateInviteCode function", () => {
    const content = readSrc("actions/auth.ts");
    expect(content).toContain("validateInviteCode");
  });

  it("invite-code-input contains toUpperCase", () => {
    const content = readSrc("components/auth/invite-code-input.tsx");
    expect(content).toContain("toUpperCase");
  });

  it("setup-form contains Create My Account", () => {
    const content = readSrc("components/auth/setup-form.tsx");
    expect(content).toContain("Create My Account");
  });
});
