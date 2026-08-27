import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL_ID = "google/gemini-3.7-flash";

async function runPrompt(system: string, prompt: string): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const gateway = createLovableAiGatewayProvider(key);
  const { text } = await generateText({
    model: gateway(MODEL_ID),
    system,
    prompt,
  });
  return text;
}

export async function generateEmailDraft(input: {
  recipient: string;
  tone: string;
  keyPoints: string;
  length: string;
}): Promise<string> {
  const system =
    "You are a professional workplace email writing assistant. Output only the email itself: start with a 'Subject:' line, then a blank line, then the email body. No commentary, no markdown formatting, no sign-off placeholders like [Your Name] unless the user gave no sender name — use a neutral closing like 'Best regards,' with no fabricated name. Keep it natural and ready to send.";
  const prompt = [
    `Write a ${input.tone.toLowerCase()} email to: ${input.recipient || "a colleague"}.`,
    `Target length: ${input.length}.`,
    `Key points to cover:\n${input.keyPoints}`,
  ].join("\n");
  return runPrompt(system, prompt);
}

export async function runResearchQuery(input: {
  topic: string;
  depth: string;
  focus: string;
}): Promise<string> {
  const system =
    "You are an AI research assistant for workplace professionals. Produce a structured research brief in markdown: a one-paragraph executive summary, then 3-5 numbered key findings with short explanations, then a 'Considerations & Caveats' section noting uncertainty and where the user should verify facts. Be concrete, current, and clear about what is inference vs. established fact.";
  const prompt = [
    `Research topic: ${input.topic}`,
    `Depth: ${input.depth}.`,
    input.focus ? `Specific focus areas: ${input.focus}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return runPrompt(system, prompt);
}

export async function runChatReply(input: {
  message: string;
  history: { role: "user" | "assistant"; content: string }[];
}): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const gateway = createLovableAiGatewayProvider(key);
  const { text } = await generateText({
    model: gateway(MODEL_ID),
    system:
      "You are an AI workplace productivity assistant. Help professionals with task automation ideas, drafting text, summarizing, planning, and workplace problem-solving. Answer in concise markdown. Be practical and specific. When you generate content, remind the user briefly to verify important facts.",
    messages: [...input.history, { role: "user", content: input.message }],
  });
  return text;
}
