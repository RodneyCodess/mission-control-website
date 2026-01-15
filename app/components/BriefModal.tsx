"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type BriefModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  repo: string;
  loading: boolean;
  error: string | null;
  markdown: string;
  githubUser: string;
};

export default function BriefModal({
  open,
  onClose,
  title,
  repo,
  loading,
  error,
  markdown,
  githubUser,
}: BriefModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-xl border border-white/10 bg-[#0b1020] p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs tracking-widest text-white/60">MISSION BRIEF</div>
            <div className="mt-1 text-lg font-semibold">{title}</div>
            <div className="mt-1 text-xs text-white/50">{repo}</div>
          </div>

          <button
            className="rounded-md border border-white/15 px-3 py-2 text-xs hover:bg-white/5"
            onClick={onClose}
            type="button"
          >
            CLOSE
          </button>
        </div>

        <div className="mt-4 rounded-lg border border-white/10 bg-black/40 p-4">
          {loading && <div className="text-sm text-white/70">Loading briefing...</div>}

          {!loading && error && (
            <div className="text-sm text-red-300">
              {error}
              <div className="mt-2 text-xs text-white/60">
                Tip: Add a README.md to that repo to enable the briefing.
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="mt-4 max-h-[60vh] overflow-auto rounded-xl border border-white/10 bg-black/40 p-4">
                <article className="prose prose-invert max-w-none prose-p:text-white/80 prose-headings:text-white prose-a:text-green-300 prose-strong:text-white prose-code:text-green-200 prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {markdown}
                    </ReactMarkdown>
                </article>
            </div>

        )}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <a
            href={`https://github.com/${githubUser}/${repo}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-white px-3 py-2 text-xs font-medium text-black hover:bg-white/90"
          >
            OPEN REPO
          </a>
        </div>
      </div>
    </div>
  );
}
