import express, {Request, Response} from "express"
import cors from "cors"
import dotenv from "dotenv"
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(express.json())
app.use(cors())
dotenv.config()
const PORT = process.env.PORT
const GEMINI_API_KEY=process.env.GEMINI_API_KEY || ""

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
app.post("/relation", async (req: Request, res: Response) => {
  const words: string[] = req.body.words;

  try {
    if (!words || !Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ error: "Please send words as an array" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are given these words: ${words.join(", ")}.
    Find semantic relationships between them.

    Return result ONLY in JSON with this format:
    {
    "edges": [
        { "from": "<word1>", "to": "<word2>", "relation": "<type>", "why": "<explanation>" }
    ],
    "isolated": ["<words with no relation>"]
    }`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      return res.json({ raw: text, error: "Could not parse Gemini output" });
    }
    const explanations = parsed.edges.map(
      (edge: any) =>
        `• ${edge.from} → ${edge.to} (${edge.relation}): ${edge.why}`
    );

    const response = {
      summary: `Here’s how your words are related:\n${explanations.join(
        "\n"
      )}\n\nIsolated words: ${parsed.isolated.join(", ") || "none"}`,
      data: parsed, 
    };

    res.json(response);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, ()=>{
    console.log(`server is listining`)
})