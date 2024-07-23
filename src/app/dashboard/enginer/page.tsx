'use client'
import { ActionIcon, Button, Card, Divider, Flex, Group, Loader, Paper, ScrollArea, Select, Stack, Text, Textarea, TextInput, Title } from "@mantine/core";
import { useLocalStorage, useShallowEffect } from "@mantine/hooks";
import _ from "lodash";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import toast from "react-simple-toasts";

const colors = {
    colo1: "#e7eaf6"
}

const toastOptions: any = {
    render: (message: string) => <div style={{
        padding: "10px",
        backgroundColor: "white",
        borderRadius: "5px",
    }}>{message}</div>
}

export default function Page() {
    return <Flex >
        <Stack style={{
            borderRight: "1px solid gray"
        }}>
            <CreatePromtEnginer />
        </Stack>
        <Stack flex={1}>
            <ListEnginer />
        </Stack>
    </Flex>;
}

function ListEnginer() {
    const [listEnginer, setlistEnginet] = useState<Record<string, any>[] | null>(null)

    useShallowEffect(() => {
        loadListEnginer()
    }, [])

    async function loadListEnginer() {
        const res = await fetch("/api/ai/enginer/list")
        if (res.ok) {
            const data = await res.json()
            console.log(data)
            setlistEnginet(data)
        }
    }

    return <Stack p={"md"}>
        <Title order={3}>List Enginer</Title>
        {listEnginer?.map((v, k) => (
            <Stack p={"md"} key={k}>
                <Text>{v.name}</Text>
            </Stack>
        ))}
    </Stack>
}

function CreatePromtEnginer() {

    return <Stack p={"md"} h={"100vh"} bg={colors.colo1}>
        <FormPromtEnginer />
    </Stack>
}

const defaultPromps = [
    {
        "role": "system",
        "content": ""
    },
    {
        "role": "assistant",
        "content": ""
    }
]

function FormPromtEnginer() {
    const [loading, setloading] = useState(false)
    const listRole = ["assistant", "user"]
    const [listApp, setListApp] = useState<Record<string, any>[] | null>(null)
    const [selectedApp, setSelectedApp] = useState<string | null>(null)
    const [selectedRole, setSelectedRole] = useState<string | null>(null)
    const [title, setTitle] = useState<string | null>(null)
    const [listPromt, setListPromp] = useLocalStorage({
        key: "listPromt",
        defaultValue: defaultPromps
    })

    useShallowEffect(() => {
        loadListApp()
    }, [])

    async function loadListApp() {
        const res = await fetch("/api/ai/app/list")
        const data = await res.json()
        setListApp(data)
    }

    async function onCreate() {
        if (!title) return toast("title cannot be empty", toastOptions);
        if (listPromt.map(v => v.content).some(v => v === "")) return toast("promt cannot be empty", toastOptions);
        const data = {
            name: title,
            prompts: listPromt,
            appId: selectedApp
        }

        const res = await fetch("/api/ai/enginer/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data
            })
        })

        if (res.ok) {
            setListPromp(defaultPromps)
            setSelectedApp(null)
            setSelectedRole("")
            return toast("create success", toastOptions)
        }

        toast(res.status, toastOptions)

    }

    async function onClear() {
        setListPromp(defaultPromps)
        setSelectedApp(null)
        setSelectedRole("")

    }

    function addListPromp() {
        if (!selectedRole) return toast("role cannot be empty", toastOptions);
        if (listPromt[listPromt.length - 1].role === selectedRole) return toast("role already", toastOptions);
        setListPromp([...listPromt, {
            "role": selectedRole,
            "content": ""
        }])
    }
    return <Stack w={"400"} style={{
        overflow: "auto"
    }} >
        <Stack pb={"md"} pos={"sticky"} bg={colors.colo1} top={0} style={{
            zIndex: 99
        }}>
            <Title order={3}>Create Promt Enginer</Title>
            <Flex gap={"md"}>
                <TextInput label="title" value={title || ""} onChange={(e) => setTitle(e.target.value)} placeholder="title" />
                <Select label="app" leftSection={!listApp && <Loader size={"sm"} />} disabled={!_.isEmpty(selectedRole)} placeholder="select app" w={"200px"} data={listApp ? listApp.map(v => ({
                    "label": v.name,
                    "value": v.id
                })) : []} value={selectedApp} onChange={(v) => v && setSelectedApp(v)} />
            </Flex>
            <Divider />
            <Flex gap={"md"} justify={"space-between"} align={"end"}>
                <Select label="role" disabled={selectedApp === null} placeholder="select role" w={"200px"} data={listRole} value={selectedRole} onChange={(v) => v && setSelectedRole(v)} />
                <Button disabled={selectedRole === null} onClick={addListPromp}
                >Add</Button>
                <Button onClick={onClear}>clear</Button>
            </Flex>
        </Stack>
        <Stack >
            {listPromt.map((v, k) => <Card key={k} pos={"relative"}>
                <Stack >
                    <Flex justify={"end"} display={v.role !== "system" ? "flex" : "none"}>
                        <ActionIcon variant="transparent" onClick={() => setListPromp([...listPromt.slice(0, k), ...listPromt.slice(k + 1)])}>
                            <MdClose />
                        </ActionIcon>
                    </Flex>
                    <Text>Role: {v.role}</Text>
                    <Textarea placeholder="content" label="content" autosize minRows={4} maxRows={12} value={v.content} onChange={(e) => {
                        const newList = [...listPromt];
                        newList[k].content = e.target.value
                        setListPromp(newList)
                    }} />
                </Stack>
            </Card>)}
        </Stack>
        <Group justify="end" pos={"sticky"} bottom={0}>
            <Button loading={loading} onClick={onCreate}>SAVE</Button>
        </Group>
    </Stack>
}