import { isGuestListAuthorized, isSameOrigin } from "@/lib/auth";
import { ImportValidationError, parseGuestsXlsx } from "@/lib/guest-import";
import { saveGuests } from "@/lib/save-guests";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 403 });
  }
  if (!(await isGuestListAuthorized())) {
    return NextResponse.json({ error: "Chưa nhập mật khẩu danh sách." }, { status: 401 });
  }

  let file: FormDataEntryValue | null;
  try {
    file = (await request.formData()).get("file");
  } catch {
    return NextResponse.json({ error: "Không đọc được file tải lên." }, { status: 400 });
  }
  if (!(file instanceof File) || !file.name.toLowerCase().endsWith(".xlsx")) {
    return NextResponse.json({ error: "Chỉ hỗ trợ file .xlsx." }, { status: 400 });
  }
  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.json({ error: "File không được vượt quá 4 MB." }, { status: 400 });
  }

  try {
    const parsed = await parseGuestsXlsx(Buffer.from(await file.arrayBuffer()));
    return NextResponse.json(await saveGuests(parsed));
  } catch (error) {
    if (error instanceof ImportValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Guest import failed", error);
    return NextResponse.json({ error: "Không lưu được danh sách khách mời." }, { status: 500 });
  }
}
