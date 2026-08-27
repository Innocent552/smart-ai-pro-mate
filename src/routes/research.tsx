import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw, Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { AppShell, DisclaimerBar } from "@/components/AppShell";
import { researchQuery } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AXON AI" },
      {
        name: "description",
        content:
          "Turn any topic into a structured, editable research brief with key findings and caveats.",
      },
      { property: "og:title", content: "AI Research Assistant — AXON AI" },
      {
        property: "og:description",
        content:
          "Turn any topic into a structured, editable research brief with key findings and caveats.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchPage,
});

const DEPTHS = ["Quick Scan", "Standard Brief", "Deep Dive"];
const FOCUS_AREAS = ["Market Trends", "Competitors", "Risks", "Opportunities"];

function ResearchPage() {
  const runResearch = useServerFn(researchQuery);
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("Standard Brief");
  const [focus, setFocus] = useState<string[]>([]);
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function toggleFocus(f: string) {
    setFocus((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    );
  }

  async function handleGenerate() {
    if (!topic.trim()) {
      toast.error("Enter a research topic first.");
      return;
    }
    setLoading(true);
    try {
      const text = await runResearch({
        data: { topic, depth, focus: focus.join(", ") },
      });
      setOutput(text);
      setEditing(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Research failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <AppShell title="AI Research Assistant" version="V2.4">
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Input panel */}
        <section className="lg:w-md border-b lg:border-b-0 lg:border-r border-border p-4 sm:p-8 overflow-y-auto bg-card/30 shrink-0">
          <div className="space-y-6 animate-slide-in">
            <div>
              <label htmlFor="topic" className="block font-mono-label mb-2">
                Research Topic
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Remote work policies in fintech"
                className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div>
              <span className="block font-mono-label mb-2">Depth</span>
              <div className="grid grid-cols-1 gap-2">
                {DEPTHS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDepth(d)}
                    className={
                      depth === d
                        ? "px-3 py-2 text-xs font-medium border border-primary bg-primary/5 text-primary rounded-md text-left"
                        : "px-3 py-2 text-xs font-medium border border-border text-muted-foreground hover:border-foreground/30 rounded-md transition-all text-left"
                    }
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block font-mono-label mb-2">
                Focus Areas (Optional)
              </span>
              <div className="flex flex-wrap gap-2">
                {FOCUS_AREAS.map((f) => (
                  <button
                    key={f}
                    onClick={() => toggleFocus(f)}
                    className={
                      focus.includes(f)
                        ? "px-3 py-1.5 text-xs font-medium border border-primary bg-primary/5 text-primary rounded-full"
                        : "px-3 py-1.5 text-xs font-medium border border-border text-muted-foreground hover:border-foreground/30 rounded-full transition-all"
                    }
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-2.5 bg-foreground text-background text-sm font-semibold rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Researching…
                </>
              ) : (
                <>
                  Run Research
                  <span className="size-2 bg-primary rounded-full animate-pulse" />
                </>
              )}
            </button>
          </div>
        </section>

        {/* Output panel */}
        <section className="flex-1 bg-card p-4 sm:p-8 flex flex-col min-h-[420px]">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <div
                className={`size-2 rounded-full ${output ? "bg-success" : "bg-muted-foreground/40"}`}
              />
              <span className="font-mono-label">Research Brief</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing((v) => !v)}
                disabled={!output}
                className="p-2 hover:bg-accent rounded transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                <span className="text-xs font-medium">
                  {editing ? "Preview" : "Edit"}
                </span>
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                className="p-2 hover:bg-accent rounded transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50 flex items-center gap-1.5"
                title="Regenerate"
              >
                <RefreshCw
                  className={`size-3.5 ${loading ? "animate-spin" : ""}`}
                />
                <span className="text-xs font-medium">Rerun</span>
              </button>
              <button
                onClick={handleCopy}
                disabled={!output}
                className="p-2 hover:bg-accent rounded transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50 flex items-center gap-1.5"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="size-3.5" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                <span className="text-xs font-medium">
                  {copied ? "Copied" : "Copy"}
                </span>
              </button>
            </div>
          </div>

          <div className="flex-1 rounded-lg border border-border p-4 sm:p-8 overflow-y-auto focus-within:ring-1 focus-within:ring-primary/10 transition-shadow animate-slide-in [animation-delay:150ms]">
            {loading && !output ? (
              <div className="space-y-3">
                {[60, 100, 95, 90, 45, 100, 70].map((w, i) => (
                  <div
                    key={i}
                    className="h-3 rounded bg-muted animate-shimmer"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            ) : editing ? (
              <textarea
                spellCheck={false}
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                aria-label="Editable research brief (markdown)"
                className="w-full h-full min-h-64 outline-none resize-none bg-transparent leading-relaxed text-sm font-mono text-foreground"
              />
            ) : output ? (
              <div className="prose prose-sm max-w-none text-foreground [&_h1]:text-lg [&_h2]:text-base [&_h2]:mt-5 [&_p]:leading-relaxed [&_li]:leading-relaxed [&_strong]:font-semibold">
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-muted-foreground/40 leading-relaxed text-base">
                Your structured research brief will appear here, with an
                executive summary, numbered key findings, and caveats. Switch
                to Edit mode to refine the markdown directly.
              </p>
            )}
          </div>

          <div className="mt-4 sm:mt-6">
            <DisclaimerBar />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
