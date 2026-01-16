"use client";

import { Mission } from "./MissionCard";

type MissionsModalProps = {
  open: boolean;
  onClose: () => void;
  missions: Mission[];
  onBrief: (m: Mission) => void;
};

export default function MissionsModal({ open, onClose, missions, onBrief }: MissionsModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl rounded-xl border border-white/10 bg-[#0b1020] p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs tracking-widest text-white/60">MISSIONS</div>
            <div className="mt-1 text-lg font-semibold">
              All Missions <span className="text-white/50">({missions.length})</span>
            </div>
            <div className="mt-1 text-xs text-white/50">
              Click LAUNCH to open GitHub, or BRIEF to read the README.
            </div>
          </div>

          <button
            className="rounded-md border border-white/15 px-3 py-2 text-xs hover:bg-white/5"
            onClick={onClose}
            type="button"
          >
            CLOSE
          </button>
        </div>

        <div className="mt-4 max-h-[65vh] overflow-auto rounded-xl border border-white/10 bg-black/40 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {missions.map((m) => (
              <div
                key={m.id}
                className="rounded-lg border border-white/10 bg-black/40 p-4 transition hover:bg-white/5 hover:border-white/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-white/60">MISSION</div>
                    <div className="mt-1 text-base font-medium">{m.title}</div>
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
                    onClick={() => onBrief(m)}
                  >
                    BRIEF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
