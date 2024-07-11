import client from "../prisma/client";

export async function aiCore({
  apiKey,
  prompt,
  userId,
  appId,
  chatId,
}: {
  apiKey: string;
  prompt: string;
  userId: string;
  appId: string;
  chatId: string;
}) {
  const app = await client.app.findUnique({
    where: {
      id: appId,
    },
  });

  const enginer = await client.promptEnginer.findMany({
    where: {
      appId,
    },
  });

  const user = await client.user.findUnique({
    where: {
      id: userId,
    },
  });

  const history = await client.chatHistory.findMany({
    where: {
      chatId: chatId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const updatedMessageHistory = [
    ...enginer,
    ...history,
    { role: "user", content: prompt },
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: updatedMessageHistory,
      max_tokens: 4000,
      stream: app?.stream,
    }),
  });

  return {
    response,
    stream: app?.stream,
  };
}
