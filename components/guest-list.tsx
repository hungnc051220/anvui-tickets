"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import type { GuestDetail } from "@/lib/guests";
import { guestNameSuffix } from "@/lib/guest-label";
import { normalizeSearch } from "@/lib/search";

type ChangeResult = {
  mode?: "replaced";
  insertedCount: number;
  removedCount?: number;
  skippedIds: string[];
};

export default function GuestList({ guests }: { guests: GuestDetail[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState<"sync" | "import" | "logout" | null>(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ChangeResult | null>(null);

  const filtered = useMemo(() => {
    const needle = normalizeSearch(query);
    if (!needle) return guests;
    return guests.filter((guest) =>
      normalizeSearch(`${guest.id} ${guest.fullName} ${guestNameSuffix(guest) ?? ""}`).includes(needle),
    );
  }, [guests, query]);

  async function syncSheet() {
    setError("");
    setResult(null);
    setBusy("sync");
    try {
      const response = await fetch("/api/guests/sync-sheet", { method: "POST" });
      const body = await response.json();
      if (response.status === 401) {
        router.refresh();
        throw new Error("Phiên xem danh sách đã hết hạn. Vui lòng nhập lại mật khẩu.");
      }
      if (!response.ok) throw new Error(body.error ?? "Không đồng bộ được Google Sheets.");
      setResult(body as ChangeResult);
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không đồng bộ được Google Sheets.");
    } finally {
      setBusy(null);
    }
  }

  async function importGuests(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;
    const formElement = event.currentTarget;
    setError("");
    setResult(null);
    setBusy("import");
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/guests/import", { method: "POST", body: form });
      const body = await response.json();
      if (response.status === 401) {
        router.refresh();
        throw new Error("Phiên xem danh sách đã hết hạn. Vui lòng nhập lại mật khẩu.");
      }
      if (!response.ok) throw new Error(body.error ?? "Không import được file.");
      setResult(body as ChangeResult);
      setFile(null);
      formElement.reset();
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không import được file.");
    } finally {
      setBusy(null);
    }
  }

  async function logout() {
    setBusy("logout");
    try {
      const response = await fetch("/api/guests/logout", { method: "POST" });
      if (!response.ok) throw new Error("Không thoát được danh sách.");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thoát được danh sách.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 xl:pt-32">
      <div className="rounded-3xl bg-[#06107C] px-6 py-10 text-white sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
          Kỷ niệm 11 năm AN VUI
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Danh sách khách mời</h1>
        <p className="mt-3 max-w-2xl text-blue-100">
          Tìm khách mời theo họ tên hoặc mã vé và mở vé mời chi tiết.
        </p>
      </div>

      <div className="mt-8 flex items-end gap-3">
        <label className="block min-w-0 flex-1">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Tìm khách mời</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nhập họ tên hoặc mã vé"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-[#06107C] focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <button
          type="button"
          onClick={syncSheet}
          disabled={busy !== null}
          className="shrink-0 rounded-xl bg-[#06107C] px-4 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50 sm:px-6"
        >
          {busy === "sync" ? "Đang đồng bộ…" : "Đồng bộ"}
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between gap-4 text-sm text-slate-600">
        <p aria-live="polite">Hiển thị {filtered.length} / {guests.length} khách mời</p>
        <button type="button" onClick={logout} disabled={busy !== null} className="shrink-0 font-semibold text-[#06107C] underline disabled:opacity-50">
          Thoát danh sách
        </button>
      </div>

      <details className="mt-5 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <summary className="cursor-pointer font-semibold text-[#06107C]">Import khách mời từ Excel</summary>
        <p className="mt-3 text-sm text-slate-600">
          File .xlsx gồm hai cột Mã vé và Họ tên. Lần đồng bộ Google Sheets tiếp theo sẽ thay toàn bộ danh sách.
        </p>
        <a href="/api/guests/template" className="mt-2 inline-block text-sm font-semibold text-[#06107C] underline">
          Tải file Excel mẫu
        </a>
        <form onSubmit={importGuests} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="min-w-0 flex-1 text-sm font-semibold text-slate-700">
            Chọn file .xlsx
            <input
              type="file"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              required
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="mt-2 block w-full rounded-xl border border-slate-300 p-3 font-normal file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-[#06107C]"
            />
          </label>
          <button disabled={busy !== null || !file} className="rounded-xl border border-[#06107C] px-5 py-3 font-semibold text-[#06107C] disabled:opacity-50">
            {busy === "import" ? "Đang import…" : "Import Excel"}
          </button>
        </form>
      </details>

      {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}
      {result && (
        <div role="status" className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-900">
          <p className="font-semibold">
            {result.mode === "replaced"
              ? `Đã đồng bộ ${result.insertedCount} khách mời mới nhất.`
              : `Đã thêm ${result.insertedCount} khách mời.`}
          </p>
          {result.mode === "replaced" && <p className="mt-1">Đã thay {result.removedCount} khách trong danh sách cũ.</p>}
          <p className="mt-1">Bỏ qua {result.skippedIds.length} mã vé trùng.</p>
          {result.skippedIds.length > 0 && <p className="mt-2 break-words">Mã trùng: {result.skippedIds.join(", ")}</p>}
        </div>
      )}

      {filtered.length ? (
        <ul className="mt-6 grid gap-4 md:grid-cols-2" aria-label="Danh sách khách mời">
          {filtered.map((guest) => (
            <li
              key={guest.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-[#06107C]">{guest.id}</p>
                <h2 className="mt-1 break-words text-lg font-semibold text-slate-900">
                  {guest.fullName}
                </h2>
                {guestNameSuffix(guest) && (
                  <p className="mt-1 break-words text-sm font-medium text-blue-700">
                    {guestNameSuffix(guest)}
                  </p>
                )}
              </div>
              <Link
                href={`/${encodeURIComponent(guest.id)}`}
                className="shrink-0 rounded-full border border-[#06107C] px-5 py-2.5 text-center text-sm font-semibold text-[#06107C] hover:bg-[#06107C] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06107C]"
              >
                Xem chi tiết vé
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center text-slate-600">
          {guests.length ? "Không tìm thấy khách mời phù hợp." : "Chưa có khách mời trong danh sách."}
        </div>
      )}
    </main>
  );
}
