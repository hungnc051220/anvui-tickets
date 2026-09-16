import ExcelJS from "exceljs";

export type ImportGuest = {
  id: string;
  full_name: string;
  related_to: string | null;
  job_title: string | null;
};
export type ParsedGuests = { guests: ImportGuest[]; duplicateIds: string[] };

export class ImportValidationError extends Error {}

function textValue(value: ExcelJS.CellValue): string | null {
  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim();
  }
  return null;
}

export async function parseGuestsXlsx(buffer: Buffer): Promise<ParsedGuests> {
  if (buffer.length < 4 || buffer.subarray(0, 4).toString("hex") !== "504b0304") {
    throw new ImportValidationError("File không phải định dạng .xlsx hợp lệ.");
  }

  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(buffer as unknown as Parameters<typeof workbook.xlsx.load>[0]);
  } catch {
    throw new ImportValidationError("Không đọc được file .xlsx.");
  }

  const sheet = workbook.worksheets[0];
  if (!sheet) throw new ImportValidationError("File Excel không có trang tính.");

  const first = textValue(sheet.getCell(1, 1).value)?.toLocaleLowerCase("vi");
  const second = textValue(sheet.getCell(1, 2).value)?.toLocaleLowerCase("vi");
  if (
    first !== "mã vé" ||
    second !== "họ tên" ||
    sheet.getRow(1).cellCount > 2
  ) {
    throw new ImportValidationError('Dòng đầu phải có đúng hai cột "Mã vé" và "Họ tên".');
  }

  const guests: ImportGuest[] = [];
  const duplicateIds: string[] = [];
  const seen = new Set<string>();
  const errors: number[] = [];

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const id = textValue(row.getCell(1).value);
    const fullName = textValue(row.getCell(2).value);
    if (!id && !fullName && row.cellCount <= 2) return;

    if (
      !id ||
      !fullName ||
      id.length > 100 ||
      fullName.length > 255 ||
      row.cellCount > 2
    ) {
      errors.push(rowNumber);
      return;
    }

    if (seen.has(id)) {
      duplicateIds.push(id);
      return;
    }
    seen.add(id);
    guests.push({ id, full_name: fullName, related_to: null, job_title: null });
  });

  if (errors.length) {
    throw new ImportValidationError(
      `Dòng thiếu hoặc sai dữ liệu: ${errors.slice(0, 10).join(", ")}${errors.length > 10 ? "…" : ""}. Chưa thêm khách nào.`,
    );
  }
  if (!guests.length) {
    throw new ImportValidationError("File Excel không có khách mời hợp lệ.");
  }
  if (guests.length + duplicateIds.length > 5000) {
    throw new ImportValidationError("Mỗi lần chỉ import tối đa 5.000 dòng.");
  }

  return { guests, duplicateIds };
}
