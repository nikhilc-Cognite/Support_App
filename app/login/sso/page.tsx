import { Label, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ShieldCheck } from "lucide-react";

export const metadata = { title: "Sign in with SSO — Cognite Support" };

export default function SsoLoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px-320px)] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-50 dark:bg-accent-900/40">
          <ShieldCheck className="h-6 w-6 text-accent-600" />
        </span>
        <h1 className="mt-4 text-xl font-semibold text-neutral-900">Sign in with SSO</h1>
        <p className="mt-1.5 text-sm text-neutral-500">Enter your company domain — we&apos;ll redirect you to your identity provider.</p>
      </div>

      <div className="mt-8 space-y-4">
        <div>
          <Label htmlFor="domain">Company domain</Label>
          <div className="flex items-center overflow-hidden rounded-lg border border-neutral-300 focus-within:border-accent-500 focus-within:ring-2 focus-within:ring-accent-100">
            <Input id="domain" placeholder="acmecorp" className="border-0 focus:ring-0" />
            <span className="shrink-0 bg-neutral-50 px-3 text-sm text-neutral-400">.okta.com</span>
          </div>
        </div>
        <Button href="/hub" className="w-full">Continue to identity provider</Button>
      </div>

      <p className="mt-8 text-center text-xs text-neutral-400">
        Your credentials are verified entirely by your identity provider — Cognite never sees your password.
      </p>
    </div>
  );
}
