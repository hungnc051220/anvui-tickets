import assert from "node:assert/strict";
import test from "node:test";
import ExcelJS from "exceljs";
import { ImportValidationError, parseGuestsXlsx } from "../lib/guest-import.ts";
import { normalizeSearch } from "../lib/search.ts";
import { parseSheetCsv } from "../lib/sheet-import.ts";
import { guestNameSuffix } from "../lib/guest-label.ts";

async function workbookBuffer(rows) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Khách mời");
  for (const row of rows) sheet.addRow(row);
  return Buffer.from(await workbook.xlsx.writeBuffer());
}

test("tìm kiếm không phân biệt dấu, chữ hoa và đ", () => {
  assert.equal(normalizeSearch("  ĐỖ Sỹ Minh  "), "do sy minh");
  assert.ok(normalizeSearch("Chị Đào Thị Thanh Nhàn").includes(normalizeSearch("dao thi")));
});

test("đọc file xlsx và ghi nhận mã trùng trong file", async () => {
  const buffer = await workbookBuffer([
    ["Mã vé", "Họ tên"],
    ["SN10Y-63", "Nguyễn Văn A"],
    ["SN10Y-63", "Nguyễn Văn B"],
    ["SN10Y-64", "Trần Thị C"],
  ]);
  const parsed = await parseGuestsXlsx(buffer);
  assert.deepEqual(parsed.guests, [
    { id: "SN10Y-63", full_name: "Nguyễn Văn A", related_to: null, job_title: null },
    { id: "SN10Y-64", full_name: "Trần Thị C", related_to: null, job_title: null },
  ]);
  assert.deepEqual(parsed.duplicateIds, ["SN10Y-63"]);
});

test("dòng thiếu họ tên làm hủy toàn bộ import", async () => {
  const buffer = await workbookBuffer([
    ["Mã vé", "Họ tên"],
    ["SN10Y-63", "Nguyễn Văn A"],
    ["SN10Y-64", ""],
  ]);
  await assert.rejects(parseGuestsXlsx(buffer), ImportValidationError);
});

test("từ chối file sai định dạng và sai tiêu đề", async () => {
  await assert.rejects(parseGuestsXlsx(Buffer.from("not xlsx")), ImportValidationError);
  const buffer = await workbookBuffer([["ID", "Tên"], ["A", "B"]]);
  await assert.rejects(parseGuestsXlsx(buffer), ImportValidationError);
});

test("đồng bộ sheet chỉ lấy khách có tên và tạo mã SN11Y", () => {
  const csv = [
    "DANH SÁCH ĐĂNG KÝ,,,,,,",
    "STT - Mã số,Xưng hô,Họ và tên,Người thân của ai,Chức vụ,Tuổi,SĐT",
    "1,Anh,Phan Bá Mạnh,,CEO,,",
    "2,Cháu,Phan Quốc An,Phan Bá Mạnh,,5,",
    "3,,,,,,",
    "1,Anh,Tên trùng,,,,",
  ].join("\n");
  const parsed = parseSheetCsv(csv);
  assert.deepEqual(parsed.guests, [
    { id: "SN11Y-1", full_name: "Anh Phan Bá Mạnh", related_to: null, job_title: "CEO" },
    { id: "SN11Y-2", full_name: "Cháu Phan Quốc An", related_to: "Phan Bá Mạnh", job_title: null },
  ]);
  assert.deepEqual(parsed.duplicateIds, ["SN11Y-1"]);
});

test("sheet có tên nhưng thiếu mã bị từ chối", () => {
  const csv = "STT - Mã số,Xưng hô,Họ và tên,Người thân của ai,Chức vụ\n,Anh,Nguyễn Văn A,,";
  assert.throws(() => parseSheetCsv(csv), ImportValidationError);
});

test("sheet không có khách tạo danh sách rỗng", () => {
  const csv = "STT - Mã số,Xưng hô,Họ và tên,Người thân của ai,Chức vụ\n1,,,,";
  assert.deepEqual(parseSheetCsv(csv).guests, []);
});

test("chức vụ và quan hệ được hiển thị sau tên trên vé", () => {
  assert.equal(guestNameSuffix({ jobTitle: "CEO", relatedTo: null }), "CEO");
  assert.equal(
    guestNameSuffix({ jobTitle: null, relatedTo: "Phan Bá Mạnh" }),
    "Người thân của Phan Bá Mạnh",
  );
  assert.equal(guestNameSuffix({ jobTitle: null, relatedTo: null }), null);
});
