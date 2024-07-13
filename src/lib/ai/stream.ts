export async function streamHandler(
  response: Response,
  onStreamUpdate: (message: string) => void
) {
  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let done = false;
  let chatMessage = "";

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((line) => line.trim() !== "");
      for (const line of lines) {
        const data = line.replace(/^data: /, "");
        if (data === "[DONE]") {
          done = true;
          break;
        }
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices[0].delta.content || "";
          onStreamUpdate(content);
          chatMessage += content;
        } catch (error) {
          console.error("Error parsing stream data:", error);
          console.error("Data that caused the error:", data);
        }
      }
    }
  }

  return chatMessage;
}
