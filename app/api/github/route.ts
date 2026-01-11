export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const user = url.searchParams.get("user");

  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Missing ?user= in the URL" },
      { status: 400 }
    );
  }

  const debug = url.searchParams.get("debug") === "1";

  const ghUrl = `https://api.github.com/users/${encodeURIComponent(user)}/events/public?per_page=100`;


  const res = await fetch(ghUrl, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "mission-control-portfolio",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, error: `GitHub error ${res.status}` },
      { status: res.status }
    );
  }

  const events = await res.json();

  if (debug) {
  return NextResponse.json(
    {
      ok: true,
      user,
      fetched: events.length,
      types: Array.from(new Set(events.map((e: any) => e.type))),
      sample: events.slice(0, 10).map((e: any) => ({
        type: e.type,
        created_at: e.created_at,
        repo: e.repo?.name ?? null,
        size: e.type === "PushEvent" ? (e.payload?.size ?? 0) : undefined,
      })),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}


  const days = 14;
  const dayStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const now = new Date();
  const today = dayStart(now);

  const start = new Date(today);
  start.setDate(start.getDate() - (days - 1));

  const bars = Array(days).fill(0);
  let lastPushAt: string | null = null;

  for (const ev of events) {
    if (ev.type !== "PushEvent") continue;

    const created = new Date(ev.created_at);
    if (!lastPushAt || created > new Date(lastPushAt)) lastPushAt = ev.created_at;

    if (created < start) continue;

    const createdDay = dayStart(created);
    const idx = Math.floor((createdDay.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    if (idx < 0 || idx >= days) continue;

    const commitsInPush = Number(ev.payload?.size ?? 0);
    bars[idx] += commitsInPush;
    }
    
    const commits7d = bars.slice(-7).reduce((a, b) => a + b, 0);

    return NextResponse.json({
    ok: true,
    user,
    bars,
    commits7d,
    lastPushAt,
    });
}
