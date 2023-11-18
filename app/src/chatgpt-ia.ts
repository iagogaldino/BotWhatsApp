import { Message } from "venom-bot";
// import axios from "axios";

//  async function RequestApi() {
//   try {
//     const response = await axios.get('https://luck-app.onrender.com/getConfigApp');
//     console.log('Dados recebidos:', response.data);
//   } catch (error) {
//     console.error('Erro na requisição:', error);
//   }
// }

import OpenAI from "openai";
const config = { apiKey: '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' };
const openai = new OpenAI(config);

async function main(message: string) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: message }],
    model: "gpt-3.5-turbo",
  });

  // console.log(completion.choices[0]);
  return completion;
}

// main();

export async function verifyMessageClient(message: string) {
  console.log('verifyMessageClient', message);
  return await requestOpenAi(message);
}

async function requestOpenAi(message: string) {
  return await main(message);
}