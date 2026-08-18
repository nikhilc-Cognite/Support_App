/**
 * App-wide Ask AI open signal.
 * Nav, home, search, etc. can call openAskAI() to open the floating chat.
 */

export const ASK_AI_OPEN_EVENT = "cognite:ask-ai-open";

export type AskAIOpenDetail = {
  query?: string;
  /** Send immediately when a query is provided (default true) */
  submit?: boolean;
};

export function openAskAI(detail: AskAIOpenDetail = {}) {
  if (typeof window === "undefined") return;
  const query = detail.query?.trim() || undefined;
  window.dispatchEvent(
    new CustomEvent<AskAIOpenDetail>(ASK_AI_OPEN_EVENT, {
      detail: {
        query,
        submit: detail.submit ?? Boolean(query),
      },
    }),
  );
}
