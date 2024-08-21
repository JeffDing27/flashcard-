import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              front: {
                type: SchemaType.STRING,
              },
              back: {
                type: SchemaType.STRING,
              },
            },
            required: ["front", "back"],
          },
        },
      }
    });

    const data = await req.json();
    const prompt = `Given the following text, generate an array of flashcard objects with a front and back string, if the text contains substantive information that is suitable for creating flashcards. If the text is not suitable (e.g., it's just a single word, a short phrase, or otherwise does not contain enough information to create meaningful flashcards), return an empty array.

The format of the output should be:

{
  "flashcards": [
    {
      "front": "Front of flashcard 1",
      "back": "Back of flashcard 1"
    },
    {
      "front": "Front of flashcard 2",
      "back": "Back of flashcard 2"
    },
    ...
  ]
}

Your task is to:
1. Analyze the given text to determine if it contains enough substantive information to create useful flashcards.
2. If the text is suitable, extract the relevant information and create an array of flashcard objects.
3. If the text is not suitable, return an empty array.
4. Return the final object with the flashcards array as the output.

The text to process is:
`.concat(data.body);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = response.text();
    let jsonOutput = JSON.parse(output);

    if (jsonOutput?.length === 1 && jsonOutput[0].front === "" && jsonOutput[0].back === "") {
      jsonOutput = []; // Google currently doesn't support minList in responseSchema, so we have to manually check for empty array
    }

    return NextResponse.json({ output: jsonOutput });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
