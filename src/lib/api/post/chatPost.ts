import OpenAI from "openai";
import { encoding_for_model } from "tiktoken";

// Konfigurasi API OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Konstanta
const maxAllowedTokens = 8192; // Sesuaikan dengan model yang Anda gunakan
const maxMessages = 5; // Kurangi jumlah pesan untuk menghemat token

// Riwayat pesan awal
let messageHistory: { role: string; content: string }[] = [
  {
    role: "system",
    content: "You are a helpful assistant.",
  },
];

// Fungsi untuk menghitung total token dalam messageHistory
function calculateTotalTokens(
  messages: { role: string; content: string }[]
): number {
  const enc = encoding_for_model("gpt-4o");
  let totalTokens = 0;
  for (const message of messages) {
    totalTokens += enc.encode(message.content).length;
  }
  return totalTokens;
}

// Fungsi utama untuk menangani chat
export async function chatPost(req: Request): Promise<Response> {
  const body = await req.json();
  const userMessage: string = body.message;

  // console.log("User:", userMessage);

  const chatResponse = await chatgpt(userMessage);

  // console.log("ChatGPT:", chatResponse.message);
  return new Response(JSON.stringify(chatResponse));
}

// Fungsi untuk mengirim pesan ke ChatGPT
async function chatgpt(userMessage: string): Promise<{ message: string }> {
  // Tambahkan pesan pengguna ke riwayat
  messageHistory.push({ role: "user", content: userMessage });

  // Batasi jumlah pesan dalam riwayat
  if (messageHistory.length > maxMessages) {
    messageHistory = messageHistory.slice(-maxMessages);
  }

  // Hitung total token yang digunakan oleh pesan dalam riwayat
  const totalTokens = calculateTotalTokens(messageHistory);

  // Hitung sisa token yang dapat digunakan untuk respons
  const remainingTokens = maxAllowedTokens - totalTokens;

  // Pastikan max_tokens tidak negatif dan tidak melebihi remainingTokens
  const maxTokens =
    remainingTokens > 0 ? Math.min(1000, remainingTokens) : 1000;

  console.log(maxTokens, "maxTokens");
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messageHistory as any,
      max_tokens: maxTokens,
    });

    const reply: any = response.choices[0].message.content;
    console.log("ChatGPT:", reply);

    // Tambahkan balasan ChatGPT ke riwayat
    messageHistory.push({ role: "assistant", content: reply });

    return { message: reply };
  } catch (error: any) {
    console.error("Error:", error);
    return { message: "Error: " + error.message };
  }
}
