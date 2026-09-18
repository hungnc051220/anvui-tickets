"use client";

import { useCallback, useEffect, useState } from "react";
import GuestList from "@/components/guest-list";
import GuestPasswordForm from "@/components/guest-password-form";
import type { GuestDetail } from "@/lib/guests";

type GateState =
  | { status: "loading" }
  | { status: "locked" }
  | { status: "ready"; guests: GuestDetail[] }
  | { status: "error"; message: string };

export default function GuestListGate() {
  const [state, setState] = useState<GateState>({ status: "loading" });

  const loadGuests = useCallback(async () => {
    const response = await fetch("/api/guests", {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (response.status === 401) {
      setState({ status: "locked" });
      return false;
    }

    const body = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(body?.error ?? "Không tải được danh sách khách mời.");
    }

    setState({ status: "ready", guests: body?.guests ?? [] });
    return true;
  }, []);

  useEffect(() => {
    void loadGuests().catch((reason) => {
      setState({
        status: "error",
        message: reason instanceof Error ? reason.message : "Không tải được danh sách khách mời.",
      });
    });
  }, [loadGuests]);

  const handleAuthenticated = useCallback(async () => {
    const loaded = await loadGuests();
    if (!loaded) {
      throw new Error("Không tạo được phiên truy cập. Vui lòng thử lại.");
    }
  }, [loadGuests]);

  const handleReload = useCallback(async () => {
    const loaded = await loadGuests();
    if (!loaded) {
      throw new Error("Phiên xem danh sách đã hết hạn. Vui lòng nhập lại mật khẩu.");
    }
  }, [loadGuests]);

  const handleLoggedOut = useCallback(() => {
    setState({ status: "locked" });
  }, []);

  if (state.status === "loading") {
    return (
      <main className="route-loading" aria-label="Đang kiểm tra quyền truy cập">
        <span className="route-loading__indicator" role="status" aria-label="Đang tải" />
      </main>
    );
  }

  if (state.status === "error") {
    return (
      <main className="route-loading" aria-live="polite">
        <div className="text-center text-[#173d70]">
          <p>{state.message}</p>
          <button
            type="button"
            className="mt-4 rounded-full border border-[#173d70]/25 bg-white px-5 py-2 text-sm font-semibold"
            onClick={() => {
              setState({ status: "loading" });
              void loadGuests().catch((reason) =>
                setState({
                  status: "error",
                  message: reason instanceof Error ? reason.message : "Không tải được danh sách khách mời.",
                }),
              );
            }}
          >
            Thử lại
          </button>
        </div>
      </main>
    );
  }

  if (state.status === "locked") {
    return <GuestPasswordForm onAuthenticated={handleAuthenticated} />;
  }

  return (
    <GuestList
      guests={state.guests}
      onReload={handleReload}
      onLoggedOut={handleLoggedOut}
    />
  );
}
