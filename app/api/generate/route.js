import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { db } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    console.log("Server-side API key:", process.env.GOOGLE_API_KEY);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              front: { type: SchemaType.STRING },
              back: { type: SchemaType.STRING },
            },
            required: ["front", "back"],
          },
        },
      },
    });

    const data = await req.json();
    const prompt = `
      Create flashcards from this text:

      ${data.body}

      Return JSON ONLY (no explanation), in this format:
      [
        { "front": "...", "back": "..." }
      ]
    `;

    const result = await model.generateContent(prompt);

    console.log("API result full object:", result);

    // MUST use await here
    const response = await result.response;
    const output = await response.text();

    // STEP 3: Log raw output
    console.log("Raw API output:", output);

    let jsonOutput = JSON.parse(output);

    // STEP 4: Fallback if API returns empty or bad
    if (!Array.isArray(jsonOutput) || jsonOutput.length === 0) {
      console.log("⚠️ Google returned nothing — using fallback dummy flashcards");

      jsonOutput = [
        { front: "Example Front 1", back: "Example Back 1" },
        { front: "Example Front 2", back: "Example Back 2" },
      ];
    }

    // Save to Firestore
    const flashcardsRef = collection(db, "flashcards");
    for (const card of jsonOutput) {
      await addDoc(flashcardsRef, card);
    }

    return NextResponse.json({ output: jsonOutput });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
