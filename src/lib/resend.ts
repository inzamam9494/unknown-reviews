import { Resend } from "resend";

export function createResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error(
      "Missing RESEND_API_KEY environment variable. Place it in the project root .env or .env.local and restart the dev server."
    );
  }
  return new Resend(key);
}
