import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import { sequelize } from "./src/configs/config.js";
import wordRoutes from "./src/routes/word.routes.js"; // Thêm .js vào cuối
const key = "AIzaSyDvEadDToHzT16oMwDWpLJFpvUxYNucx1o";

const genAI = new GoogleGenerativeAI(key);

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

app.post("/extension", async (req, res) => {
  try {
    const { word } = req.body;

    const prompt = `Provide the following information for the English word "${word}":
1. The five most common meanings of the word in Vietnamese.
2. The IPA pronunciation.
3. Three example sentences using this word in an office context. For each example, include a "sentence" field and an "explanation" field, where the explanation is just the Vietnamese translation of the sentence.

Return the results as a JSON object with "meanings", "ipa", and "examples".`;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 500, // Tăng giá trị để có kết quả đầy đủ
        temperature: 0.5, // Giảm tính ngẫu nhiên
      },
    });
    const re = JSON.parse(
      result.response.text().replace(/^```json|\n|```/g, "")
    );
    res.json(re);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use("/api/words", wordRoutes);

sequelize.sync().then(() => console.log("✅ Database connected"));
app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});
