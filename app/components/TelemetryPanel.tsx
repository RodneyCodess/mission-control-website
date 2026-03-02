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
        <a
          href="https://www.linkedin.com/in/rodney-garnett-8830a4276/"
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block w-full rounded-md border border-white/15 px-3 py-2 text-center text-xs text-white/80 hover:bg-white/5 transition"
        >
          LinkedIn →
        </a>
      </div>
    </div>
  );
}

function GithubActivityCard({ bars14d, commits7d }: { bars14d?: number[]; commits7d?: number | null }) {
  const data = bars14d?.length ? bars14d : [2, 4, 3, 6, 8, 5, 3, 7, 9, 6, 4, 8, 5, 7];

  const W = 200;
  const H = 60;
  const max = Math.max(...data, 1);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - (v / max) * (H - 4) - 2;
    return `${x},${y}`;
  });
  const polyline = points.join(" ");
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs tracking-widest text-white/60">GITHUB ACTIVITY</div>
        <div className="text-xs text-white/50">LAST 14 DAYS</div>
      </div>
      <div className="mt-3">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none">
          {/* Gradient fill under line */}
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          <polygon
            points={`0,${H} ${polyline} ${W},${H}`}
            fill="url(#lineGrad)"
          />
          <polyline
            points={polyline}
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Dot at start and end */}
          {[firstPoint, lastPoint].map((pt, i) => {
            const [x, y] = pt.split(",").map(Number);
            return <circle key={i} cx={x} cy={y} r="2.5" fill="white" opacity="0.8" />;
          })}
        </svg>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-white/60">
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
      className="rounded-xl border border-white/10 bg-white/5"
      style={{ width: "260px", flexShrink: 0, overflow: "hidden", padding: "20px" }}
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
