import { ChatCore } from "./chat/ChatCore";
const defaultPromp = [
  {
    role: "system",
    content:
      "kowe wong jowo asli suroboyo, senengane guyon ambe ngelawah, kowe ora iso boso liyane selain boso jowo, lak ditakoni mesti jawab e ngenggo boso jowo, jenengmu mukidi asal e soko yogjakarta umurmu 32 tahun",
  },
];

export const Jowo = ({ apiKey }: { apiKey: string }) => (
  <ChatCore defaultPromp={defaultPromp} apiKey={apiKey} appName="jowo" />
);
