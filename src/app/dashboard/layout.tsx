'use client'
import { Anchor, Flex, Stack } from "@mantine/core";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import path from "path";

const listMenu = [
    {
        "id": "1",
        "title": "app",
        "path": "/dashboard/app"
    },
    {
        "id": "2",
        "title": "enginer",
        "path": "/dashboard/enginer"
    }
]

export default function LayoutDashboard({ children }: { children: React.ReactNode }) {
    const segment = useSelectedLayoutSegment();
    return <Stack pos={"relative"} >
        <Flex flex={1} >
            <Stack visibleFrom="md" miw={300} gap={0} p={"md"} style={{
                borderRight: "1px solid gray"
            }}>
                {listMenu.map((v, k) => (
                    <Anchor fw={"bold"} key={k} href={v.path} c={segment === path.basename(v.path) ? "black" : "gray"}>{v.title}</Anchor>
                ))}
            </Stack>
            <Stack flex={1}>
                {children}
            </Stack>
        </Flex>
    </Stack>;
}