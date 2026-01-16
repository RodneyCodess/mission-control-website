"use client";

export type Mission = {
  id: number;
  title: string;
  desc: string;
  url: string;
  homepage: string;
  language: string;
  stars: number;
  forks: number;
  updatedAt: string;
  pushed_at: string;
  archived: boolean;
  repo: string;
};

export type MissionStatus = "ACTIVE" | "STANDBY" | "DORMANT" | "ARCHIVED";

type MissionCardProps = {
  mission: Mission;
  status: "ACTIVE" | "STANDBY" | "DORMANT" | "ARCHIVED";
  onBrief: (m: Mission) => void;
};

export default function MissionCard({ mission: m, status, onBrief }: MissionCardProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/40 p-4
        transition duration-200
        hover:bg-white/5 hover:border-white/20
        hover:-translate-y-1
        hover:shadow-lg hover:shadow-black/40"
    >

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-white/60">MISSION</div>
          <div className="mt-1 text-lg">{m.title}</div>
        </div>

        <div className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-xs text-white/80">
          {status}
        </div>
      </div>

      <p className="mt-2 text-sm text-white/70">
        {m.desc || "No description yet (add one on GitHub)."}
      </p>

      <div className="mt-3 flex items-center justify-between text-xs text-white/60">
        <span>{m.language || "—"}</span>
        <span className="text-white/50">
          Last push: {new Date(m.pushed_at || m.updatedAt).toLocaleDateString()}
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <a
          href={m.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-md bg-white px-3 py-2 text-xs font-medium text-black hover:bg-white/90"
        >
          LAUNCH
        </a>

        <button
          type="button"
          className="rounded-md border border-white/15 px-3 py-2 text-xs hover:bg-white/5"
          onClick={() => {
            console.log("BRIEF button clicked for:", m.repo);
            onBrief(m);
          }}
        >
          BRIEF
        </button>
      </div>
    </div>
  );
}
