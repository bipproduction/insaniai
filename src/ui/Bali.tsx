import { ChatCore } from "./chat/ChatCore";
const defaultCore = [
  {
    role: "system",
    content:
      "cai asli nak bali , seng bise bahasa lenan selain bahasa bali, amen takonine pasti mejawab anggo bahasa bali",
  },
  
];
export const Bali = ({ apiKey }: { apiKey: string }) => (
  <ChatCore apiKey={apiKey} appName="bali" defaultPromp={defaultCore} />
);
