"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Paperclip,
  X,
  ThumbsUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { ProgressSteps } from "@/components/ui/ProgressSteps";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Label, Input, Textarea, Select, HelperText } from "@/components/ui/Field";
import { ArticleCard } from "@/components/knowledge/ArticleCard";
import { knowledgeArticles } from "@/lib/mock-data/knowledge";
import { tickets } from "@/lib/mock-data/tickets";
import { currentUser } from "@/lib/mock-data/account";
import { readHandoff, clearHandoff } from "@/lib/ai-handoff";
import {
  categoryOptions,
  productsByCategory,
  urgencyOptions,
  impactOptions,
  TicketCategory,
} from "@/lib/mock-data/ticket-taxonomy";
import { cn } from "@/lib/utils";

const steps = ["Details", "Suggestions", "Review"];

export function CreateTicketWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [requesterEmail, setRequesterEmail] = useState(currentUser.email);
  const [ccEmail, setCcEmail] = useState("");
  const [category, setCategory] = useState<TicketCategory>("product_platform");
  const [productId, setProductId] = useState<string>("");
  const [subProduct, setSubProduct] = useState<string>("");
  const [projectName, setProjectName] = useState("");
  const [clusterName, setClusterName] = useState("");
  const [environment, setEnvironment] = useState("Production");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<(typeof urgencyOptions)[number]>("Normal");
  const [impact, setImpact] = useState<(typeof impactOptions)[number]>("Moderate / Limited");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [fromAI, setFromAI] = useState(false);

  // sessionStorage is browser-only; hydrating from it here (rather than
  // during render) avoids a server/client mismatch, since it's always
  // empty during SSR.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const handoff = readHandoff();
    if (handoff) {
      setSubject(handoff.suggestedSubject);
      setDescription(handoff.suggestedDescription);
      setFromAI(true);
      clearHandoff();
    }
  }, []);

  const availableProducts = productsByCategory[category];
  const selectedProduct = availableProducts.find((p) => p.id === productId);

  function selectCategory(next: TicketCategory) {
    setCategory(next);
    setProductId("");
    setSubProduct("");
  }

  function selectProduct(nextId: string) {
    setProductId(nextId);
    setSubProduct("");
  }

  const suggestedArticles = useMemo(() => {
    if (!description) return [];
    const words = description.toLowerCase().split(/\W+/).filter((w) => w.length > 4);
    return knowledgeArticles
      .filter((a) => words.some((w) => a.title.toLowerCase().includes(w) || a.body.toLowerCase().includes(w)))
      .slice(0, 3);
  }, [description]);

  const possibleDuplicates = useMemo(() => {
    if (!subject) return [];
    const words = subject.toLowerCase().split(/\W+/).filter((w) => w.length > 4);
    return tickets
      .filter((t) => ["submitted", "investigating", "waiting_on_customer", "solution_provided"].includes(t.status))
      .filter((t) => words.some((w) => t.subject.toLowerCase().includes(w)))
      .slice(0, 2);
  }, [subject]);

  const detailsValid =
    requesterEmail.trim() &&
    productId &&
    (selectedProduct?.subProducts.length === 0 || subProduct) &&
    subject.trim() &&
    description.trim();

  function next() {
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function submit() {
    const id = String(48300 + Math.floor(Math.random() * 600));
    const params = new URLSearchParams({ id, subject, urgency });
    router.push(`/tickets/new/confirmation?${params.toString()}`);
  }

  return (
    <div>
      <ProgressSteps steps={steps} currentIndex={step} />

      {fromAI && step === 0 && (
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-accent-100 bg-accent-50 px-4 py-2.5 text-sm text-accent-900 dark:border-accent-800 dark:bg-accent-900/30 dark:text-accent-200">
          <Sparkles className="h-4 w-4 shrink-0 text-accent-600" />
          Carried over your Ask AI conversation — subject and description are pre-filled below.
        </div>
      )}

      <div className="mt-8">
        {step === 0 && (
          <div className="space-y-8">
            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Contact information</p>
              <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="requesterEmail" required>Requester email</Label>
                  <Input id="requesterEmail" type="email" value={requesterEmail} onChange={(e) => setRequesterEmail(e.target.value)} placeholder="you@company.com" />
                </div>
                <div>
                  <Label htmlFor="ccEmail" hint="optional">CC email</Label>
                  <Input id="ccEmail" type="email" value={ccEmail} onChange={(e) => setCcEmail(e.target.value)} placeholder="teammate@company.com" />
                  <HelperText>Separate multiple addresses with a comma.</HelperText>
                </div>
              </div>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Category &amp; product</p>
              <div className="mt-3">
                <Label required>Category</Label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {categoryOptions.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => selectCategory(c.id)}
                      className={cn(
                        "rounded-lg border p-4 text-left transition-colors",
                        category === c.id ? "border-accent-500 bg-accent-50 dark:bg-accent-900/30" : "border-neutral-200 hover:border-neutral-300",
                      )}
                    >
                      <span className="text-sm font-medium text-neutral-900">{c.label}</span>
                      <p className="mt-0.5 text-xs text-neutral-500">{c.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="product" required>Product</Label>
                  <Select id="product" value={productId} onChange={(e) => selectProduct(e.target.value)}>
                    <option value="">Select a product</option>
                    {availableProducts.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </Select>
                </div>
                {selectedProduct && selectedProduct.subProducts.length > 0 && (
                  <div>
                    <Label htmlFor="subProduct" required>Sub-product</Label>
                    <Select id="subProduct" value={subProduct} onChange={(e) => setSubProduct(e.target.value)}>
                      <option value="">Select a sub-product</option>
                      {selectedProduct.subProducts.map((sp) => (
                        <option key={sp} value={sp}>{sp}</option>
                      ))}
                    </Select>
                  </div>
                )}
              </div>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Environment details</p>
              <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div>
                  <Label htmlFor="projectName" hint="optional">Project name</Label>
                  <Input id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g. checkout-service" />
                </div>
                <div>
                  <Label htmlFor="clusterName" hint="optional">Cluster name</Label>
                  <Input id="clusterName" value={clusterName} onChange={(e) => setClusterName(e.target.value)} placeholder="e.g. us-east-1-prod" />
                </div>
                <div>
                  <Label htmlFor="env">Environment</Label>
                  <Select id="env" value={environment} onChange={(e) => setEnvironment(e.target.value)}>
                    <option>Production</option>
                    <option>Staging</option>
                    <option>Development</option>
                  </Select>
                </div>
              </div>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Describe the issue</p>
              <div className="mt-3 space-y-5">
                <div>
                  <Label htmlFor="subject" required>Subject</Label>
                  <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Short summary of the issue" />
                </div>
                <div>
                  <Label htmlFor="description" required hint={`${description.length}/1200`}>Description</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value.slice(0, 1200))} placeholder="What happened? Include any error messages you saw." className="min-h-32" />
                </div>

                {possibleDuplicates.length > 0 && (
                  <Card className="border-warning-50 bg-warning-50 dark:border-warning-900 dark:bg-warning-900/30">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-500" />
                      <div>
                        <p className="text-sm font-medium text-warning-700 dark:text-warning-300">This looks similar to a ticket you already have open</p>
                        <ul className="mt-1.5 space-y-1">
                          {possibleDuplicates.map((t) => (
                            <li key={t.id} className="text-sm text-neutral-700">
                              <a href={`/tickets/${t.id}`} className="font-medium text-accent-600 hover:text-accent-700">#{t.id} — {t.subject}</a>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-1.5 text-xs text-neutral-600">You can still continue if this is a different issue.</p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Classification</p>
              <div className="mt-3 space-y-5">
                <div>
                  <Label required>Urgency</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {urgencyOptions.map((u) => (
                      <button
                        key={u}
                        onClick={() => setUrgency(u)}
                        className={cn(
                          "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                          urgency === u ? "border-accent-500 bg-accent-50 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300" : "border-neutral-200 text-neutral-600 hover:border-neutral-300",
                        )}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                  {urgency === "Urgent" && (
                    <HelperText>Urgent routes directly to on-call — you&apos;ll be contacted within the tightest SLA window.</HelperText>
                  )}
                </div>
                <div>
                  <Label required>Impact</Label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {impactOptions.map((i) => (
                      <button
                        key={i}
                        onClick={() => setImpact(i)}
                        className={cn(
                          "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                          impact === i ? "border-accent-500 bg-accent-50 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300" : "border-neutral-200 text-neutral-600 hover:border-neutral-300",
                        )}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Attachments</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {attachments.map((f) => (
                  <span key={f} className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-0 px-2.5 py-1.5 text-xs text-neutral-600">
                    <Paperclip className="h-3 w-3 text-neutral-400" />
                    {f}
                    <button onClick={() => setAttachments((a) => a.filter((x) => x !== f))} aria-label={`Remove ${f}`}>
                      <X className="h-3 w-3 text-neutral-400 hover:text-neutral-600" />
                    </button>
                  </span>
                ))}
              </div>
              <button
                onClick={() => setAttachments((a) => [...a, `screenshot-${a.length + 1}.png`])}
                className="mt-2 flex items-center gap-1.5 rounded-lg border border-dashed border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-500 hover:border-accent-400 hover:text-accent-600"
              >
                <Paperclip className="h-3.5 w-3.5" /> Attach a file, log, or screenshot
              </button>
            </section>

            <div className="flex justify-end">
              <Button onClick={next} disabled={!detailsValid}>Continue</Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            {suggestedArticles.length > 0 ? (
              <>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Sparkles className="h-4 w-4 text-accent-600" />
                  Based on your description, these might already solve it:
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {suggestedArticles.map((a) => (
                    <ArticleCard key={a.slug} article={a} />
                  ))}
                </div>
                <Card className="flex items-center justify-between gap-4 bg-neutral-50">
                  <div className="flex items-center gap-2.5">
                    <ThumbsUp className="h-4 w-4 text-neutral-400" />
                    <p className="text-sm text-neutral-700">Did one of these solve it?</p>
                  </div>
                  <Button href="/knowledge" variant="secondary" size="sm">Yes, I&apos;m all set</Button>
                </Card>
              </>
            ) : (
              <p className="text-sm text-neutral-500">No obvious matches in our Knowledge Base for this — let&apos;s get this to the right team.</p>
            )}
            <div className="flex justify-between">
              <Button variant="ghost" onClick={back}>Back</Button>
              <Button onClick={next}>None of these helped, continue</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <Card>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-neutral-100 pb-3">
                  <dt className="text-neutral-500">Requester email</dt>
                  <dd className="font-medium text-neutral-900">{requesterEmail}</dd>
                </div>
                {ccEmail && (
                  <div className="flex justify-between border-b border-neutral-100 pb-3">
                    <dt className="text-neutral-500">CC</dt>
                    <dd className="max-w-xs truncate text-right font-medium text-neutral-900">{ccEmail}</dd>
                  </div>
                )}
                <div className="flex justify-between border-b border-neutral-100 pb-3">
                  <dt className="text-neutral-500">Category</dt>
                  <dd className="font-medium text-neutral-900">{categoryOptions.find((c) => c.id === category)?.label}</dd>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-3">
                  <dt className="text-neutral-500">Product</dt>
                  <dd className="font-medium text-neutral-900">{selectedProduct?.name}</dd>
                </div>
                {subProduct && (
                  <div className="flex justify-between border-b border-neutral-100 pb-3">
                    <dt className="text-neutral-500">Sub-product</dt>
                    <dd className="font-medium text-neutral-900">{subProduct}</dd>
                  </div>
                )}
                {projectName && (
                  <div className="flex justify-between border-b border-neutral-100 pb-3">
                    <dt className="text-neutral-500">Project name</dt>
                    <dd className="font-medium text-neutral-900">{projectName}</dd>
                  </div>
                )}
                {clusterName && (
                  <div className="flex justify-between border-b border-neutral-100 pb-3">
                    <dt className="text-neutral-500">Cluster name</dt>
                    <dd className="font-medium text-neutral-900">{clusterName}</dd>
                  </div>
                )}
                <div className="flex justify-between border-b border-neutral-100 pb-3">
                  <dt className="text-neutral-500">Environment</dt>
                  <dd className="font-medium text-neutral-900">{environment}</dd>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-3">
                  <dt className="text-neutral-500">Subject</dt>
                  <dd className="max-w-xs truncate text-right font-medium text-neutral-900">{subject}</dd>
                </div>
                <div className="border-b border-neutral-100 pb-3">
                  <dt className="mb-1 text-neutral-500">Description</dt>
                  <dd className="whitespace-pre-line text-neutral-700">{description}</dd>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-3">
                  <dt className="text-neutral-500">Urgency</dt>
                  <dd className="font-medium text-neutral-900">{urgency}</dd>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-3">
                  <dt className="text-neutral-500">Impact</dt>
                  <dd className="font-medium text-neutral-900">{impact}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Attachments</dt>
                  <dd className="font-medium text-neutral-900">{attachments.length > 0 ? attachments.join(", ") : "None"}</dd>
                </div>
              </dl>
            </Card>
            <div className="flex items-start gap-2 text-xs text-neutral-500">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-400" />
              This will be routed to the right Cognite support team based on product, urgency, and impact. You&apos;ll get a confirmation and can track it under My Tickets.
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={back}>Back</Button>
              <Button onClick={submit}>Submit ticket</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
