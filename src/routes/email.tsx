import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw, Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell, DisclaimerBar } from "@/components/AppShell";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AXON AI" },
      {
        name: "description",
        content:
          "Generate professional, context-aware email drafts from key points, with editable AI output.",
      },
      { property: "og:title", content: "Smart Email Generator — AXON AI" },
      {
        property: "og:description",
        content:
          "Generate professional, context-aware email drafts from key points, with editable AI output.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Professional", "Direct", "Empathetic", "Persuasive"];
const LENGTH_LABELS = ["Brief", "Concise", "Standard", "Detailed"];

function EmailPage() {
  const runGenerate = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState("Professional");
  const [keyPoints, setKeyPoints] = useState("");
  const [lengthIdx, setLengthIdx] = useState(1);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!keyPoints.trim()) {
      toast.error("Add at least one key point for the email.");
      return;
    }
    setLoading(true);
    try {
      const text = await runGenerate({
        data: {
          recipient,
          tone,
          keyPoints,
          length: LENGTH_LABELS[lengthIdx],
        },
      });
      setOutput(text);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Generation failed. Try again.",
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
    <AppShell
      title="Smart Email Generator"
      version="V2.4"
      headerActions={
        <button
          onClick={() => {
            setOutput("");
            setKeyPoints("");
            setRecipient("");
          }}
          className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 shadow-sm transition-all"
        >
          New Draft
        </button>
      }
    >
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Input panel */}
        <section className="lg:w-md border-b lg:border-b-0 lg:border-r border-border p-4 sm:p-8 overflow-y-auto bg-card/30 shrink-0">
          <div className="space-y-6 animate-slide-in">
            <div>
              <label
                htmlFor="recipient"
                className="block font-mono-label mb-2"
              >
                Recipient Context
              </label>
              <input
                id="recipient"
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. CEO of a Series A Fintech"
                className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div>
              <span className="block font-mono-label mb-2">Tone & Voice</span>
              <div className="grid grid-cols-2 gap-2">
                {TONES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={
                      tone === t
                        ? "px-3 py-2 text-xs font-medium border border-primary bg-primary/5 text-primary rounded-md"
                        : "px-3 py-2 text-xs font-medium border border-border text-muted-foreground hover:border-foreground/30 rounded-md transition-all"
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="key-points"
                className="block font-mono-label mb-2"
              >
                Key Points (Bulleted)
              </label>
              <textarea
                id="key-points"
                rows={4}
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder={
                  "- Meeting request for Tuesday\n- Q4 performance update\n- Proposed new strategy"
                }
                className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
            </div>

            <div>
              <span className="block font-mono-label mb-2">Target Length</span>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={3}
                  value={lengthIdx}
                  onChange={(e) => setLengthIdx(Number(e.target.value))}
                  aria-label="Target length"
                  className="flex-1 accent-primary"
                />
                <span className="text-xs font-mono text-muted-foreground w-16 text-right">
                  {LENGTH_LABELS[lengthIdx]}
                </span>
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
                  Generating…
                </>
              ) : (
                <>
                  Generate Draft
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
              <span className="font-mono-label">AI Generated Preview</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerate}
                disabled={loading || !keyPoints.trim()}
                className="p-2 hover:bg-accent rounded transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50 flex items-center gap-1.5"
                title="Regenerate"
              >
                <RefreshCw
                  className={`size-3.5 ${loading ? "animate-spin" : ""}`}
                />
                <span className="text-xs font-medium">Regenerate</span>
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
                  {copied ? "Copied" : "Copy Text"}
                </span>
              </button>
            </div>
          </div>

          <div className="flex-1 rounded-lg border border-border p-4 sm:p-8 focus-within:ring-1 focus-within:ring-primary/10 transition-shadow animate-slide-in [animation-delay:150ms] flex flex-col">
            {loading && !output ? (
              <div className="space-y-3 flex-1">
                {[80, 100, 95, 60, 90, 40].map((w, i) => (
                  <div
                    key={i}
                    className="h-3 rounded bg-muted animate-shimmer"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            ) : (
              <textarea
                spellCheck={false}
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                placeholder="Your AI-generated draft will appear here. You can edit it freely before copying."
                aria-label="Editable AI email output"
                className="w-full flex-1 outline-none resize-none bg-transparent placeholder:text-muted-foreground/40 leading-relaxed text-base text-foreground"
              />
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
