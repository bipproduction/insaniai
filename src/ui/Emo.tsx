"use client";
import { MarkdownRender } from "@/component/MarkdownRender";
import { completionHandler } from "@/lib/ai/completion";
import { Box, Button, Flex, Stack, Textarea } from "@mantine/core";
import { useState } from "react";

const defaultPromp = [
  {
    role: "system",
    content: `
    posisikan diri anda sebagai seorang pembaca yang berada di bali
    saya ingin setiap kali saya memberikan artikel anda langsung merubah jawabannya kedalam bentuk json
    {POTENSI MENDUKUNG, MEMPERTIMBANGKAN, TIDAK TAHU, POTENSI TIDAK MENDUKUNG}
    berikan nilai 1 sampai dengan 100 dari setiap kolomnya atas analisa artikel tersebut
    `,
  },
];

export function Emo({ apiKey }: { apiKey: string }) {
  const [hasil, setHasil] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const onKirim = async () => {
    setLoading(true);
    const userPrompt = [
      {
        role: "user",
        content: content,
      },
    ];

    const newPromp = [...defaultPromp, ...userPrompt];

    // return console.log(newPromp);
    const data = await completionHandler({
      apiKey: apiKey,
      messages: newPromp,
    });

    setHasil(data);
    setLoading(false);
    setContent("");
  };
  return (
    <Box pos={"fixed"} w={"100%"} h={"100%"}>
      <Stack
        p={"md"}
        style={{
          overflowY: "scroll",
        }}
      >
        <Flex>heder</Flex>
        <Stack>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            minRows={10}
            maxRows={20}
            autosize
          />
          <Flex justify={"end"}>
            <Button loading={loading} onClick={onKirim}>
              Kirim
            </Button>
          </Flex>
        </Stack>
        <MarkdownRender markdown={hasil} />
      </Stack>
    </Box>
  );
}
