"use client";

import { useEffect, useState } from "react";
import LeftNav, { MainView } from "./components/LeftNav";
import MissionCard, { Mission, MissionStatus } from "./components/MissionCard";
import BriefModal from "./components/BriefModal";
import MissionsModal from "./components/MissionsModal";

type ReadmeOk = { ok: true; markdown: string };
type ReadmeErr = { ok: false; error: string; code?: string };
type ReadmeResponse = ReadmeOk | ReadmeErr;

function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}

function getStatus(m: Mission): MissionStatus {
  if (m.archived) return "ARCHIVED";

  const daysAgo30 = new Date();
  daysAgo30.setDate(daysAgo30.getDate() - 30);

  const daysAgo180 = new Date();
  daysAgo180.setDate(daysAgo180.getDate() - 180);

  const pushedDate = new Date(m.pushed_at || m.updatedAt);

  if (pushedDate >= daysAgo30) return "ACTIVE";
  if (pushedDate >= daysAgo180) return "STANDBY";
  return "DORMANT";
}

export default function Home() {
  const GITHUB_USER = "rodneycodess";

  // NAV view switching (controls main screen)
  const [activeView, setActiveView] = useState<MainView>("missions");

  // Missions (from GitHub)
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loadingMissions, setLoadingMissions] = useState(true);

  // Brief modal state
  const [briefOpen, setBriefOpen] = useState(false);
  const [briefTitle, setBriefTitle] = useState("");
  const [briefRepo, setBriefRepo] = useState("");
  const [briefLoading, setBriefLoading] = useState(false);
  const [briefError, setBriefError] = useState<string | null>(null);
  const [briefMarkdown, setBriefMarkdown] = useState("");


  //view missions
  const [missionsOpen, setMissionsOpen] = useState(false);

  // Comms feed state
  const comms = [
    "[SHIPPED] v0.1 • Mission Control UI online",
    "[FIXED] hydration warning • stable render",
    "[BUILD] Tailwind + Next.js • App Router",
    "[DATA] missions loaded from GitHub",
    "[NEXT] README Briefings • logs screen",
  ];
  const [commsIndex, setCommsIndex] = useState(0);
  const [flash, setFlash] = useState(false);

  // Load missions once
  useEffect(() => {
    async function loadMissions() {
      try {
        const res = await fetch(`/api/repos?user=${encodeURIComponent(GITHUB_USER)}`);
        const data = (await res.json()) as { missions: Mission[]; error?: string };
        if (!res.ok) throw new Error(data?.error ?? "Failed to load repos");

        setMissions(data.missions ?? []);
      } catch (err) {
        console.error(err);
        setMissions([]);
      } finally {
        setLoadingMissions(false);
      }
    }
    loadMissions();
  }, []);

  // Auto pick 2 featured: most recently pushed
  const featuredMissions = [...missions]
    .sort((a, b) => {
      const aTime = new Date(a.pushed_at || a.updatedAt).getTime();
      const bTime = new Date(b.pushed_at || b.updatedAt).getTime();
      return bTime - aTime;
    })
    .slice(0, 2);

  // Comms rotation
  useEffect(() => {
    const id = setInterval(() => {
      setCommsIndex((i) => (i + 1) % comms.length);
    }, 2500);
    return () => clearInterval(id);
  }, [comms.length]);

  useEffect(() => {
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 200);
    return () => clearTimeout(t);
  }, [commsIndex]);

  // Open briefing modal + fetch README
  async function openBrief(m: Mission) {
    console.log("openBrief called:", m.repo);
    const repoRaw = m.repo ?? "";
    const repoName = repoRaw.includes("/") ? repoRaw.split("/")[1] : repoRaw;

    setBriefOpen(true);
    setBriefTitle(m.title);
    setBriefRepo(repoName);
    setBriefLoading(true);
    setBriefError(null);
    setBriefMarkdown("");

    if (!repoName) {
      setBriefLoading(false);
      setBriefError("Missing repo name for this mission (check /api/repos mapping).");
      
      return;
    }

    try {
      const res = await fetch(
        `/api/readme?user=${encodeURIComponent(GITHUB_USER)}&repo=${encodeURIComponent(repoName)}`
      );
      const data = (await res.json()) as ReadmeResponse;

      if (!res.ok || !data.ok) {
        const msg = data.ok ? `Failed to load briefing (${res.status})` : data.error;
        throw new Error(msg);
      }

      setBriefMarkdown(data.markdown);
    } catch (e: unknown) {
      setBriefError(errorMessage(e));
    } finally {
      setBriefLoading(false);
    }
  }

  return (
    <main className="space-bg text-white">
      <div className="space-content">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="hud-title text-lg font-semibold">🚀 Rodney // Mission Control</div>

          <nav className="flex gap-3 text-sm">
            <a className="rounded-md border border-white/10 px-3 py-1 hover:bg-white/5" href="#">
              Resume
            </a>

            <a
              className="rounded-md border border-white/10 px-3 py-1 hover:bg-white/5"
              href="https://github.com/rodneycodess"
              target="_blank"
              rel="noreferrer"
            >
              Github
            </a>

            <a className="rounded-md border border-white/10 px-3 py-1 hover:bg-white/5" href="#">
              Contact
            </a>
          </nav>
        </header>

        {/* 3-column layout */}
        <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 p-6 md:grid-cols-[220px_1fr_260px]">
          {/* Left nav (component) */}
          <LeftNav active={activeView} onChange={setActiveView} />

          {/* Main screen */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="mb-2 text-xs tracking-widest text-white/60">MAIN SCREEN</div>
            <h1 className="text-3xl font-semibold">Orbital Mission Control</h1>
            <p className="mt-2 max-w-prose text-white/70">
              Tracking projects, systems, and launches. Click a mission to view the briefing.
            </p>

            {/* View switching */}
            {activeView === "missions" && (
              <div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-white/60">
                    Showing{" "}
                    <span className="text-white/80 font-medium">{featuredMissions.length}</span>{" "}
                    featured missions
                  </div>  
                  <button
                    type="button"
                    onClick={() => setMissionsOpen(true)}
                    className="rounded-md border border-white/15 px-3 py-2 text-xs hover:bg-white/5 transition"
                  >
                    VIEW ALL MISSIONS ({missions.length})
                  </button>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {loadingMissions && (
                    <div className="rounded-lg border border-white/10 bg-black/40 p-4 text-sm text-white/60">
                      Loading missions from GitHub...
                    </div>
                  )}

                  {!loadingMissions &&
                    featuredMissions.map((m) => (
                    <MissionCard key={m.id} mission={m} status={getStatus(m)} onBrief={openBrief} />
                    ))}
                </div>
              </div>
            )}


            {activeView === "logs" && (
              <div className="mt-6 rounded-lg border border-white/10 bg-black/40 p-4 text-sm text-white/70">
                Logs screen placeholder — next we can show comms history + build notes.
              </div>
            )}

            {activeView === "about" && (
              <div className="mt-6 rounded-lg border border-white/10 bg-black/40 p-4 text-sm text-white/70">
                About screen placeholder — next we can add your bio + resume + links.
              </div>
            )}

            {activeView === "systems" && (
              <div className="mt-6 rounded-lg border border-white/10 bg-black/40 p-4 text-sm text-white/70">
                Systems placeholder — could show stack, tools, environment, setup.
              </div>
            )}

            {activeView === "certs" && (
              <div className="mt-6 rounded-lg border border-white/10 bg-black/40 p-4 text-sm text-white/70">
                Certs placeholder — could show certifications + badges.
              </div>
            )}
          </div>

          {/* Telemetry */}
          <aside className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 text-xs tracking-widest text-white/60">TELEMETRY</div>

            {/* GitHub Activity card */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs tracking-widest text-white/60">GITHUB ACTIVITY</div>
                <div className="text-xs text-white/50">LAST 14 DAYS</div>
              </div>

              {/* Placeholder bars for now */}
              <div className="mt-3 flex items-end gap-1.5">
                {[2, 4, 3, 6, 8, 5, 3, 7, 9, 6, 4, 8, 5, 7].map((h, idx) => (
                  <div
                    key={idx}
                    className="w-2 rounded-sm bg-white/70"
                    style={{ height: `${h * 8}px` }}
                    title={`Day ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-white/60">
                <span>Commits (7d): --</span>
                <span className="text-white/50">Stack: Python • Java • TS</span>
              </div>
            </div>

            {/* Small cards */}
            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-lg border border-white/10 bg-black/40 p-3">
                <div className="text-xs text-white/60">STATUS</div>
                <div className="mt-1 text-green-400">ONLINE</div>
              </div>

              <div className="rounded-lg border border-white/10 bg-black/40 p-3">
                <div className="text-xs text-white/60">BUILD</div>
                <div className="mt-1">v0.1</div>
                <div className="mt-1 text-xs text-white/50">Last deploy: --</div>
              </div>
            </div>
          </aside>
        </section>

        {/* Bottom bar --> comms feed */}
        <div className="mx-auto max-w-6xl px-6 mt-4">
          <aside className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 overflow-hidden flex items-center gap-4 shadow-lg shadow-black/30">
            {/* left label */}
            <div className="text-xs tracking-widest text-white/60 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
              <span>COMMS</span>
              <span className="text-white/40">•</span>
              <span className="text-green-400">LIVE</span>
            </div>

            {/* right feed */}
            <div
              className={[
                "relative flex-1 overflow-hidden whitespace-nowrap text-base text-white/80",
                flash
                  ? "text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.35)] translate-x-[1px]"
                  : "text-white/80",
              ].join(" ")}
            >
              {comms[commsIndex]}
            </div>
          </aside>
        </div>
      </div>

      {/* All Mission Modal*/}
      <MissionsModal
        open={missionsOpen}
        onClose={() => setMissionsOpen(false)}
        missions={missions}
        onBrief={(m) => {
          setMissionsOpen(false)
          openBrief(m)
        }}
      />


      {/* Brief modal overlay */}
      <BriefModal
        open={briefOpen}
        onClose={() => setBriefOpen(false)}
        title={briefTitle}
        repo={briefRepo}
        loading={briefLoading}
        error={briefError}
        markdown={briefMarkdown}
        githubUser={GITHUB_USER}
      />
    </main>
  );
}
