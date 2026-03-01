"use client";

import { useEffect, useState } from "react";
import LeftNav, { MainView } from "./components/LeftNav";
import MissionCard, { Mission, MissionStatus } from "./components/MissionCard";
import BriefModal from "./components/BriefModal";
import MissionsModal from "./components/MissionsModal";
import TelemetryPanel from "./components/TelemetryPanel";

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
        <section
          className="mx-auto max-w-6xl px-6 pt-6"
          style={{ display: "flex", gap: "1rem", height: "440px", width: "100%" }}
        >
          {/* Left nav (component) */}
          <LeftNav active={activeView} onChange={setActiveView} />

          {/* Main screen */}
          <div
            className="rounded-xl border border-white/10 bg-white/5 p-6"
            style={{ flex: 1, overflow: "hidden", minWidth: 0 }}
          >
            <div className="mb-2 text-xs tracking-widest text-white/60">MAIN SCREEN</div>

            {/* Header changes depending on tab */}
            {activeView === "missions" ? (
              <>
                <h1 className="text-3xl font-semibold">Orbital Mission Control</h1>
                <p className="mt-2 max-w-prose text-white/70">
                  Tracking projects, systems, and launches. Click a mission to view the briefing.
                </p>
              </>
            ) : activeView === "about" ? (
              <>

                <div className="mt-6">
                  {/* Header */}
                  <div className="mb-5">
                    <div className="text-xs tracking-widest text-white/60">CANDIDATE DOSSIER</div>
                    <h2 className="mt-2 text-4xl font-semibold">Rodney Garnett</h2>
                    <p className="mt-2 text-white/70">
                      Computer Science @ University at Buffalo • building practical software projects.
                    </p>
                  </div>

                  <div className="mt-6">
                    {/* Summary */}
                  <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                    <div className="text-xs tracking-widest text-white/60">SUMMARY</div>
                    {/*Scrollable box for about me */}
                    <div className="mt-2 max-h-[125px] overflow-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                      <p className="mt-2 text-white/70">
                        Im Rodney, a Computer Science student at the University at Buffalo. 
                        I am building my way in tech one project at a time, focusing on software that solves real-world problems
                        or just a solid learning challenge. My stack includes :{" "}
                          <span className="text-white font-medium">
                            Python • Java • TypeScript
                          </span>, and I’m always expanding my toolkit with also frameworks and APIs.
                        I built this eportfolio website to show me and my projects in a creative way and practice real world engineering skills. like APIs and data handling.
                        my interests include :{" "}  
                        <span className="text-white font-medium">
                          Backend • Cloud • Infrastructure • Distributed Systems • Applied AI/ML
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
                
              </>
            ) : (
              <> 
                <h1 className="text-3xl font-semibold capitalize">{activeView}</h1>
                <p className="mt-2 max-w-prose text-white/70">
                  Section placeholder — we’ll build this next.
                </p>
              </>

            )}

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
          <TelemetryPanel
            activeView={activeView}
            buildVersion="v0.1"
            statusText="ONLINE"
            // later we can pass real data:
            // bars14d={bars}
            // commits7d={commits7d}
/>
        </section>

        {/* Bottom bar --> comms feed */}
        <div className="mx-auto max-w-6xl w-full px-6 mt-8">
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
