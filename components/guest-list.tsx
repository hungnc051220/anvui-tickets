"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { GuestDetail } from "@/lib/guests";
import { guestNameSuffix } from "@/lib/guest-label";
import { normalizeSearch } from "@/lib/search";
import { cancelRouteProgress, ROUTE_PROGRESS_END, startRouteProgress } from "@/lib/route-progress";

const PAGE_SIZE = 10;

type ChangeResult = {
  mode?: "replaced";
  insertedCount: number;
  removedCount?: number;
  skippedIds: string[];
};

type IconName = "search" | "sync" | "eye" | "download" | "previous" | "next";

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: <><circle cx="10.8" cy="10.8" r="7" /><path d="m16 16 5 5" /></>,
    sync: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.5 9A7 7 0 0 1 18 7l2 5M4 12l2 5a7 7 0 0 0 12.5-2" /></>,
    eye: <><path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
    download: <><path d="M12 3v12m-4-4 4 4 4-4M4 20h16" /></>,
    previous: <path d="m15 5-7 7 7 7" />,
    next: <path d="m9 5 7 7-7 7" />,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function GuestList({ guests }: { guests: GuestDetail[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState<"sync" | "import" | "logout" | null>(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ChangeResult | null>(null);
  const busyRef = useRef(false);
  const awaitingRefreshRef = useRef(false);

  useEffect(() => {
    const onNavigationEnd = () => {
      if (!awaitingRefreshRef.current) return;
      awaitingRefreshRef.current = false;
      busyRef.current = false;
      setBusy(null);
    };
    window.addEventListener(ROUTE_PROGRESS_END, onNavigationEnd);
    return () => window.removeEventListener(ROUTE_PROGRESS_END, onNavigationEnd);
  }, []);

  function beginAction(action: "sync" | "import" | "logout") {
    if (busyRef.current) return false;
    busyRef.current = true;
    setBusy(action);
    return true;
  }

  function refreshWithProgress() {
    awaitingRefreshRef.current = true;
    startRouteProgress();
    router.refresh();
  }

  function finishFailedAction() {
    if (awaitingRefreshRef.current) cancelRouteProgress();
    awaitingRefreshRef.current = false;
    busyRef.current = false;
    setBusy(null);
  }

  const filtered = useMemo(() => {
    const needle = normalizeSearch(query);
    if (!needle) return guests;
    return guests.filter((guest) =>
      normalizeSearch(guest.id + " " + guest.fullName + " " + (guestNameSuffix(guest) ?? "")).includes(needle),
    );
  }, [guests, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const visibleGuests = filtered.slice(pageStart, pageStart + PAGE_SIZE);
  const pageNumbers = Array.from({ length: pageCount }, (_, index) => index + 1).filter(
    (number) => number === 1 || number === pageCount || Math.abs(number - currentPage) <= 2,
  );

  async function syncSheet() {
    if (!beginAction("sync")) return;
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/guests/sync-sheet", { method: "POST" });
      const body = await response.json();
      if (response.status === 401) {
        refreshWithProgress();
        return;
      }
      if (!response.ok) throw new Error(body.error ?? "Không đồng bộ được Google Sheets.");
      setResult(body as ChangeResult);
      refreshWithProgress();
    } catch (reason) {
      finishFailedAction();
      setError(reason instanceof Error ? reason.message : "Không đồng bộ được Google Sheets.");
    }
  }

  async function importGuests(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;
    if (!beginAction("import")) return;
    const formElement = event.currentTarget;
    setError("");
    setResult(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/guests/import", { method: "POST", body: form });
      const body = await response.json();
      if (response.status === 401) {
        refreshWithProgress();
        return;
      }
      if (!response.ok) throw new Error(body.error ?? "Không import được file.");
      setResult(body as ChangeResult);
      setFile(null);
      formElement.reset();
      refreshWithProgress();
    } catch (reason) {
      finishFailedAction();
      setError(reason instanceof Error ? reason.message : "Không import được file.");
    }
  }

  async function logout() {
    if (!beginAction("logout")) return;
    try {
      const response = await fetch("/api/guests/logout", { method: "POST" });
      if (!response.ok) throw new Error("Không thoát được danh sách.");
      refreshWithProgress();
    } catch (reason) {
      finishFailedAction();
      setError(reason instanceof Error ? reason.message : "Không thoát được danh sách.");
    }
  }

  return (
    <main className="anniversary-page guest-page">
      <div className="site-container guest-content">
        <section className="guest-hero" aria-labelledby="guest-title">
          <div className="guest-hero-copy">
            <p className="guest-eyebrow">KỶ NIỆM 11 NĂM AN VUI</p>
            <h1 id="guest-title">Danh sách khách mời</h1>
            <p>Tìm kiếm khách mời, xem thông tin chi tiết và quản lý danh sách khách mời tham dự sự kiện 11 năm AN VUI.</p>
          </div>
          <div className="guest-hero-art" aria-hidden="true">
            <Image src="/assets/logo2.png" alt="" width={400} height={400} priority />
            <span>Tiếp nối<br />hành trình<br />vươn tầm tương lai</span>
          </div>
        </section>

        <section className="guest-workspace" aria-label="Tra cứu khách mời">
          <div className="guest-toolbar">
            <label htmlFor="guest-search">Tìm khách mời</label>
            <div className="guest-search-row">
              <div className="guest-search-field">
                <Icon name="search" />
                <input
                  id="guest-search"
                  type="search"
                  value={query}
                  onChange={(event) => { setQuery(event.target.value); setPage(1); }}
                  placeholder="Nhập họ tên hoặc mã vé để tìm kiếm..."
                />
              </div>
              <button type="button" className="guest-sync" onClick={syncSheet} disabled={busy !== null} aria-busy={busy === "sync"}>
                <Icon name="sync" />{busy === "sync" ? "Đang đồng bộ…" : "Đồng bộ"}
              </button>
            </div>
            <div className="guest-toolbar-meta">
              <p aria-live="polite">Hiển thị {filtered.length} / {guests.length} khách mời</p>
              <button type="button" onClick={logout} disabled={busy !== null} aria-busy={busy === "logout"}><Icon name="sync" />Thoát danh sách</button>
            </div>
          </div>

          {error && <p role="alert" className="guest-feedback guest-feedback-error">{error}</p>}
          {result && (
            <div role="status" className="guest-feedback guest-feedback-success">
              <strong>{result.mode === "replaced" ? "Đã đồng bộ " + result.insertedCount + " khách mời mới nhất." : "Đã thêm " + result.insertedCount + " khách mời."}</strong>
              {result.mode === "replaced" && <p>Đã thay {result.removedCount} khách trong danh sách cũ.</p>}
              <p>Bỏ qua {result.skippedIds.length} mã vé trùng.</p>
              {result.skippedIds.length > 0 && <p>Mã trùng: {result.skippedIds.join(", ")}</p>}
            </div>
          )}

          <div className="guest-table-frame">
            <div className="guest-table-scroll">
              <table className="guest-table">
                <thead><tr><th scope="col">STT</th><th scope="col">Họ và tên</th><th scope="col">Người thân của ai</th><th scope="col">Chức vụ</th><th scope="col">Số điện thoại</th><th scope="col">Thao tác</th></tr></thead>
                <tbody>
                  {visibleGuests.length ? visibleGuests.map((guest, index) => (
                    <tr key={guest.id}>
                      <td>{pageStart + index + 1}</td>
                      <td className="guest-name" title={"Mã vé: " + guest.id}>{guest.fullName}</td>
                      <td>{guest.relatedTo ? "Người thân của " + guest.relatedTo : "Khách mời"}</td>
                      <td>{guest.jobTitle || "—"}</td>
                      <td title="Dữ liệu hiện chưa có số điện thoại">—</td>
                      <td>
                        <div className="guest-row-actions">
                          <Link href={"/" + encodeURIComponent(guest.id)} title={"Xem vé của " + guest.fullName} aria-label={"Xem vé của " + guest.fullName}><Icon name="eye" /></Link>
                          <Link href={"/" + encodeURIComponent(guest.id) + "?download=1"} target="_blank" rel="noopener noreferrer" title={"Tải vé của " + guest.fullName} aria-label={"Tải vé của " + guest.fullName}><Icon name="download" /></Link>
                        </div>
                      </td>
                    </tr>
                  )) : <tr><td colSpan={6} className="guest-empty">{guests.length ? "Không tìm thấy khách mời phù hợp." : "Chưa có khách mời trong danh sách."}</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <nav className="guest-pagination" aria-label="Phân trang khách mời">
            <div className="guest-page-buttons">
              <button type="button" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} aria-label="Trang trước"><Icon name="previous" /></button>
              {pageNumbers.map((number, index) => (
                <span key={number} className="guest-page-slot">
                  {index > 0 && number - pageNumbers[index - 1] > 1 && <span className="guest-page-ellipsis" aria-hidden="true">…</span>}
                  <button type="button" onClick={() => setPage(number)} aria-label={"Trang " + number} aria-current={currentPage === number ? "page" : undefined} className={currentPage === number ? "is-active" : undefined}>{number}</button>
                </span>
              ))}
              <button type="button" onClick={() => setPage(currentPage + 1)} disabled={currentPage === pageCount} aria-label="Trang sau"><Icon name="next" /></button>
            </div>
            <p>Hiển thị {filtered.length ? pageStart + 1 : 0} - {Math.min(pageStart + PAGE_SIZE, filtered.length)} của {filtered.length} khách mời</p>
          </nav>

          <details className="guest-import">
            <summary>Import khách mời từ Excel</summary>
            <p>File .xlsx gồm hai cột Mã vé và Họ tên. Lần đồng bộ Google Sheets tiếp theo sẽ thay toàn bộ danh sách.</p>
            <a href="/api/guests/template">Tải file Excel mẫu</a>
            <form onSubmit={importGuests}>
              <label>Chọn file .xlsx<input type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" required onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></label>
              <button disabled={busy !== null || !file} aria-busy={busy === "import"}>{busy === "import" ? "Đang import…" : "Import Excel"}</button>
            </form>
          </details>
        </section>

        <div className="guest-closing" aria-hidden="true"><span>MỖI HÀNH TRÌNH ĐỀU CÓ NHỮNG CON NGƯỜI ĐẶC BIỆT</span><p>Cảm ơn bạn đã là một phần của AN VUI</p></div>
      </div>
    </main>
  );
}
