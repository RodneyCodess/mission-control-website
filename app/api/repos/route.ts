import { NextResponse } from "next/server";
import { arch } from "os";

type GitHubRepo = {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    pushed_at: string;
    archived: boolean;
    repo: string;
    fork: boolean;
    private: boolean;
};

export async function GET(req: Request) {
    const url = new URL(req.url);
    const user = url.searchParams.get("user");

    if (!user) {
        return NextResponse.json(
        { ok: false, error: "Missing ?user= in the URL" },
        { status: 400 }
        );
    }

    const ghUrl = `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=updated`;

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

    const repos: GitHubRepo[] = await res.json();

    const missions = repos
        .filter((r) => !r.fork)

    .map((r) => ({
        id: r.id,
        title: r.name,                // repo name
        desc: r.description ?? "",    // repo description
        url: r.html_url,              // link to repo
        homepage: r.homepage ?? "",   // if you set a live demo link on GitHub
        language: r.language ?? "",   // primary language (GitHub guess)
        stars: r.stargazers_count ?? 0,
        forks: r.forks_count ?? 0,
        updatedAt: r.updated_at,      // last updated timestamp
        pushed_at: r.pushed_at,
        archived: r.archived ?? false,
        repo: r.repo,
    }));

    return  NextResponse.json({
        ok:true,
        user,
        missions,
    })



}
