import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  Search,
  MessagesSquare,
  Menu,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import avatarImg from "@/assets/avatar.jpg";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/email", label: "Email Generator", icon: Mail, exact: false },
  { to: "/research", label: "Research Assistant", icon: Search, exact: false },
  { to: "/chat", label: "Chatbot", icon: MessagesSquare, exact: false },
] as const;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="p-6 flex items-center gap-2.5">
        <div className="size-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold">
          A
        </div>
        <span className="font-semibold tracking-tight">AXON AI</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <div className="py-2">
          <p className="px-2 font-mono-label mb-2">Workspaces</p>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              activeOptions={{ exact: item.exact }}
              activeProps={{
                className:
                  "bg-accent text-sidebar-foreground",
              }}
              inactiveProps={{
                className:
                  "text-muted-foreground hover:text-sidebar-foreground hover:bg-accent",
              }}
              className="flex items-center gap-3 px-2 py-1.5 text-sm font-medium rounded-md transition-colors"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-2">
          <img
            src={avatarImg}
            alt="Elias Thorne"
            width={512}
            height={512}
            loading="lazy"
            className="size-8 rounded-full object-cover shrink-0"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-medium truncate">Elias Thorne</p>
            <p className="text-[10px] text-muted-foreground truncate">
              Pro Account
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export function AppShell({
  title,
  version,
  headerActions,
  children,
}: {
  title: string;
  version?: string;
  headerActions?: ReactNode;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-screen w-full bg-background text-foreground antialiased overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-border bg-sidebar flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/30"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-border flex flex-col">
            <button
              className="absolute right-3 top-6 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-8 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
            {version && (
              <span className="hidden sm:inline px-2 py-0.5 rounded border border-border font-mono text-[10px] text-muted-foreground">
                {version}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">{headerActions}</div>
        </header>
        {children}
      </main>
    </div>
  );
}

export function DisclaimerBar() {
  return (
    <div className="p-3 rounded-md bg-muted border border-border flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <div className="size-4 shrink-0 flex items-center justify-center border border-muted-foreground/30 rounded-full text-[8px] font-bold text-muted-foreground">
          i
        </div>
        <span className="text-[11px] text-muted-foreground">
          AI-generated content may require factual verification. Please review
          for accuracy before using it in critical communications.
        </span>
      </div>
      <span className="hidden sm:inline font-mono text-[10px] text-muted-foreground shrink-0">
        LLM: GEMINI-3.7-FLASH
      </span>
    </div>
  );
}
