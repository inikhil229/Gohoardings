// lib/llm.ts
// import { ChatOpenAI } from "@langchain/openai";

import { ChatPerplexity } from "@langchain/community/chat_models/perplexity";

export const perplexity = new ChatPerplexity({
  apiKey: process.env.PPLX_API_KEY,   
  configuration: {
    baseURL: "https://api.perplexity.ai",  
  },
  model: "sonar-pro", 
  temperature: 0,
});
