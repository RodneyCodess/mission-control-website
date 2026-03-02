import { NextResponse } from "next/server";

type GitHubEvent = {
  type: string;
  created_at: string;
  payload: {
    commits?: { sha: string }[];
  };
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const user = url.searchParams.get("user");

  if (!user) {
    return NextResponse.json({ ok: false, error: "Missing ?user=" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(user)}/events?per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "mission-control-portfolio",
      },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    return NextResponse.json({ ok: false, error: `GitHub error ${res.status}` }, { status: res.status });
  }

  const events: GitHubEvent[] = await res.json();

  // Build a map of date -> commit count for the last 14 days
  const now = new Date();
  const dayMap: Record<string, number> = {};

  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dayMap[d.toISOString().slice(0, 10)] = 0;
  }

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  let commits7d = 0;

  for (const event of events) {
    if (event.type !== "PushEvent") continue;
    const dateKey = event.created_at.slice(0, 10);
    const commitCount = event.payload.commits?.length ?? 0;

    if (dateKey in dayMap) {
      dayMap[dateKey] += commitCount;
    }

    if (new Date(event.created_at) >= sevenDaysAgo) {
      commits7d += commitCount;
    }
  }

  const bars14d = Object.values(dayMap);

  return NextResponse.json({ ok: true, bars14d, commits7d });
}
