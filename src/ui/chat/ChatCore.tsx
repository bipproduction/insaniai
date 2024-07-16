"use client";
import { AppDotMenu } from "@/component/AppDotMenu";
import { MarkdownRender } from "@/component/MarkdownRender";
import { completionHandler } from "@/lib/ai/completion";
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
  TextInput
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import {
  MdAddBox,
  MdClearAll,
  MdGroup,
  MdMessage,
  MdSend,
  MdWeb,
} from "react-icons/md";

const colors = {
  "bg-header": "#EFF2F5",
  "bg-body": "#FFFFFF",
  "bg-chat": "#E4DDD5",
  "bg-booble-me": "#DBF8C6",
  "bg-booble-you": "#FFFFFF",
  border: "#D1D7DB",
  "chat-text": "#212A2F",
};

type DefaultPromp = {
  role: string;
  content: string;
}[];

export function ChatCore({
  apiKey,
  defaultPromp,
  appName,
}: {
  apiKey: string;
  defaultPromp: DefaultPromp;
  appName: string;
}) {

  const [listChat, setListChat] = useLocalStorage({
    key: `listChat_${appName}`,
    defaultValue: defaultPromp,
  });

  const [sedangMengetik, setSedangMengetik] = useState(false);
  const [pesan, setPesan] = useState("");
  const viewport = useRef<HTMLDivElement>(null);
  const maxMessages = 4;

  useEffect(() => {
    scrollToBottom();
  }, [pesan, listChat]);

  async function chatgpt(userMessage: string, apiKey: string): Promise<void> {
    const newListChat = [...listChat, { role: "user", content: userMessage }];
    if (newListChat.length > maxMessages) {
      setListChat(
        newListChat.filter((v) => v.role !== "system").slice(-maxMessages)
      );
    } else {
      setListChat(newListChat);
    }

    try {
      const chatMessage = await completionHandler({
        apiKey,
        messages: newListChat,
      });

      const newMessage = [
        ...newListChat,
        { role: "assistant", content: chatMessage },
      ];
      setListChat(newMessage);
    } catch (error: any) {
      console.error("Error:", error);
    }
  }

  const scrollToBottom = () =>
    viewport.current!.scrollTo({
      top: viewport.current!.scrollHeight,
      behavior: "instant",
    });

  async function onKirim() {
    setSedangMengetik(true);
    setPesan("");
    await chatgpt(pesan, apiKey);
    setSedangMengetik(false);
  }

  const cleanHistory = () => {
    setListChat(defaultPromp);
  };

  return (
    <Grid w={"100%"} gutter={0}>
      <Grid.Col w={400} span={"content"} visibleFrom="md" >
        <Flex direction={"column"} h={"100vh"}>
          <HeaderKiri />
          <Stack
            flex={1}
            p={"md"}
            gap={0}
            style={{
              overflowY: "scroll",
            }}
          >
            {listChat
              .filter((chat) => chat.role !== "system")
              .map((chat, index) => (
                <NavLink
                  style={{
                    borderBottom: "0.5px solid #D1D7DB",
                  }}
                  key={index}
                  label={
                    <Flex gap={"md"}>
                      <Avatar>{chat.role.substring(0, 1).toUpperCase()}</Avatar>
                      <Stack gap={0}>
                        <Text>{chat.role}</Text>
                        <Text c={"gray"} fz={"sm"}>
                          {chat.content.substring(0, 20)}
                        </Text>
                      </Stack>
                    </Flex>
                  }
                />
              ))}
          </Stack>
          <Box
            pos={"sticky"}
            bottom={0}
            bg={colors["bg-header"]}
            h={120}
            p={"md"}
            style={{
              borderRight: `0.5px solid ${colors.border}`,
            }}
          >
            BIP Studio <sup>wibu@2024</sup>
          </Box>
        </Flex>
      </Grid.Col>
      <Grid.Col span={"auto"} bg={colors["bg-chat"]} pos={"relative"} style={{
        overflowX: "auto",
      }}>
        <Flex direction={"column"} h={"100vh"} gap={0}
        >
          <Box pos={"sticky"} top={0} style={{ zIndex: 10 }}>
            <HeaderKanan />
          </Box>
          <Stack
            flex={1}
            style={{
              overflowY: "scroll",
            }}>
            <Content viewport={viewport} />
          </Stack>
          <Flex
            pos={"sticky"}
            bottom={0}
            w={"100%"}
            bg={colors["bg-header"]}
            p={"md"}
            align={"center"}
            gap={"md"}
            justify={"space-between"}
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
              loading={sedangMengetik}
              variant="transparent"
              size={"lg"}
              onClick={onKirim}
              style={{ borderRadius: "20px" }}
            >
              <MdSend color="gray" size={"2rem"} />
            </ActionIcon>
          </Flex>
        </Flex>
      </Grid.Col>
    </Grid>
  );

  function HeaderKiri() {
    return (
      <Flex
        w={"100%"}
        h={70}
        p={"md"}
        bg={colors["bg-header"]}
        align={"center"}
        pos={"sticky"}
        top={0}
        style={{
          borderRight: `0.5px solid ${colors.border}`,
          zIndex: 99,
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
    );
  }

  function HeaderKanan() {
    return (
      <Flex
        align={"center"}
        bg={colors["bg-header"]}
        h={70}
        p={"sm"}
        justify={"space-between"}
      >
        <Flex gap={"md"} align={"center"}>
          <Avatar>AI</Avatar>
          <Stack gap={"0"} align="start" justify="start">
            <Text ml={"sm"}>{_.startCase(appName)}</Text>
            {sedangMengetik && <SedangMengetik />}
          </Stack>
        </Flex>
        <Flex align={"center"} gap={"sm"}>
          <ActionIcon onClick={cleanHistory} radius={100} variant="subtle">
            <MdClearAll color="gray" size={"2rem"} />
          </ActionIcon>
          <AppDotMenu />
        </Flex>
      </Flex>
    );
  }

  function SedangMengetik() {
    const list = [".", "..", "...", "...."];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % list.length);
      }, 500); // Ubah 500 menjadi waktu yang diinginkan dalam milidetik

      // Membersihkan interval saat komponen tidak lagi digunakan
      return () => clearInterval(interval);
    }, [list.length]);

    return (
      <Flex gap={"xs"} px={"sm"}>
        <Text fz={"xs"} c={"gray"}>
          Sedang mengetik {list[currentIndex]}
        </Text>
      </Flex>
    );
  }

  function Content({ viewport }: any) {
    return (
      <Stack
        ref={viewport}
        p={"md"}
        h={"83vh"}
        style={{
          overflow: "scroll",
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
                  overflow: "auto"
                }}
              >
                <MarkdownRender markdown={v.content} />
              </Paper>
            </Flex>
          ))}
      </Stack>
    );
  }
}
