'use client'
import { Button, Flex, Stack, Textarea, Title } from "@mantine/core";
import { useState } from "react";
import toast from "react-simple-toasts";

export default function Page() {
    const [prompt, setPrompt] = useState("")
    const [result, setResult] = useState()
    const [loading, setLoading] = useState(false)

    async function onGenerate() {
        setLoading(true)
        const res = await fetch("/api/ai/core", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(prompt)
        })

        if (res.ok) {
            const data = await res.json()
            setResult(data)
            setLoading(false)
            return toast("success")
        }

        setLoading(false)
        toast(res.status)

    }
    return <Flex pos={"relative"} >
        <Stack w={400} p={"md"}>
            <Title order={3}>Schema to Json</Title>
            <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} minRows={10} maxRows={20} autosize />
            <Button loading={loading} onClick={onGenerate}>Generate</Button>
        </Stack>
        <Stack flex={1} p={"md"} pos={"relative"} style={{
            overflow: "auto"
        }}>
            <pre>
                {JSON.stringify(result, null, 2)}
            </pre>
        </Stack>
    </Flex>
}