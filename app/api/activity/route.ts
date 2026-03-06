import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const user = url.searchParams.get("user");

  if (!user) {
    return NextResponse.json({ ok: false, error: "Missing ?user=" }, { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ ok: false, error: "Missing GITHUB_TOKEN" }, { status: 500 });
  }

  // Build date range: last 14 days
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - 13);

  const query = `
    query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "mission-control-portfolio",
    },
    body: JSON.stringify({
      query,
      variables: {
        login: user,
        from: from.toISOString(),
        to: now.toISOString(),
      },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ ok: false, error: `GitHub error ${res.status}` }, { status: res.status });
  }

  const json = await res.json();
  const days: { date: string; contributionCount: number }[] =
    json.data?.user?.contributionsCollection?.contributionCalendar?.weeks
      ?.flatMap((w: { contributionDays: { date: string; contributionCount: number }[] }) => w.contributionDays) ?? [];

  // Build ordered 14-day array
  const dayMap: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dayMap[d.toISOString().slice(0, 10)] = 0;
  }

  for (const day of days) {
    if (day.date in dayMap) {
      dayMap[day.date] = day.contributionCount;
    }
  }

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const sevenDayKey = sevenDaysAgo.toISOString().slice(0, 10);

  const commits7d = Object.entries(dayMap)
    .filter(([date]) => date >= sevenDayKey)
    .reduce((sum, [, count]) => sum + count, 0);

  const bars14d = Object.values(dayMap);

  return NextResponse.json({ ok: true, bars14d, commits7d });
}
