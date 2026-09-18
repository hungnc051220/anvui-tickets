import GuestListGate from "@/components/guest-list-gate";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Danh sách khách mời | AN VUI",
  robots: { index: false, follow: false },
};

export default function GuestListPage() {
  return <GuestListGate />;
}
