import "server-only";

import { db } from "./db";
import type { ParsedGuests } from "./guest-import";

export async function saveGuests(parsed: ParsedGuests) {
  const sql = db();
  const inserted = await sql`
    insert into guests ${sql(parsed.guests, "id", "full_name", "related_to", "job_title")}
    on conflict (id) do nothing
    returning id
  `;
  const insertedIds = new Set(inserted.map((row) => row.id as string));
  const skippedIds = [
    ...parsed.duplicateIds,
    ...parsed.guests.filter((guest) => !insertedIds.has(guest.id)).map((guest) => guest.id),
  ];
  return { insertedCount: inserted.length, skippedIds };
}

export async function replaceGuests(parsed: ParsedGuests) {
  const sql = db();
  const removedCount = await sql.begin(async (transaction) => {
    const removed = await transaction`delete from guests returning id`;
    if (parsed.guests.length) {
      await transaction`
        insert into guests ${transaction(parsed.guests, "id", "full_name", "related_to", "job_title")}
      `;
    }
    return removed.length;
  });

  return {
    mode: "replaced" as const,
    insertedCount: parsed.guests.length,
    removedCount,
    skippedIds: parsed.duplicateIds,
  };
}
