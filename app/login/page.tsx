import Link from "next/link";
import { Label, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { CogniteLogo } from "@/components/brand/CogniteLogo";
import { ShieldCheck } from "lucide-react";

export const metadata = { title: "Sign in — Cognite Support" };

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px-320px)] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="text-center">
        <div className="flex justify-center">
          <CogniteLogo heightClassName="h-9" />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-neutral-900">Sign in to Cognite Support</h1>
        <p className="mt-1.5 text-sm text-neutral-500">Track tickets, get personalized answers, and reach your support team.</p>
      </div>

      <div className="mt-8 space-y-4">
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" placeholder="you@company.com" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>
        <Button href="/hub" className="w-full">Sign in</Button>
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-neutral-200" />
        <span className="text-xs text-neutral-400">or</span>
        <div className="h-px flex-1 bg-neutral-200" />
      </div>

      <Link
        href="/login/sso"
        className="flex items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
      >
        <ShieldCheck className="h-4 w-4 text-neutral-400" />
        Sign in with SSO
      </Link>

      <p className="mt-8 text-center text-xs text-neutral-400">
        Don&apos;t have an account? Contact your organization admin to be added as an authorized user.
      </p>
    </div>
  );
}
