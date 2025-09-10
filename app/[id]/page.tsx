import data from "../../data/family_list.json";
import TicketDetail from "@/components/ticket-detail";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;

  const customer = data.find((f) => f.id === id);

  return {
    title: "AN VUI trân trọng kính mời tham dự sự kiện 10 năm 1 hành trình",
    description: `Trân trọng kính mời ${customer?.fullName} tham dự`,
  };
}

export async function generateStaticParams() {
  return data.map((customer) => ({
    id: String(customer.id),
  }));
}

const Detail = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const family = data.find((f) => f.id === id);

  return <TicketDetail id={family?.id} fullName={family?.fullName} />;
};

export default Detail;
