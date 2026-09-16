import { parse } from "csv-parse/sync";
import { ImportValidationError, type ParsedGuests } from "./guest-import.ts";

const EXPECTED_HEADERS = [
  "STT - Mã số",
  "Xưng hô",
  "Họ và tên",
  "Người thân của ai",
  "Chức vụ",
];

export function parseSheetCsv(csv: string): ParsedGuests {
  let rows: string[][];
  try {
    rows = parse(csv, { bom: true, skip_empty_lines: true, relax_column_count: true });
  } catch {
    throw new ImportValidationError("Không đọc được dữ liệu Google Sheets.");
  }

  const headerIndex = rows.findIndex((row) =>
    EXPECTED_HEADERS.every((header, index) => row[index]?.trim() === header),
  );
  if (headerIndex < 0) {
    throw new ImportValidationError("Google Sheets thiếu một trong các cột mã số, xưng hô, họ tên, người thân hoặc chức vụ.");
  }

  const guests: ParsedGuests["guests"] = [];
  const duplicateIds: string[] = [];
  const seen = new Set<string>();
  const invalidRows: number[] = [];

  rows.slice(headerIndex + 1).forEach((row, index) => {
    const name = row[2]?.trim();
    if (!name) return;
    const number = row[0]?.trim();
    const salutation = row[1]?.trim();
    const fullName = [salutation, name].filter(Boolean).join(" ");
    const relatedTo = row[3]?.trim() || null;
    const jobTitle = row[4]?.trim() || null;
    if (
      !number ||
      !/^[1-9]\d*$/.test(number) ||
      fullName.length > 255 ||
      (relatedTo?.length ?? 0) > 255 ||
      (jobTitle?.length ?? 0) > 255
    ) {
      invalidRows.push(headerIndex + index + 2);
      return;
    }
    const id = `SN11Y-${number}`;
    if (seen.has(id)) {
      duplicateIds.push(id);
      return;
    }
    seen.add(id);
    guests.push({ id, full_name: fullName, related_to: relatedTo, job_title: jobTitle });
  });

  if (invalidRows.length) {
    throw new ImportValidationError(
      `Dòng Google Sheets có mã hoặc họ tên không hợp lệ: ${invalidRows.slice(0, 10).join(", ")}. Chưa thêm khách nào.`,
    );
  }
  if (guests.length + duplicateIds.length > 5000) {
    throw new ImportValidationError("Chỉ đồng bộ tối đa 5.000 khách mỗi lần.");
  }

  return { guests, duplicateIds };
}
