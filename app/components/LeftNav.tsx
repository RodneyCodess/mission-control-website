"use client";

export type MainView = "missions" | "logs" | "about" | "systems" | "certs";

type LeftNavProps = {
  active: MainView;
  onChange: (v: MainView) => void;
};

export default function LeftNav({ active, onChange }: LeftNavProps) {
  const item = (id: MainView, label: string) => {
    const isActive = active === id;

    return (
      <button
        key={id}
        type="button"
        onClick={() => onChange(id)}
        className={[
          "w-full rounded-md px-2 py-2 text-left text-sm transition",
          isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5",
        ].join(" ")}
      >
        • {label}
      </button>
    );
  };

  return (
    <aside className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 text-xs tracking-widest text-white/60">NAV</div>
      <div className="space-y-1">
        {item("missions", "Missions")}
        {item("systems", "Systems")}
        {item("certs", "Certs")}
        {item("logs", "Logs")}
        {item("about", "About")}
      </div>
    </aside>
  );
}

