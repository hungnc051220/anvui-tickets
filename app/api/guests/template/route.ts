import ExcelJS from "exceljs";
import { isGuestListAuthorized } from "@/lib/auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isGuestListAuthorized())) {
    return NextResponse.json({ error: "Chưa nhập mật khẩu danh sách." }, { status: 401 });
  }
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Khách mời");
  sheet.columns = [
    { header: "Mã vé", key: "id", width: 22, style: { numFmt: "@" } },
    { header: "Họ tên", key: "fullName", width: 46 },
  ];
  sheet.getRow(1).font = { bold: true };
  sheet.addRow({ id: "SN10Y-63", fullName: "Nguyễn Văn A" });
  const buffer = await workbook.xlsx.writeBuffer();
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="danh-sach-khach-moi.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}
