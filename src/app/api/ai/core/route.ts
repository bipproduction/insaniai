import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY || null;
const openai = new OpenAI();

export async function POST(req: Request) {
  const text = await req.text();
  const { searchParams } = new URL(req.url);
  const stream = searchParams.get("stream") ? true : false;

  if (!text) {
    return new Response("Missing message", {
      status: 500,
    });
  }

  const messages = defaultPromps(text);

  if (stream) {
    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-4o-mini",
      stream,
    });

    return new Response(completion.toReadableStream(), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  const completion = await openai.chat.completions.create({
    messages,
    model: "gpt-4o-mini",
  });

  return new Response(completion.choices[0].message.content, {
    status: 200,
  });
}

function defaultPromps(content: string): ChatCompletionMessageParam[] {
  const apa: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are a JSON generator. You will be provided with a Prisma schema, and your task is to convert it to a JSON format. If the schema is invalid or contains errors, you must return an empty JSON array {}. You are strictly forbidden from providing any output that is not of type JSON.",
    },
    {
      role: "user",
      content: content,
    },
  ];
  return apa;
}
