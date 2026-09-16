import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 pt-36 text-center">
      <h1 className="text-3xl font-bold text-[#06107C]">Không tìm thấy vé mời</h1>
      <p className="mt-3 text-slate-600">Mã vé này không có trong danh sách khách mời.</p>
      <Link href="/khach-moi" className="mt-6 inline-block rounded-full bg-[#06107C] px-6 py-3 font-semibold text-white">
        Xem danh sách khách mời
      </Link>
    </main>
  );
}
