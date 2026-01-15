import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type GitHubReadmeJson = {
  content?: string;      // base64
  encoding?: string;     // "base64"
  message?: string;      // errors
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const user = url.searchParams.get("user");
  const repo = url.searchParams.get("repo");

  if (!user || !repo) {
    return NextResponse.json(
      { ok: false, error: "Missing ?user= or ?repo= in the URL" },
      { status: 400 }
    );
  }

  const ghUrl = `https://api.github.com/repos/${encodeURIComponent(user)}/${encodeURIComponent(repo)}/readme`;

  const res = await fetch(ghUrl, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "mission-control-portfolio",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });

  if (res.status === 404) {
    return NextResponse.json(
      { ok: false, code: "no_readme", error: "BRIEFING NOT FOUND" },
      { status: 404 }
    );
  }

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, error: `GitHub error ${res.status}` },
      { status: res.status }
    );
  }

  // GitHub returns JSON with base64 content by default for README
  const json = (await res.json()) as GitHubReadmeJson;

  const content = json.content ?? "";
  const encoding = json.encoding ?? "";

  if (encoding === "base64" && content) {
    const markdown = Buffer.from(content, "base64").toString("utf8");
    return NextResponse.json({ ok: true, user, repo, markdown });
  }

  // Fallback if GitHub ever changes response format
  return NextResponse.json({
    ok: false,
    error: "README response missing base64 content",
  });
}
