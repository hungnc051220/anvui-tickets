import { isGuestListAuthorized, isSameOrigin } from "@/lib/auth";
import { ImportValidationError } from "@/lib/guest-import";
import { replaceGuests } from "@/lib/save-guests";
import { parseSheetCsv } from "@/lib/sheet-import";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1g3PJ5Gw2w2R4VDJCplCy7htcS6BwwYGu/export?format=csv&gid=1760843707";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 403 });
  }
  if (!(await isGuestListAuthorized())) {
    return NextResponse.json({ error: "Chưa nhập mật khẩu danh sách." }, { status: 401 });
  }

  try {
    const response = await fetch(SHEET_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`Google Sheets trả về ${response.status}`);
    const csv = await response.text();
    if (Buffer.byteLength(csv, "utf8") > 4 * 1024 * 1024) {
      throw new ImportValidationError("Google Sheets vượt quá 4 MB.");
    }
    const result = await replaceGuests(parseSheetCsv(csv));
    revalidatePath("/[id]", "page");
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ImportValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Google Sheets sync failed", error);
    return NextResponse.json(
      { error: "Không lấy được dữ liệu Google Sheets. Hãy kiểm tra quyền chia sẻ của sheet." },
      { status: 502 },
    );
  }
}
