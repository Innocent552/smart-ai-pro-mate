import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Search, MessagesSquare, ArrowRight } from "lucide-react";
import { AppShell, DisclaimerBar } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AXON AI — Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate workplace tasks with AI: smart email drafts, research briefs, and a productivity chatbot.",
      },
      { property: "og:title", content: "AXON AI — Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Automate workplace tasks with AI: smart email drafts, research briefs, and a productivity chatbot.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

const TOOLS = [
  {
    to: "/email" as const,
    icon: Mail,
    name: "Smart Email Generator",
    desc: "Draft context-aware professional emails from a few key points.",
    tag: "Writing",
  },
  {
    to: "/research" as const,
    icon: Search,
    name: "AI Research Assistant",
    desc: "Turn any topic into a structured research brief with key findings.",
    tag: "Analysis",
  },
  {
    to: "/chat" as const,
    icon: MessagesSquare,
    name: "AI Chatbot",
    desc: "A productivity partner for planning, summarizing, and problem-solving.",
    tag: "Assistant",
  },
];

function DashboardPage() {
  return (
    <AppShell
      title="Productivity Dashboard"
      version="V2.4"
      headerActions={
        <Link
          to="/email"
          className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 shadow-sm transition-all"
        >
          New Draft
        </Link>
      }
    >
      <div className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <section className="space-y-1 animate-slide-in">
            <h2 className="text-2xl font-semibold tracking-tight">
              Good afternoon, Elias
            </h2>
            <p className="text-sm text-muted-foreground max-w-[56ch]">
              Choose a tool to automate your next workplace task. Every output
              is fully editable before you use it.
            </p>
          </section>

          <section className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Drafts generated", value: "128" },
              { label: "Research briefs", value: "34" },
              { label: "Chat sessions", value: "57" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="bg-card border border-border rounded-lg p-5 animate-slide-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <p className="font-mono-label">{stat.label}</p>
                <p className="text-3xl font-semibold tracking-tight mt-2">
                  {stat.value}
                </p>
              </div>
            ))}
          </section>

          <section className="space-y-3">
            {TOOLS.map((tool, i) => (
              <Link
                key={tool.to}
                to={tool.to}
                className="group flex items-center gap-4 bg-card border border-border rounded-lg p-5 hover:border-primary/40 hover:shadow-sm transition-all animate-slide-in"
                style={{ animationDelay: `${180 + i * 60}ms` }}
              >
                <div className="size-10 rounded-md bg-accent flex items-center justify-center shrink-0">
                  <tool.icon className="size-5 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{tool.name}</h3>
                    <span className="font-mono text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
                      {tool.tag}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {tool.desc}
                  </p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </section>

          <DisclaimerBar />
        </div>
      </div>
    </AppShell>
  );
}
