"use client";
import { missions } from "../data/missions";
import { useEffect, useState } from "react";

export default function Home() {
    const comms = [
    "[SHIPPED] v0.1 • Mission Control UI online",
    "[FIXED] hydration warning • stable render",
    "[BUILD] Tailwind + Next.js • App Router",
    "[DATA] missions loaded from /data",
    "[NEXT] GitHub telemetry • activity chart",
  ];

  const [commsIndex, setCommsIndex] = useState(0);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
  const id = setInterval(() => {
    setCommsIndex((i) => (i + 1) % comms.length);
  }, 2500); // 2.5 seconds

  return () => clearInterval(id);
  }, [comms.length]);

  useEffect(() => {
  setFlash(true);
  const t = setTimeout(() => setFlash(false), 200);
  return () => clearTimeout(t);
}, [commsIndex]);

  return (
    <main className="space-bg text-white">
      <div className="space-content">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div className="hud-title text-lg font-semibold">
          🚀 Rodney // Mission Control
        </div>
        <nav className="flex gap-3 text-sm">
          <a className="rounded-md border border-white/10 px-3 py-1 hover:bg-white/5" href="#">
            Resume
          </a>
          <a className="rounded-md border border-white/10 px-3 py-1 hover:bg-white/5" href="https://github.com/rodneycodess">
            Github
          </a>
          <a className="rounded-md border border-white/10 px-3 py-1 hover:bg-white/5" href="#">
            Contact
          </a>
        </nav>
      </header>

      {/* 3-column layout */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 p-6 md:grid-cols-[220px_1fr_260px]">
        {/* Left nav */}
        <aside className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 text-xs tracking-widest text-white/60">NAV</div>
          <ul className="space-y-2 text-sm">
            <li className="text-white/90">• Missions</li>
            <li className="text-white/70">• Systems</li>
            <li className="text-white/70">• Certs</li>
            <li className="text-white/70">• Logs</li>
          </ul>
        </aside>

        {/* Main screen */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="mb-2 text-xs tracking-widest text-white/60">MAIN SCREEN</div>
          <h1 className="text-3xl font-semibold">Orbital Mission Control</h1>
          <p className="mt-2 max-w-prose text-white/70">
            Tracking projects, systems, and launches. Click a mission to view the briefing.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {missions.slice(0, 2).map((m) => (
              <div key={m.id} className="rounded-lg border border-white/10 bg-black/40 p-4">
                <div className="text-xs text-white/60">{m.code}</div>
                  <div className="mt-1 text-lg">
                    {m.code}: {m.title}
                  </div>
                <div className="mt-2 text-sm text-white/70">Status: {m.status}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90">
              Launch Demo
            </button>
            <button className="rounded-md border border-white/15 px-4 py-2 text-sm hover:bg-white/5">
              Read Brief
            </button>
          </div>
        </div>

        

        {/* Telemetry (Layout C) */}
        <aside className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 text-xs tracking-widest text-white/60">TELEMETRY</div>
          {/* GitHub Activity card */}
          <div className="rounded-xl border border-white/10 bg-black/40 p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs tracking-widest text-white/60">GITHUB ACTIVITY</div>
              <div className="text-xs text-white/50">LAST 14 DAYS</div>
            </div>
          
          {/* Signal bars placeholder */}
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
            <div className="mt-1 text-green-400">ONLINE.</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/40 p-3">
            <div className="text-xs text-white/60">BUILD</div>
            <div className="mt-1">v0.1</div>
            <div className="mt-1 text-xs text-white/50">Last deploy: --</div>
          </div>
          
        </div>
          
      </aside>
      </section>
      {/* Bottom bar --> comms feed*/}
          <div className="mx-auto max-w-6xl px-6 mt-4">
            <aside className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 overflow-hidden flex items-center gap-4 shadow-lg shadow-black/30" >
              {/* left label */}
              <div className="text-xs tracking-widest text-white/60 flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                <span>COMMS</span>
                <span className="text-white/40">•</span>
                <span className="text-green-400">LIVE</span>
              </div>
              {/* right label feed */}
              <div className={["relative flex-1 overflow-hidden whitespace-nowrap text-base text-white/80 ",
                flash
                ? "text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.35)] translate-x-[1px]"
                :"text-white/80",].join("")}>
                {comms[commsIndex]}
              </div>
            </aside>
          </div>
      </div>
    </main>
  );
}
