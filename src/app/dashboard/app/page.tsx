'use client'
import { Button, Card, Divider, Flex, Stack, Text, TextInput, Title } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { useState } from "react";
import toas from 'react-simple-toasts'

const toastOptions: any = {
    render: (message: string) => <div style={{
        padding: "10px",
        backgroundColor: "white",
        borderRadius: "5px",
    }}>{message}</div>
}

export default function Page() {
    const [reload, setReload] = useState("0")
    return <Flex>
        <Stack style={{ borderRight: "1px solid gray" }} p={"md"}>
            <FormCreateApp onSuccess={() => {
                setReload(reload + 1)
            }} />
        </Stack>
        <Stack flex={1}>
            <ListApp reload={reload} />
        </Stack>
    </Flex>
}

function FormCreateApp({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        "name": ""
    })

    async function onCreate() {
        if (form.name === "") return toas("app name cannot be empty", toastOptions);

        setLoading(true);
        const res = await fetch("/api/ai/app/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: form })
        })

        if (res.ok) {
            setLoading(false);
            setForm({ ...form, name: "" });
            onSuccess()
            return toas("create success", toastOptions);
        }

        setLoading(false);
        toas(res.status, toastOptions)
    }
    return <Stack>
        <Title order={3}>Create App</Title>
        <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="app name" />
        <Button loading={loading} onClick={onCreate}>Create</Button>
    </Stack>
}

function ListApp({ reload }: { reload: string }) {
    const [listApp, setListApp] = useState<Record<string, any>>([])

    useShallowEffect(() => {
        loadListApp()
    }, [reload])
    async function loadListApp() {
        const res = await fetch("/api/ai/app/list")

        if (res.ok) {
            const data = await res.json();
            setListApp(data);
        }
    }
    return <Stack p={"md"}>
        <Title order={3}>List App</Title>
        {listApp.map((v: any, k: any) => <Card key={k}>
            <Flex>
                <Stack flex={1} gap={0}>
                    <Text>{v.id}</Text>
                    <Text>{v.name}</Text>
                </Stack>
                <Stack>
                    <Deletebutton id={v.id} onSuccess={loadListApp} />
                </Stack>
            </Flex>
        </Card>)}
    </Stack>
}

function Deletebutton({ id, onSuccess }: { id: string, onSuccess: () => void }) {
    const [loading, setLoading] = useState(false)

    async function onDelete() {
        setLoading(true);
        const res = await fetch("/api/ai/app/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: { id } })
        })
        if (res.ok) {
            setLoading(false);
            onSuccess()
            return toas("create success", toastOptions);
        }
        setLoading(false);
        toas(res.status, toastOptions)
    }
    return <Button onClick={onDelete} loading={loading}>Delete</Button>
}