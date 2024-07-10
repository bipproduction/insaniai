"use client";
import { ActionIcon, Textarea } from "@mantine/core";
import { MdSend } from "react-icons/md";

export function PrompInput({
  loading,
  textInput,
  setTextInput,
  onSend,
}: {
  loading: boolean;
  textInput: string;
  setTextInput: (value: string) => void;
  onSend: (value: string) => void;
}) {
  return (
    <Textarea
      value={textInput}
      onChange={(e) => setTextInput(e.target.value)}
      color={"blue"}
      rightSection={
        <ActionIcon loading={loading} onClick={() => onSend(textInput)} size={30}>
          <MdSend />
        </ActionIcon>
      }
      styles={{
        input: {
          backgroundColor: "lightgray",
          color: "#333",
        },
      }}
      flex={1}
      autosize
      minRows={2}
      maxRows={10}
    />
  );
}
