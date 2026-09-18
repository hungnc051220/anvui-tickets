import TicketDetail from "@/components/ticket-detail";
import { getGuest } from "@/lib/guests";
import { guestNameSuffix } from "@/lib/guest-label";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ download?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guest = await getGuest((await params).id);
  return {
    title: "AN VUI trân trọng kính mời tham dự sự kiện 11 năm",
    description: guest
      ? `Trân trọng kính mời ${guest.fullName} tham dự`
      : "Vé mời không tồn tại",
  };
}

export default async function Detail({ params, searchParams }: Props) {
  const guest = await getGuest((await params).id);
  if (!guest) notFound();
  return <TicketDetail id={guest.id} fullName={guest.fullName} nameSuffix={guestNameSuffix(guest)} autoDownload={(await searchParams).download === "1"} />;
}
