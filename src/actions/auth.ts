"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { db } from "@/lib/db";
import { inviteCodes, profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const setupSchema = z.object({
  code: z
    .string()
    .length(6, "Code must be exactly 6 characters")
    .regex(/^[A-Z0-9]+$/, "Code must be alphanumeric"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const inviteCodeSchema = z
  .string()
  .length(6, "Code must be exactly 6 characters")
  .regex(/^[A-Z0-9]+$/i, "Code must be alphanumeric");

export async function validateInviteCode(code: string) {
  const parsed = inviteCodeSchema.safeParse(code);
  if (!parsed.success) {
    return {
      valid: false as const,
      error:
        "That code doesn't look right. Check the code you received and try again.",
    };
  }

  const result = await db
    .select()
    .from(inviteCodes)
    .where(eq(inviteCodes.code, code.toUpperCase()))
    .limit(1);

  if (result.length === 0 || result[0].usedAt !== null) {
    return {
      valid: false as const,
      error:
        "That code doesn't look right. Check the code you received and try again.",
    };
  }

  return { valid: true as const, name: result[0].assignedName };
}

export async function setupAccount(
  code: string,
  email: string,
  password: string
) {
  const parsed = setupSchema.safeParse({
    code: code.toUpperCase(),
    email,
    password,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Re-validate invite code server-side
  const codeResult = await validateInviteCode(code);
  if (!codeResult.valid) {
    return { error: codeResult.error };
  }

  // Create Supabase Auth user via admin API (public signup is disabled)
  const adminClient = createAdminClient();
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: codeResult.name },
  });

  if (error) {
    return { error: error.message };
  }

  // Mark invite code as used
  await db
    .update(inviteCodes)
    .set({ usedAt: new Date(), usedByAuthId: data.user.id })
    .where(eq(inviteCodes.code, code.toUpperCase()));

  // Create profile record
  await db.insert(profiles).values({
    authId: data.user.id,
    displayName: codeResult.name,
    email,
  });

  // Sign the user in
  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return { error: signInError.message };
  }

  redirect("/dashboard");
}

export async function login(email: string, password: string) {
  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email or password is incorrect. Please try again." };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
