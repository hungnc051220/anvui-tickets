import GuestList from "@/components/guest-list";
import GuestPasswordForm from "@/components/guest-password-form";
import { isGuestListAuthorized } from "@/lib/auth";
import { getGuests } from "@/lib/guests";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Danh sách khách mời | AN VUI",
  robots: { index: false, follow: false },
};

export default async function GuestListPage() {
  if (!(await isGuestListAuthorized())) return <GuestPasswordForm />;
  return <GuestList guests={await getGuests()} />;
}
