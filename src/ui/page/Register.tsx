import { Button, Card, Stack, Text, TextInput } from "@mantine/core";

export function Register() {
  return (
    <Stack bg={"dark"} w={"100%"} h={"100vh"} justify="center" align="center">
      <Card>
        <Stack>
          <Text>REGISTER</Text>
          <TextInput placeholder="phone" />
          <Button>Register</Button>
        </Stack>
      </Card>
    </Stack>
  );
}
