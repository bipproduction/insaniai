import { Box } from "@mantine/core";
import { Suspense } from "react";
export default function Home({ params }: { params: any }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Box pos={"relative"}>main page</Box>
    </Suspense>
  );
}
