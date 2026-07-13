"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * "Ask your agent" block — the opening move for a docs page.
 *
 * Each prompt is a complete, copy-ready instruction for the reader's IDE
 * agent. Fill-in-the-blank slots are marked «like this» in the prompt text;
 * they render highlighted and are copied as-is (the user replaces them after
 * pasting).
 *
 * Usage in MDX:
 *   <AskAgent
 *     prompts={[
 *       { intent: "Cold start", text: "Use the Glubean skill and …«your API»…" },
 *     ]}
 *   />
 */

const BLANK_RE = /«([^»]*)»/g;

function renderPromptText(text) {
  const parts = text.split(BLANK_RE);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="ask-agent-blank">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function SparkIcon() {
  return (
    <svg
      className="ask-agent-spark"
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 1.5c.4 2.9 1.7 4.9 4.6 5.6.4.1.4.7 0 .8-2.9.7-4.2 2.7-4.6 5.6-.1.4-.7.4-.8 0-.4-2.9-1.7-4.9-4.6-5.6-.4-.1-.4-.7 0-.8 2.9-.7 4.2-2.7 4.6-5.6.1-.4.7-.4.8 0Z"
        fill="currentColor"
      />
      <path
        d="M13.2 1.2c.15 1.1.65 1.85 1.75 2.1.2.05.2.35 0 .4-1.1.25-1.6 1-1.75 2.1-.05.2-.35.2-.4 0-.15-1.1-.65-1.85-1.75-2.1-.2-.05-.2-.35 0-.4 1.1-.25 1.6-1 1.75-2.1.05-.2.35-.2.4 0Z"
        fill="currentColor"
        opacity="0.55"
      />
    </svg>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable (http, permissions) — silently no-op */
    }
  };

  return (
    <button
      type="button"
      className="ask-agent-copy"
      data-copied={copied || undefined}
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy prompt"}
    >
      {copied ? (
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3 8.5 6.5 12 13 4.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect
            x="5.5"
            y="5.5"
            width="8"
            height="8"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M10.5 3.5v-.5A1.5 1.5 0 0 0 9 1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
      )}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

export function AskAgent({ prompts }) {
  return (
    <aside className="ask-agent" aria-label="Ask your agent">
      <div className="ask-agent-head">
        <span className="ask-agent-label">
          <SparkIcon />
          Ask your agent
        </span>
        <span className="ask-agent-hint">
          Skill not installed?{" "}
          <Link href="/getting-started/agent-quickstart">Agent Quickstart</Link>
        </span>
      </div>

      <ul className="ask-agent-list">
        {prompts.map((p, i) => (
          <li key={i} className="ask-agent-item">
            <div className="ask-agent-row">
              <span className="ask-agent-caret" aria-hidden="true">
                ❯
              </span>
              <div className="ask-agent-body">
                {p.intent ? (
                  <span className="ask-agent-intent">{p.intent}</span>
                ) : null}
                <p className="ask-agent-text">{renderPromptText(p.text)}</p>
              </div>
              <CopyButton text={p.text.replace(BLANK_RE, "$1")} />
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
