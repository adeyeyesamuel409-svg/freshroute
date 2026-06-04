"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn } from "@/lib/actions/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => signIn(formData),
    null,
  );

  return (
    <div className="max-w-sm mx-auto p-6 pt-24">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            name="password"
            type="password"
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Enter your password"
          />
        </div>

        {state?.error && (
          <p className="text-red-500 text-sm">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full h-11 rounded-full bg-green-700 text-white font-medium hover:bg-green-800 disabled:opacity-50 transition-colors"
        >
          {pending ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-green-700 font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
