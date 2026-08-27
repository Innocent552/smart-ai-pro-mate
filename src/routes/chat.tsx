import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { AppShell, DisclaimerBar } from "@/components/AppShell";
import { chatReply } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — AXON AI" },
      {
        name: "description",
        content:
          "Chat with an AI workplace productivity assistant for planning, drafting, and problem-solving.",
      },
      { property: "og:title", content: "AI Chatbot — AXON AI" },
      {
        property: "og:description",
        content:
          "Chat with an AI workplace productivity assistant for planning, drafting, and problem-solving.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

const STARTER: Message = {
  role: "assistant",
  content:
    "How can I assist your workflow today? I can help draft content, summarize documents, plan your week, or brainstorm solutions.",
};

const SUGGESTIONS = [
  "Draft a summary of this week's priorities",
  "Help me prepare for a performance review",
  "Brainstorm ideas for a team retrospective",
];

function ChatPage() {
  const runChat = useServerFn(chatReply);
  const [messages, setMessages] = useState<Message[]>([STARTER]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function handleSend(text?: string) {
    const message = (text ?? input).trim();
    if (!message || loading) return;
    setInput("");
    const next = [...messages, { role: "user" as const, content: message }];
    setMessages(next);
    setLoading(true);
    try {
      const reply = await runChat({
        data: {
          message,
          history: next.slice(-20).map(({ role, content }) => ({
            role,
            content,
          })),
        },
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant" as const, content: reply },
      ]);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "The assistant failed to reply.",
      );
      setMessages((prev) => prev.slice(0, -1));
      setInput(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell title="AI Chatbot" version="V2.4">
      <div className="flex-1 flex flex-col overflow-hidden bg-card/30">
        <div className="flex-1 overflow-y-auto" ref={scrollRef}>
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 space-y-4">
            <div className="flex items-center gap-2 justify-center py-2">
              <div className="size-2 rounded-full bg-success" />
              <span className="font-mono-label">AI Strategy Partner</span>
            </div>

            {messages.map((m, i) =>
              m.role === "assistant" ? (
                <div key={i} className="flex justify-start animate-slide-in">
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-none max-w-[85%] text-sm text-foreground leading-relaxed prose prose-sm max-w-none [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-end animate-slide-in">
                  <div className="bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl rounded-br-none max-w-[85%] text-sm leading-relaxed">
                    {m.content}
                  </div>
                </div>
              ),
            )}

            {loading && (
              <div className="flex justify-start animate-slide-in">
                <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1.5">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="size-1.5 rounded-full bg-muted-foreground/60 animate-shimmer"
                      style={{ animationDelay: `${d * 200}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {messages.length === 1 && (
              <div className="flex flex-wrap justify-center gap-2 pt-4 animate-slide-in [animation-delay:200ms]">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="px-3 py-1.5 text-xs font-medium border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground rounded-full transition-all bg-card"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-4 space-y-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-end gap-2"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={1}
                placeholder="Ask about tasks, drafts, plans…"
                aria-label="Chat message"
                className="flex-1 px-3 py-2.5 bg-card border border-border rounded-md text-sm outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="size-10 bg-foreground text-background rounded-md hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50 shrink-0"
                aria-label="Send message"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </button>
            </form>
            <DisclaimerBar />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
