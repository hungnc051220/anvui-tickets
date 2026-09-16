import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL chưa được cấu hình.");
}

const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });

try {
  await sql`
    create table if not exists guests (
      id text primary key,
      full_name text not null check (length(trim(full_name)) > 0),
      related_to text,
      job_title text,
      created_at timestamptz not null default now()
    )
  `;
  await sql`alter table guests add column if not exists related_to text`;
  await sql`alter table guests add column if not exists job_title text`;

  console.log("Bảng guests đã sẵn sàng. Mở /khach-moi và đồng bộ Google Sheets để cập nhật danh sách.");
} finally {
  await sql.end();
}
