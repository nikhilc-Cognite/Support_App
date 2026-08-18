import { AskAIChat } from "@/components/ask-ai/AskAIChat";

export const metadata = { title: "Ask AI — Cognite Support" };

export default async function AskAIPage({ searchParams }: PageProps<"/ask-ai">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl flex-col px-4 sm:px-6 lg:px-8">
      <AskAIChat initialQuery={q} />
    </div>
  );
}
