import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateEmailDraft, runChatReply, runResearchQuery } from "./ai.server";

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        recipient: z.string(),
        tone: z.string(),
        keyPoints: z.string().min(1, "Add at least one key point"),
        length: z.string(),
      })
      .parse(input),
  )
  .handler(({ data }) => generateEmailDraft(data));

export const researchQuery = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        topic: z.string().min(1, "Enter a research topic"),
        depth: z.string(),
        focus: z.string(),
      })
      .parse(input),
  )
  .handler(({ data }) => runResearchQuery(data));

export const chatReply = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        message: z.string().min(1),
        history: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          }),
        ),
      })
      .parse(input),
  )
  .handler(({ data }) => runChatReply(data));
