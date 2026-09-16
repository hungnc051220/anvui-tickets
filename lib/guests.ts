import "server-only";

import { db } from "./db";

export type Guest = {
  id: string;
  fullName: string;
};

export type GuestDetail = Guest & {
  relatedTo: string | null;
  jobTitle: string | null;
};

export async function getGuests(): Promise<GuestDetail[]> {
  const rows = await db()`
    select id, full_name, related_to, job_title
    from guests
  `;

  const collator = new Intl.Collator("vi", { numeric: true, sensitivity: "base" });
  return rows
    .map((row) => ({
      id: row.id,
      fullName: row.full_name,
      relatedTo: row.related_to,
      jobTitle: row.job_title,
    }))
    .sort((a, b) => collator.compare(a.id, b.id));
}

export async function getGuest(id: string): Promise<GuestDetail | null> {
  const rows = await db()`
    select id, full_name, related_to, job_title
    from guests
    where id = ${id}
    limit 1
  `;

  const guest = rows[0];
  return guest
    ? {
        id: guest.id,
        fullName: guest.full_name,
        relatedTo: guest.related_to,
        jobTitle: guest.job_title,
      }
    : null;
}
