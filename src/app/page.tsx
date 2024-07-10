import { Box, Stack } from "@mantine/core";
import { Suspense } from "react";

const listMenu = [
  {
    id: "1",
    name: "chat",
  },
];
export default function Home({ params }: { params: any }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Stack></Stack>
    </Suspense>
  );
}
