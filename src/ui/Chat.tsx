"use client";
import { AppDotMenu } from "@/component/AppDotMenu";
import { MarkdownRender } from "@/component/MarkdownRender";
import { completionHandler } from "@/lib/ai/completion";
import { useScrollBottom } from "@/lib/ai/useScrollBottom";
import {
  ActionIcon,
  Avatar,
  Box,
  Flex,
  Grid,
  NavLink,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useLocalStorage, useShallowEffect } from "@mantine/hooks";
import _ from "lodash";
import { useState } from "react";
import { MdClearAll, MdSend } from "react-icons/md";

const colors = {
  "bg-header": "#EFF2F5",
  "bg-body": "#FFFFFF",
  "bg-chat": "#E4DDD5",
  "bg-booble-me": "#DBF8C6",
  "bg-booble-you": "#FFFFFF",
  border: "#D1D7DB",
  "chat-text": "#212A2F",
};

const defaultPromp = [
  {
    role: "system",
    content:
      "kamu adalah seorang programer yang sangat pro, senang membantu dan kreatif, mampu menjelasakan setiap pertanyaan dengan detail",
  },
];

export function Chat({ apiKey }: { apiKey: string }) {
  const [loadingPesan, setLoadingPesan] = useState(false);
  const [listChat, setListChat] = useLocalStorage({
    key: "listChat",
    defaultValue: defaultPromp,
  });
  const [pesan, setPesan] = useLocalStorage({
    key: "chat",
    defaultValue: "",
  });

  const [ref, scrollToBottom] = useScrollBottom();

  useShallowEffect(() => {
    scrollToBottom();
  }, [listChat, pesan]);

  async function onKirim() {
    if (!pesan) return;
    setLoadingPesan(true);
    let newChat = [...listChat, { role: "user", content: pesan }];
    setListChat(newChat);
    setPesan("");
    await completionHandler({
      apiKey,
      messages: _.takeRight(newChat, 5),
      stream: true,
      onStreamUpdate(message) {
        if (newChat[newChat.length - 1].role === "assistant") {
          newChat[newChat.length - 1].content += message;
          setListChat([...newChat]);
          scrollToBottom();
        } else {
          newChat.push({ role: "assistant", content: message });
          setListChat([...newChat]);
        }
      },
    });
    setLoadingPesan(false);
  }

  const onCleanAll = () => {
    setListChat(defaultPromp);
    scrollToBottom();
  };
  return (
    <Grid w={"100%"} h={"100vh"} bg={"dark"} gutter={0}>
      <Grid.Col
        miw={300}
        h={"100vh"}
        span={"content"}
        bg={colors["bg-header"]}
        visibleFrom="md"
      >
        <Stack
          h={"100vh"}
          p={"md"}
          gap={0}
          style={{
            overflowX: "scroll",
          }}
        >
          {listChat
            .filter((v) => v.role !== "system")
            .map((v, k) => (
              <NavLink
                key={k}
                label={
                  <Flex gap={"md"} align={"center"}>
                    <Avatar>{v.role === "user" ? "Ai" : "Me"}</Avatar>
                    <Stack gap={0}>
                      <Text>{v.role}</Text>
                      <Text c={"gray"} fz={"sm"}>
                        {v.content.substring(0, 20)}
                      </Text>
                    </Stack>
                  </Flex>
                }
              />
            ))}
        </Stack>
      </Grid.Col>
      <Grid.Col span={"auto"} bg={colors["bg-chat"]} pos={"relative"} style={{
        overflowX: "auto",
      }} >
        <Flex direction={"column"} h={"100vh"} gap={0}>
          <Flex
            pos={"sticky"}
            w={"100%"}
            top={0}
            h={70}
            align={"center"}
            justify={"space-between"}
            px={"md"}
            bg={colors["bg-header"]}
            style={{
              zIndex: 10,
            }}
          >
            <Flex>
              <Avatar>Ai</Avatar>
            </Flex>
            <Flex gap={"md"}>
              <ActionIcon onClick={onCleanAll} variant="transparent">
                <MdClearAll size={"1.5rem"} />
              </ActionIcon>
              <AppDotMenu />
            </Flex>
          </Flex>
          <Stack
            flex={1}
            ref={ref}
            p={"md"}
            style={{
              overflow: "auto",
            }}
          >
            {listChat
              .filter((v) => v.role !== "system")
              .map((v, k) => (
                <Flex
                  w={"100%"}
                  key={k}
                  gap={0}
                  justify={v.role === "user" ? "flex-end" : "flex-start"}
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
          </Stack>
          <Flex
            p={"sm"}
            bg={colors["bg-header"]}
            pos={"sticky"}
            bottom={0}
            w={"100%"}
            gap={"md"}
            align={"center"}
            justify={"space-between"}
            style={{
              zIndex: 10,
            }}
          >
            <TextInput
              onKeyDown={(e) => {
                if (e.key === "Enter") onKirim();
              }}
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              size="md"
              w={"100%"}
              placeholder="Tulis sesuatu..."
            />
            <ActionIcon
              loading={loadingPesan}
              variant="transparent"
              onClick={onKirim}
            >
              <MdSend size={"2rem"} />
            </ActionIcon>
          </Flex>
        </Flex>
      </Grid.Col>
    </Grid>
  );
}
