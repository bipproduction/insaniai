"use client";
import { Flex, Paper, Stack, Text, UnstyledButton } from "@mantine/core";
import Link from "next/link";

const listFiture = [
  {
    id: "1",
    name: "jowo",
    desc: "chat dengan jowo",
    path: "/jowo",
  },
  {
    id: "2",
    name: "bali",
    desc: "chat dengan bali",
    path: "/bali",
  },
  {
    id: "3",
    name: "chat",
    desc: "chat dengan bali",
    path: "/chat",
  },
];

export function LandingPage() {
  return (
    <Stack
      bg={"dark"}
      h={"100vh"}
      align="center"
      justify="center"
      style={{
        overflow: "auto",
      }}
    >
      <Flex gap={"md"} wrap={"wrap"} justify={"center"}>
        {listFiture.map((item) => (
          <UnstyledButton key={item.id} component={Link} href={item.path}>
            <Paper p={"md"} w={200} bg={"white"} withBorder>
              <Stack align="center">
                <Text>{item.name}</Text>
              </Stack>
            </Paper>
          </UnstyledButton>
        ))}
      </Flex>
    </Stack>
  );
}
