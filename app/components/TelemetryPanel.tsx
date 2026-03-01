"use client";

type TelemetryPanelProps = {
  activeView: "missions" | "systems" | "certs" | "logs" | "about";
  buildVersion?: string;
  statusText?: string;
  bars14d?: number[];
  commits7d?: number | null;
};

function ProfileTelemetryCard() {
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden">
      <div className="relative w-full" style={{ height: "192px" }}>
        <img
          src="/me.jpg"
          alt="Rodney"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-2 left-2 rounded-md border border-white/10 bg-black/50 px-2 py-1 text-xs text-white/80 backdrop-blur">
          Rodney Garnett • CS
        </div>
      </div>
    </div>
  );
}

function ProfileMinicards() {
  return (
    <div className="mt-4 space-y-3 text-sm">
      <div className="rounded-lg border border-white/10 bg-black/40 p-3">
        <div className="text-xs text-white/60">AVAILABILITY</div>
        <div className="mt-1 text-green-400">Open : Intern / New Grad</div>
      </div>
      <div className="rounded-lg border border-white/10 bg-black/40 p-3">
        <div className="text-xs text-white/60">MORE ABOUT ME</div>
      </div>
    </div>
  );
}

function GithubActivityCard({ bars14d, commits7d }: { bars14d?: number[]; commits7d?: number | null }) {
  const bars = bars14d?.length ? bars14d : [2, 4, 3, 6, 8, 5, 3, 7, 9, 6, 4, 8, 5, 7];
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs tracking-widest text-white/60">GITHUB ACTIVITY</div>
        <div className="text-xs text-white/50">LAST 14 DAYS</div>
      </div>
      <div className="mt-3 flex items-end gap-1.5">
        {bars.map((h, idx) => (
          <div
            key={idx}
            className="w-2 rounded-sm bg-white/70"
            style={{ height: `${Math.max(1, h) * 8}px` }}
            title={`Day ${idx + 1}`}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-white/60">
        <span>Commits (7d): {commits7d ?? "--"}</span>
        <span className="text-white/50">Stack: Python • Java • TS</span>
      </div>
    </div>
  );
}

function MiniCards({ statusText, buildVersion }: { statusText?: string; buildVersion?: string }) {
  return (
    <div className="mt-4 space-y-3 text-sm">
      <div className="rounded-lg border border-white/10 bg-black/40 p-3">
        <div className="text-xs text-white/60">STATUS</div>
        <div className="mt-1 text-green-400">{statusText ?? "ONLINE"}</div>
      </div>
      <div className="rounded-lg border border-white/10 bg-black/40 p-3">
        <div className="text-xs text-white/60">BUILD</div>
        <div className="mt-1">{buildVersion ?? "v0.1"}</div>
        <div className="mt-1 text-xs text-white/50">Last deploy: --</div>
      </div>
    </div>
  );
}

export default function TelemetryPanel({
  activeView,
  buildVersion,
  statusText,
  bars14d,
  commits7d,
}: TelemetryPanelProps) {
  return (
    <aside
      className="rounded-xl border border-white/10 bg-white/5 p-4"
      style={{ width: "260px", flexShrink: 0, overflow: "hidden" }}
    >
      <div className="mb-3 text-xs tracking-widest text-white/60">TELEMETRY</div>
      {activeView === "about" ? (
        <>
          <ProfileTelemetryCard />
          <ProfileMinicards />
        </>
      ) : (
        <>
          <GithubActivityCard bars14d={bars14d} commits7d={commits7d ?? null} />
          <MiniCards statusText={statusText} buildVersion={buildVersion} />
        </>
      )}
    </aside>
  );
}
