import { streamHandler } from "./stream";

type Message = {
  role: string;
  content: string;
}[];

export async function completionCore({
  apiKey,
  messages,
  stream = false,
  onStreamUpdate,
}: {
  apiKey: string;
  messages: Message;
  stream?: boolean;
  onStreamUpdate?: (message: string) => void;
}) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 4000,
      stream,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate completion");
  }

  if (stream && onStreamUpdate) {
    return streamHandler(response, onStreamUpdate);
  }

  const jsonData = await response.json();
  const chatMessage = jsonData.choices[0].message.content;
  return chatMessage;
}
