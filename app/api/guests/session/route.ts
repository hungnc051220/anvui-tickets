import { isGuestListAuthorized } from "@/lib/auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    { authenticated: await isGuestListAuthorized() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
