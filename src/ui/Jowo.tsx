"use client";
import { AppDotMenu } from "@/component/AppDotMenu";
import { MarkdownRender } from "@/component/MarkdownRender";
import {
  ActionIcon,
  Avatar,
  Box,
  Divider,
  Flex,
  Group,
  NavLink,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useHotkeys, useLocalStorage, useShallowEffect } from "@mantine/hooks";
import { useRef, useState } from "react";
import {
  MdAddBox,
  MdArrowBackIos,
  MdClearAll,
  MdGroup,
  MdMessage,
  MdSend,
  MdWeb,
} from "react-icons/md";

const defaultPromp = [
  {
    role: "system",
    content:
      "koe asli wong jowo suroboyo jenengmu Tukijan, angger ditakoni opowae jawab e mesti ngenggo boso jowo suroboyoan seng biasane guyon ambe ngelawak karo ngawe wong nguyu wes lumrah",
  },
];

export function Jowo({ apiKey }: { apiKey: string }) {
  const [hasil, setHasil] = useLocalStorage({
    key: "hasil_jowo",
    defaultValue: "",
  });

  const [listChat, setListChat] = useLocalStorage({
    key: "listChat_jowo",
    defaultValue: defaultPromp,
  });

  const [sedangMengetik, setSedangMengetik] = useState(false);

  const [messageHistory, setMessageHistory] = useLocalStorage({
    key: "messageHistory_jowo",
    defaultValue: defaultPromp,
  });

  const [pesan, setPesan] = useState("");
  const viewport = useRef<HTMLDivElement>(null);

  const maxMessages = 4; // Kurangi jumlah pesan untuk menghemat token

  function summarizeMessages(
    messages: { role: string; content: string }[]
  ): string {
    return messages
      .map(
        (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join(" ");
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
      const summary = summarizeMessages(
        updatedMessageHistory.slice(0, -maxMessages)
      );
      updatedMessageHistory.splice(
        0,
        updatedMessageHistory.length - maxMessages,
        {
          role: "system",
          content: summary,
        }
      );
    }

    setMessageHistory(updatedMessageHistory);
    setListChat((prev) => [...prev, { role: "user", content: userMessage }]);

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
              // onStreamUpdate("\n\n---\n\n");
              // chatMessage += "\n\n---\n\n";
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

      setListChat((prev) => [
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
  }, [hasil, pesan]);

  async function onKirim() {
    setSedangMengetik(true);
    setPesan("");
    await chatgpt(pesan, apiKey, (message) => {
      setHasil((prev) => prev + message);
      scrollToBottom();
    });
    setSedangMengetik(false);
  }

  const cleanHistory = () => {
    // setMessageHistory(defaultPromp);
    setListChat(defaultPromp);
    setHasil("");
  };

  const colors = {
    "bg-header": "#EFF2F5",
    "bg-body": "#FFFFFF",
    "bg-chat": "#EFF2F5",
    "bg-booble-me": "#D9FDD2",
    "bg-booble-you": "#FFFFFF",
    border: "#D1D7DB",
    "chat-text": "#212A2F",
  };

  return (
    <Stack h={"100%"} pos={"fixed"} w={"100%"} bg={"#e5ddd5"}>
      <Flex miw={"100%"} h={"100%"} pos={"fixed"}>
        <Stack miw={400} gap={0} visibleFrom="sm">
          <Flex
            w={"100%"}
            h={70}
            p={"md"}
            bg={colors["bg-header"]}
            align={"center"}
            style={{
              borderRight: `0.5px solid ${colors.border}`,
            }}
            justify={"space-between"}
          >
            <Avatar>Me</Avatar>
            <Flex align={"center"} gap={"sm"}>
              <ActionIcon radius={100} variant="subtle">
                <MdGroup color="gray" size={"2rem"} />
              </ActionIcon>
              <ActionIcon radius={100} variant="subtle">
                <MdWeb color="gray" size={"2rem"} />
              </ActionIcon>
              <ActionIcon radius={100} variant="subtle">
                <MdMessage color="gray" size={"2rem"} />
              </ActionIcon>
              <ActionIcon radius={100} variant="subtle">
                <MdAddBox color="gray" size={"2rem"} />
              </ActionIcon>
            </Flex>
          </Flex>
          <Stack bg={colors["bg-body"]} pos={"relative"} flex={1} gap={0}>
            {listChat
              .filter((chat) => chat.role !== "system")
              .map((chat, index) => (
                <Stack key={index} gap={0}>
                  <NavLink
                    label={
                      <Flex align={"center"} gap={"md"}>
                        <Avatar>{chat.role === "user" ? "Me" : "AI"}</Avatar>
                        <Stack gap={0}>
                          <Text>
                            {chat.role === "user" ? "Me" : "Wong Jowo"}
                          </Text>
                          <Text c={"gray"} fz={"sm"}>
                            {chat.content.substring(0, 30)}
                          </Text>
                        </Stack>
                      </Flex>
                    }
                  />
                  <Divider w={"100%"} />
                </Stack>
              ))}
          </Stack>
        </Stack>
        <Flex
          w={"500"}
          direction={"column"}
          flex={1}
          gap={"xs"}
          pos={"relative"}
          c={colors["chat-text"]}
        >
          <Flex
            p={"md"}
            bg={colors["bg-header"]}
            align={"center"}
            justify={"space-between"}
          >
            <Flex gap={"md"} align={"center"}>
              <Avatar>AI</Avatar>
              <Stack gap={0}>
                <Text ml={"sm"}>Wong Jowo</Text>
                {sedangMengetik && (
                  <Flex>
                    <Text fz={"xs"}>Sedang Mengetik </Text>
                    <div className="typing-indicator">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  </Flex>
                )}
              </Stack>
            </Flex>
            <Flex align={"center"} gap={"sm"}>
              <ActionIcon onClick={cleanHistory} radius={100} variant="subtle">
                <MdClearAll color="gray" size={"2rem"} />
              </ActionIcon>
              <AppDotMenu />
            </Flex>
          </Flex>
          <Stack gap={0}>
            <Box
              p={"md"}
              h={"80vh"}
              ref={viewport}
              mb={"sm"}
              style={{
                overflowY: "auto",
              }}
            >
              {listChat
                .filter((v) => v.role !== "system")
                .map((v, k) => (
                  <Flex
                    key={k}
                    justify={v.role === "user" ? "flex-end" : "flex-start"}
                    mb={"xs"}
                  >
                    <Paper
                      withBorder
                      shadow="xs"
                      px={"sm"}
                      pos={"relative"}
                      bg={
                        v.role === "user"
                          ? colors["bg-booble-me"]
                          : colors["bg-booble-you"]
                      }
                      style={{
                        maxWidth: "80%",
                        borderRadius: "20px",
                      }}
                    >
                      <MarkdownRender markdown={v.content} />
                    </Paper>
                  </Flex>
                ))}
            </Box>
            <Flex
              w={"100%"}
              h={70}
              pos={"absolute"}
              bottom={0}
              gap={"md"}
              justify={"space-between"}
              p={"md"}
              bg={"#f0f0f0"}
              align={"center"}
              // style={{ boxShadow: "0 -1px 1px rgba(0,0,0,0.1)" }}
            >
              <TextInput
                onKeyUp={(e) => {
                  if (e.key === "Enter") onKirim();
                }}
                styles={{
                  input: {
                    border: "none",
                  },
                }}
                placeholder="Tulis sesuatu..."
                flex={1}
                size="md"
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                radius={"sm"}
              />
              <ActionIcon
                variant="transparent"
                size={"lg"}
                onClick={onKirim}
                style={{ borderRadius: "20px" }}
              >
                <MdSend color="gray" size={"2rem"} />
              </ActionIcon>
            </Flex>
          </Stack>
        </Flex>
      </Flex>
    </Stack>
  );
}
