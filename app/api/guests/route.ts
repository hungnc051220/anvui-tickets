import { isGuestListAuthorized } from "@/lib/auth";
import { getGuests } from "@/lib/guests";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
};

export async function GET() {
  if (!(await isGuestListAuthorized())) {
    return NextResponse.json(
      { error: "Chưa nhập mật khẩu danh sách." },
      { status: 401, headers: NO_STORE_HEADERS },
    );
  }

  return NextResponse.json(
    { guests: await getGuests() },
    { headers: NO_STORE_HEADERS },
  );
}
