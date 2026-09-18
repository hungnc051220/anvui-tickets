"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { cancelRouteProgress, ROUTE_PROGRESS_END, startRouteProgress } from "@/lib/route-progress";

function LockIcon({ size = 24 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4.5" y="10" width="15" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><circle cx="12" cy="15.5" r="1" /></svg>;
}

export default function GuestPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const busyRef = useRef(false);
  const navigatingRef = useRef(false);

  useEffect(() => {
    const onNavigationEnd = () => {
      if (!navigatingRef.current) return;
      navigatingRef.current = false;
      busyRef.current = false;
      setBusy(false);
    };
    window.addEventListener(ROUTE_PROGRESS_END, onNavigationEnd);
    return () => window.removeEventListener(ROUTE_PROGRESS_END, onNavigationEnd);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busyRef.current) return;
    busyRef.current = true;
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
      navigatingRef.current = true;
      startRouteProgress();
      router.refresh();
    } catch (reason) {
      navigatingRef.current = false;
      busyRef.current = false;
      cancelRouteProgress();
      setBusy(false);
      setError(reason instanceof Error ? reason.message : "Không đăng nhập được.");
    }
  }

  return (
    <main className="guest-access">
      <div className="guest-access__shade" aria-hidden="true" />
      <div className="site-container guest-access__container">
        <div className="guest-access__layout">
          <div className="guest-access__intro">
            <p className="guest-access__eyebrow">AN VUI <span>•</span> 11 NĂM</p>
            <h1>Danh sách<br />khách mời</h1>
            <p className="guest-access__description">Tra cứu và quản lý danh sách khách mời tham dự sự kiện kỷ niệm 11 năm An Vui.</p>
            <div className="guest-access__protected">
              <span className="guest-access__protected-icon"><LockIcon /></span>
              <span><strong>Nội dung được bảo vệ</strong><small>Chỉ dành cho ban tổ chức sự kiện.</small></span>
            </div>
          </div>
          <section className="guest-access__card" aria-labelledby="guest-access-card-title">
            <div className="guest-access__card-badges"><span className="guest-access__card-lock"><LockIcon /></span><span className="guest-access__pill">Khu vực dành cho ban tổ chức</span></div>
            <h2 id="guest-access-card-title">Truy cập danh sách khách mời</h2>
            <p className="guest-access__card-subtitle">Nhập mật khẩu để tiếp tục.</p>
            <form onSubmit={submit} className="guest-access__form">
              <label htmlFor="guest-password">Mật khẩu</label>
              <div className="guest-access__field">
                <LockIcon size={22} />
                <input id="guest-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required autoFocus placeholder="Nhập mật khẩu" aria-invalid={Boolean(error)} aria-describedby={error ? "guest-password-error" : undefined} />
                <button type="button" className="guest-access__toggle" aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} aria-pressed={showPassword} onClick={() => setShowPassword((value) => !value)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s3.7-5.5 10-5.5S22 12 22 12s-3.7 5.5-10 5.5S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" />{showPassword && <path d="M3 21 21 3" />}</svg>
                </button>
              </div>
              {error && <p id="guest-password-error" role="alert" className="guest-access__error">{error}</p>}
              <button type="submit" disabled={busy} aria-busy={busy} className="guest-access__submit"><span>{busy ? "Đang truy cập…" : "Xem danh sách"}</span>{busy ? <span className="guest-access__button-spinner" aria-hidden="true" /> : <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16m-7-7 7 7-7 7" /></svg>}</button>
            </form>
            <p className="guest-access__thanks">Cảm ơn bạn đã đồng hành cùng An Vui!</p>
          </section>
        </div>
        <div className="guest-access__anniversary"><span>Hành trình 11 năm</span><strong>KẾT NỐI NHỮNG GIÁ TRỊ BỀN VỮNG</strong><i /></div>
      </div>
    </main>
  );
}
