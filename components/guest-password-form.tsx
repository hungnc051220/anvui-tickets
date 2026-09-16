"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function GuestPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/guests/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error ?? "Không đăng nhập được.");
      }
      setPassword("");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không đăng nhập được.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 pb-16 pt-32 sm:px-6 xl:pt-40">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#06107C]">AN VUI</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Danh sách khách mời</h1>
        <p className="mt-2 text-sm text-slate-600">Nhập mật khẩu để xem danh sách.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Mật khẩu
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              autoFocus
              className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#06107C] focus:ring-2 focus:ring-blue-100"
              placeholder="Nhập mật khẩu"
            />
          </label>
          <button disabled={busy} className="w-full rounded-full bg-[#06107C] px-6 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50">
            {busy ? "Đang kiểm tra…" : "Xem danh sách"}
          </button>
        </form>
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      </div>
    </main>
  );
}
