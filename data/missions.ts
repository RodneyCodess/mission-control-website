export type MissionStatus = "IN FLIGHT" | "TESTING" | "DOCKED" | "ARCHIVED";

export type Mission = {
  id: string;
  code: string;
  title: string;
  status: MissionStatus;
  summary: string;
  stack: string[];
  links: {
    repo?: string;
    demo?: string;
  };
};

export const missions: Mission[] = [
  {
    id: "trading-bot",
    code: "BOT-01",
    title: "Trading Bot",
    status: "IN FLIGHT",
    summary: "Backtesting engine + strategy experiments + performance metrics.",
    stack: ["Python", "pandas", "backtesting.py"],
    links: { repo: "#", demo: "#" },
  },
  {
    id: "portfolio",
    code: "WEB-02",
    title: "Mission Control Portfolio",
    status: "TESTING",
    summary: "Sci-fi dashboard portfolio with mission briefs and telemetry.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    links: { repo: "#", demo: "#" },
  },
  {
    id: "cache-sim",
    code: "SYS-03",
    title: "Cache Simulator",
    status: "DOCKED",
    summary: "Simulated cache hits/misses to visualize performance tradeoffs.",
    stack: ["C", "Python"],
    links: { repo: "#", demo: "#" },
  },
];
