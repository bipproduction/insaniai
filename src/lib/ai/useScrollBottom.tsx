import { useRef } from "react";

export function useScrollBottom() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };
  return [ref, scrollToBottom] as const;
}
