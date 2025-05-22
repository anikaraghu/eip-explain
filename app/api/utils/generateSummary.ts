import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PROMPTS = {
  simple: "Explain this EIP in simple terms that a non-technical person can understand. Focus on the main purpose and impact:",
  detailed: "Provide a comprehensive explanation of this EIP, including its purpose, motivation, and main changes. Include relevant context but avoid deep technical details:",
  technical: "Give a technical explanation of this EIP, including specific implementation details, technical changes, and potential implications for developers:",
};

export async function generateEIPSummary(eipContent: string, mode: 'simple' | 'detailed' | 'technical') {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert in Ethereum Improvement Proposals (EIPs). Your task is to explain EIPs clearly and accurately based on the requested level of detail."
        },
        {
          role: "user",
          content: `${PROMPTS[mode]}\n\nEIP Content:\n${eipContent}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || "Failed to generate summary";
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
} 