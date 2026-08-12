"use client";

import { useState } from "react";
import Link from "next/link";
import { Ticket, TicketMessage } from "@/lib/types";
import { TicketStatusPill, PriorityPill } from "@/components/ui/StatusPill";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { Avatar } from "@/components/ui/Avatar";
import { formatDateTime, relativeTime, cn } from "@/lib/utils";
import { knowledgeArticles } from "@/lib/mock-data/knowledge";
import { tickets as allTickets } from "@/lib/mock-data/tickets";
import { getOrGenerateRecap, buildArticleFromTicket } from "@/lib/resolution-intelligence";
import { KnowledgeArticle } from "@/lib/types";
import {
  Paperclip,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Send,
  ThumbsUp,
  ThumbsDown,
  Clock,
  User,
  Headset,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";

let idCounter = 1000;

export function TicketDetailClient({ ticket: initial }: { ticket: Ticket }) {
  const [ticket, setTicket] = useState(initial);
  const [reply, setReply] = useState("");
  const [csatGiven, setCsatGiven] = useState<"up" | "down" | null>(null);
  const [viewMode, setViewMode] = useState<"customer" | "support">("customer");
  const [promotedArticle, setPromotedArticle] = useState<KnowledgeArticle | null>(null);

  function appendMessage(body: string, author: TicketMessage["author"]) {
    idCounter += 1;
    const msg: TicketMessage = { id: `local-${idCounter}`, author, body, createdAt: new Date().toISOString() };
    setTicket((t) => ({ ...t, messages: [...t.messages, msg], updatedAt: msg.createdAt }));
  }

  function submitReply() {
    if (!reply.trim()) return;
    appendMessage(reply.trim(), { name: "You", role: "customer", avatarInitials: "DO" });
    setReply("");
  }

  function confirmResolved() {
    setTicket((t) => ({ ...t, status: "resolved" }));
    appendMessage("Confirmed — this is resolved on my end. Thanks for the help!", { name: "You", role: "customer", avatarInitials: "DO" });
  }

  function stillExists() {
    setTicket((t) => ({ ...t, status: "investigating" }));
    appendMessage("This is still happening — the issue isn't fixed yet. Reopening.", { name: "You", role: "customer", avatarInitials: "DO" });
  }

  function promoteToKnowledgeBase() {
    const recap = getOrGenerateRecap(ticket);
    const article = buildArticleFromTicket(ticket, recap);
    setPromotedArticle(article);
    setTicket((t) => ({ ...t, promotedToArticleSlug: article.slug }));
  }

  const isResolved = ticket.status === "resolved" || ticket.status === "closed";
  const recap = isResolved ? getOrGenerateRecap(ticket) : null;
  const relatedArticles = knowledgeArticles.filter((a) => ticket.tags.some((tag) => a.title.toLowerCase().includes(tag) || a.category.toLowerCase().includes(tag))).slice(0, 2);
  const similarTickets = allTickets.filter((t) => t.id !== ticket.id && t.product.id === ticket.product.id).slice(0, 2);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs text-neutral-400">#{ticket.id}</p>
            <h1 className="mt-1 text-xl font-semibold text-neutral-900 sm:text-2xl">{ticket.subject}</h1>
          </div>
          <div className="flex items-center gap-2">
            <PriorityPill priority={ticket.priority} />
            <TicketStatusPill status={ticket.status} />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-neutral-500">
            <span>{ticket.product.name}</span>
            <span>Assigned to {ticket.assignedTeam}</span>
            <span>Opened {formatDateTime(ticket.createdAt)}</span>
          </div>

          {/* Demo affordance: lets this one page show both sides of Resolution
              Intelligence. A real deployment would derive this from the
              logged-in user's role, not a visible toggle. */}
          <div className="flex items-center rounded-lg border border-neutral-200 p-0.5 text-xs font-medium">
            <button
              onClick={() => setViewMode("customer")}
              className={cn("flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-colors", viewMode === "customer" ? "bg-accent-600 text-white" : "text-neutral-500 hover:text-neutral-800")}
            >
              <User className="h-3 w-3" /> Customer view
            </button>
            <button
              onClick={() => setViewMode("support")}
              className={cn("flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-colors", viewMode === "support" ? "bg-accent-600 text-white" : "text-neutral-500 hover:text-neutral-800")}
            >
              <Headset className="h-3 w-3" /> Support view
            </button>
          </div>
        </div>

        {/* Confirmation workflow — the key customer-facing moment */}
        {ticket.status === "solution_provided" && (
          <Card className="mt-6 border-accent-200 bg-accent-50 dark:border-accent-800 dark:bg-accent-900/30">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-accent-900 dark:text-accent-200">We&apos;ve provided a solution — please confirm</p>
                <p className="mt-1 text-sm text-accent-800 dark:text-accent-300">
                  Take a look at the latest reply below. Did it resolve your issue?
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" onClick={confirmResolved} icon={<CheckCircle2 className="h-4 w-4" />}>
                    Confirm Resolved
                  </Button>
                  <Button size="sm" variant="secondary" onClick={stillExists} icon={<AlertCircle className="h-4 w-4" />}>
                    Issue Still Exists
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {isResolved && (
          <Card className="mt-6 border-success-50 bg-success-50 dark:border-success-900 dark:bg-success-900/30">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-success-500" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-success-700 dark:text-success-300">
                  {ticket.status === "resolved" ? "Marked resolved" : "This ticket is closed"}
                </p>
                {!ticket.csatSubmitted && !csatGiven ? (
                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-xs text-neutral-600">How was your support experience?</p>
                    <button onClick={() => setCsatGiven("up")} className="rounded-md border border-neutral-300 bg-neutral-0 p-1.5 hover:bg-neutral-50">
                      <ThumbsUp className="h-3.5 w-3.5 text-neutral-500" />
                    </button>
                    <button onClick={() => setCsatGiven("down")} className="rounded-md border border-neutral-300 bg-neutral-0 p-1.5 hover:bg-neutral-50">
                      <ThumbsDown className="h-3.5 w-3.5 text-neutral-500" />
                    </button>
                  </div>
                ) : (
                  <p className="mt-1 text-xs text-neutral-500">Thanks for your feedback.</p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Resolution Intelligence — auto-generated recap, shared by both views */}
        {isResolved && recap && (
          <Card className="mt-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent-600" />
              <p className="text-sm font-semibold text-neutral-900">
                {viewMode === "customer" ? "Resolution summary" : "Resolution Intelligence"}
              </p>
              <Badge tone="accent">Auto-generated</Badge>
            </div>
            {viewMode === "customer" && (
              <p className="mt-1 text-xs text-neutral-500">A plain-language recap for your records — generated from this conversation.</p>
            )}
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">What happened</dt>
                <dd className="mt-1 text-neutral-700">{recap.whatHappened}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Why it happened</dt>
                <dd className="mt-1 text-neutral-700">{recap.whyItHappened}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">What fixed it</dt>
                <dd className="mt-1 text-neutral-700">{recap.whatFixedIt}</dd>
              </div>
            </dl>

            {viewMode === "support" && (
              <div className="mt-4 border-t border-neutral-100 pt-4">
                {!promotedArticle ? (
                  <>
                    <p className="text-xs text-neutral-500">
                      Publishing this saves the next customer who hits the same issue a ticket entirely — Ask AI and search will start citing it immediately.
                    </p>
                    <Button size="sm" className="mt-2.5" onClick={promoteToKnowledgeBase} icon={<BookOpen className="h-3.5 w-3.5" />}>
                      Promote to Knowledge Base
                    </Button>
                  </>
                ) : (
                  <div className="rounded-lg border border-accent-100 bg-accent-50 p-3.5 dark:border-accent-800 dark:bg-accent-900/30">
                    <div className="flex items-center gap-2">
                      <Badge tone="accent">Draft published</Badge>
                      <span className="text-xs text-neutral-500">Resolved this exact issue 1 time so far</span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-neutral-900">{promotedArticle.title}</p>
                    <p className="mt-1 text-sm text-neutral-600">{promotedArticle.summary}</p>
                    <p className="mt-2.5 flex items-center gap-1 text-xs font-medium text-accent-700 dark:text-accent-300">
                      Live in Knowledge Base search and Ask AI citations <ArrowUpRight className="h-3 w-3" />
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Conversation */}
        <div className="mt-8 space-y-5">
          {ticket.messages.map((m) => (
            <div key={m.id} className="flex gap-3">
              <Avatar initials={m.author.avatarInitials} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-neutral-900">{m.author.name}</p>
                  {m.author.role === "agent" && <Badge tone="neutral">{m.author.team}</Badge>}
                  {m.author.role === "ai" && <Badge tone="accent"><Sparkles className="mr-1 h-3 w-3" />AI</Badge>}
                  <span className="text-xs text-neutral-400">{relativeTime(m.createdAt)}</span>
                </div>
                <div
                  className={cn(
                    "mt-1.5 whitespace-pre-line rounded-lg px-4 py-3 text-sm leading-relaxed",
                    m.author.role === "customer" ? "bg-accent-50 text-neutral-800 dark:bg-accent-900/30 dark:text-neutral-100" : "bg-neutral-100 text-neutral-800",
                  )}
                >
                  {m.body}
                </div>
                {m.attachments && m.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.attachments.map((a) => (
                      <span key={a.id} className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-0 px-2.5 py-1.5 text-xs text-neutral-600">
                        <Paperclip className="h-3 w-3 text-neutral-400" />
                        {a.fileName} <span className="text-neutral-400">({a.sizeKb} KB)</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Reply box */}
        {ticket.status !== "closed" && (
          <div className="mt-6 rounded-lg border border-neutral-200 bg-neutral-0 p-4">
            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Add a reply…"
              className="min-h-20"
            />
            <div className="mt-3 flex items-center justify-between">
              <button className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-700">
                <Paperclip className="h-3.5 w-3.5" /> Attach file
              </button>
              <Button size="sm" onClick={submitReply} disabled={!reply.trim()} icon={<Send className="h-3.5 w-3.5" />}>
                Send reply
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="space-y-5">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Status</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-neutral-700">
            <Clock className="h-4 w-4 text-neutral-400" />
            {ticket.nextExpectedAction}
          </div>
          {ticket.sla.resolutionDueAt && (
            <p className={cn("mt-3 text-xs", ticket.sla.atRisk ? "font-medium text-danger-600" : "text-neutral-500")}>
              {ticket.sla.atRisk ? "SLA at risk — " : "Target resolution: "}
              {formatDateTime(ticket.sla.resolutionDueAt)}
            </p>
          )}
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Details</p>
          <dl className="mt-2 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-neutral-500">Product</dt>
              <dd className="font-medium text-neutral-800">{ticket.product.name}</dd>
            </div>
            {ticket.environment && (
              <div className="flex justify-between">
                <dt className="text-neutral-500">Environment</dt>
                <dd className="font-medium text-neutral-800">{ticket.environment}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-neutral-500">Organization</dt>
              <dd className="font-medium text-neutral-800">{ticket.organization}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Requester</dt>
              <dd className="font-medium text-neutral-800">{ticket.requester.name}</dd>
            </div>
          </dl>
        </Card>

        {relatedArticles.length > 0 && (
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Related articles</p>
            <ul className="mt-2 space-y-2">
              {relatedArticles.map((a) => (
                <li key={a.slug}>
                  <Link href={`/knowledge/article/${a.slug}`} className="text-sm font-medium text-accent-600 hover:text-accent-700">
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {similarTickets.length > 0 && (
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Similar tickets</p>
            <ul className="mt-2 space-y-2">
              {similarTickets.map((t) => (
                <li key={t.id}>
                  <Link href={`/tickets/${t.id}`} className="text-sm text-neutral-700 hover:text-accent-600">
                    #{t.id} — {t.subject}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </aside>
    </div>
  );
}
