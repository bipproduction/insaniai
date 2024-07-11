"use client";

import { Button, Card, Stack, Text, TextInput } from "@mantine/core";

export function Login() {
  return (
    <Stack bg={"dark"} w={"100%"} h={"100vh"} justify="center" align="center">
      <Card>
        <Stack>
          <Text>LOGIN</Text>
          <TextInput placeholder="phone" />
          <Button>Login</Button>
        </Stack>
      </Card>
    </Stack>
  );
}
