/* eslint-disable */
// TODO: Import whatever service you decide to use. i.e. `import OpenAI from 'openai';`
"use server";
import OpenAI from "openai"
// HINT: You'll want to initialize your service outside of the function definition
const client = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

// TODO: Implement the function below
export async function generateResponse(message: string): Promise<string> {
  const response = await client.responses.create(
    {
    model: "gpt-5-nano",
    input: [
      {
        role: "system",
        content: [
          {
          type: "input_text",
          text: "You are only allowed to answer questions about animals. If the user tries to change the topic to something not about animals, reroute the topic back to animals"
        }
        ]
    }, 
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: message
        }
      ]
    }
  ]
});

  return typeof response.output_text == "string" ? response.output_text : "Something went wrong!";
}
