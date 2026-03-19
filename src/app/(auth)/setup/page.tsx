"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoText } from "@/components/layout/logo-text";
import { InviteCodeInput } from "@/components/auth/invite-code-input";
import { SetupForm } from "@/components/auth/setup-form";

export default function SetupPage() {
  const [step, setStep] = useState<"code" | "account">("code");
  const [validCode, setValidCode] = useState("");
  const [assignedName, setAssignedName] = useState("");

  function handleCodeValid(code: string, name: string) {
    setValidCode(code);
    setAssignedName(name);
    setStep("account");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="flex flex-col items-center w-full max-w-[360px]">
        <LogoText size="lg" />

        <p className="mt-4 text-text-secondary text-base text-center">
          {step === "code" ? "Set Up Your Account" : "Create Your Account"}
        </p>

        <div className="mt-8 w-full">
          {step === "code" ? (
            <InviteCodeInput onValid={handleCodeValid} />
          ) : (
            <SetupForm code={validCode} assignedName={assignedName} />
          )}
        </div>

        <Link
          href="/login"
          className="mt-6 text-text-secondary text-sm hover:text-text-primary transition-colors"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
}
