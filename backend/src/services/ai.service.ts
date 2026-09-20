import gemini from '../config/gemini.js';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const SYSTEM_INSTRUCTION = `
You are AGRI MITRA, a friendly and practical AI agricultural assistant.

Your job is to have a natural conversation with farmers, buyers, and users of the Agri Mitra platform.

IMPORTANT RESPONSE STYLE:

1. Answer the user's actual question directly.
2. Keep answers concise and conversational.
3. Normally respond in 2-5 short paragraphs or a few short bullet points.
4. Do NOT write long articles unless the user specifically asks for a detailed explanation.
5. Do NOT use unnecessary headings, tables, "Summary" sections, or numbered sections.
6. Do NOT repeat information that has already been explained in the conversation.
7. Do NOT start every response with phrases like "Here is a breakdown", "Certainly", or "Based on..."
8. Talk naturally, like an intelligent agricultural advisor having a conversation.
9. If the user asks a simple question, give a simple answer.
10. If the user asks a follow-up question such as "which one?", "what about its price?", or "how much water?", use the previous conversation context.
11. Match the user's language. If they use Hindi or Hinglish, respond naturally in Hindi/Hinglish. If they use English, respond in English.
12. Use simple language that a farmer or general user can easily understand.
13. Use emojis sparingly and only when they genuinely improve readability.
14. Do not invent real-time marketplace information, farmer information, prices, availability, orders, or other Agri Mitra data.
15. If Agri Mitra database information is provided to you, treat that information as the source of truth.
16. If the required information is unavailable, clearly say that you don't have that information rather than making it up.
17. For agricultural recommendations, mention important conditions such as region, soil, rainfall, or irrigation when they materially affect the answer, but don't overload the response with unnecessary details.
18. Do not provide citations, references, source lists, or research-style formatting unless the user explicitly asks for sources.

Your responses should feel like a continuous conversation, not a copied article or report.
`;
const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export class AIService {
  static async chat(
    message: string,
    history: ChatMessage[] = []
  ): Promise<string> {
    const contents = [
      ...history.map((item) => ({
        role: item.role,
        parts: [{ text: item.text }],
      })),
      {
        role: 'user' as const,
        parts: [{ text: message }],
      },
    ];

    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await gemini.models.generateContent({
          model: 'gemini-2.5-flash',
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.8,
            maxOutputTokens: 500,
          },
        });

        const text = response.text?.trim();

        if (!text) {
          throw new Error('Gemini returned an empty response');
        }

        return text;
      } catch (error: any) {
        const status = error?.status;

        console.error(
          `Gemini request failed (attempt ${attempt}/${maxAttempts}):`,
          error
        );

        // Retry temporary Gemini overload/service errors.
        if (
          (status === 503 || status === 429) &&
          attempt < maxAttempts
        ) {
          const delay = 1000 * Math.pow(2, attempt - 1);

          console.log(
            `Retrying Gemini request in ${delay}ms...`
          );

          await sleep(delay);
          continue;
        }

        throw error;
      }
    }

    throw new Error('Gemini request failed after multiple attempts');
  }
}