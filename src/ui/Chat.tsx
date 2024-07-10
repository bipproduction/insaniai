"use client";
import { MarkdownRender } from "@/component/MarkdownRender";
import {
  ActionIcon,
  Avatar,
  Button,
  Flex,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { useLocalStorage, useShallowEffect } from "@mantine/hooks";
import { useRef, useState } from "react";
import { MdClearAll, MdHistory } from "react-icons/md";

export function Chat({ apiKey }: { apiKey: string }) {
  const [hasil, setHasil] = useLocalStorage({
    key: "hasil",
    defaultValue: "",
  });

  const [messageHistory, setMessageHistory] = useLocalStorage({
    key: "messageHistory",
    defaultValue: [
      {
        role: "system",
        content:
          "You are an expert in technology, programming, and software engineering.",
      },
    ],
  });

  const [pesan, setPesan] = useState("");
  const viewport = useRef<HTMLDivElement>(null);

  const maxMessages = 4; // Kurangi jumlah pesan untuk menghemat token

  function summarizeMessages(messages: { role: string; content: string }[]): string {
    return messages
      .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join(' ');
  }

  async function chatgpt(
    userMessage: string,
    apiKey: string,
    onStreamUpdate: (message: string) => void
  ): Promise<void> {
    const updatedMessageHistory = [
      ...messageHistory,
      { role: "user", content: userMessage },
    ];

    if (updatedMessageHistory.length > maxMessages) {
      const summary = summarizeMessages(updatedMessageHistory.slice(0, -maxMessages));
      updatedMessageHistory.splice(0, updatedMessageHistory.length - maxMessages, {
        role: "system",
        content: summary,
      });
    }

    setMessageHistory(updatedMessageHistory);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: updatedMessageHistory,
            max_tokens: 4000,
            stream: true,
          }),
        }
      );

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
              onStreamUpdate("\n\n---\n\n");
              chatMessage += "\n\n---\n\n";
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

      setMessageHistory((prev) => [
        ...prev,
        { role: "assistant", content: chatMessage },
      ]);
    } catch (error: any) {
      console.error("Error:", error);
      onStreamUpdate("Error: " + error.message);
    }
  }

  const scrollToBottom = () =>
    viewport.current!.scrollTo({
      top: viewport.current!.scrollHeight,
      behavior: "instant",
    });

  useShallowEffect(() => {
    scrollToBottom();
  }, [hasil]);

  async function onKirim() {
    console.log("Pesan:", pesan);
    setPesan("");
    chatgpt(pesan, apiKey, (message) => {
      setHasil((prev) => prev + message);
      scrollToBottom();
    });
  }

  const cleanHistory = () => {
    setMessageHistory([
      {
        role: "system",
        content:
          "You are an expert in technology, programming, and software engineering.",
      },
    ]);
    setHasil("");
  };

  return (
    <Stack h={"100vh"} pos={"fixed"} w={"100%"}>
      <Group
        justify="right"
        p={"md"}
        pos={"absolute"}
        right={0}
        top={0}
        style={{
          zIndex: 999,
        }}
      >
        <ActionIcon onClick={cleanHistory}>
          <MdHistory size={"2rem"} />
        </ActionIcon>
        <ActionIcon onClick={() => setHasil("")}>
          <MdClearAll size={"2rem"} />
        </ActionIcon>
      </Group>
      <Flex>
        <Stack w={300} pos={"relative"}>
          <Flex
            justify={"end"}
            pos={"absolute"}
            top={0}
            right={0}
            style={{
              zIndex: 999,
            }}
          >
            <Avatar bg={"blue"} color="dark">
              {messageHistory.length}
            </Avatar>
          </Flex>
          <ScrollArea.Autosize h={"90vh"}>
            <pre
              style={{
                fontSize: "10px",
                textWrap: "wrap",
                wordWrap: "break-word",
              }}
            >
              {messageHistory.map((v, k) => (
                <Paper mb={"sm"} p={"sm"} key={k} bg={"#000000"} c={"#d0d0d0"}>
                  <Stack gap={0}>
                    <Text c={"teal"}>{v.role}</Text>
                    <MarkdownRender markdown={v.content} />
                  </Stack>
                </Paper>
              ))}
            </pre>
          </ScrollArea.Autosize>
        </Stack>
        <ScrollArea
          flex={1}
          c={"#d3d3d3"}
          fz={"sm"}
          h={"90vh"}
          p={"md"}
          viewportRef={viewport}
        >
          <MarkdownRender markdown={hasil} />
        </ScrollArea>
      </Flex>
      <Flex
        gap={"md"}
        justify={"space-between"}
        p={"md"}
        pos={"absolute"}
        w={"100%"}
        bottom={0}
      >
        <Textarea
          placeholder="Tulis sesuatu..."
          flex={1}
          autosize
          maxRows={10}
          value={pesan}
          onChange={(e) => setPesan(e.target.value)}
        />
        <Button onClick={onKirim}>Kirim</Button>
      </Flex>
    </Stack>
  );
}
