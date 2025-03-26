import { Example } from "../models/example.js";
import { Meaning } from "../models/meaning.js";
import { Word } from "../models/word.js"; // ✅ Dùng import thay vì require

export class WordService {
  static async createWord(data) {
    try {
      const { word, ipa, meanings, examples } = data;
      const normalizedWord = word.toLowerCase(); // Chuyển thành chữ thường

      const existingWord = await Word.findOne({ where: { word } });

      if (existingWord) {
        return existingWord;
      }

      const newWord = await Word.create(
        {
          word: normalizedWord,
          ipa,
          meanings: data.meanings
            ? data.meanings.map((m) => ({ meaning: m }))
            : [],
          examples: examples ? examples.map((ex) => ({ ...ex })) : [],
        },
        {
          include: [
            { model: Example, as: "examples" },
            { model: Meaning, as: "meanings" },
          ],
        }
      );

      return newWord;
    } catch (error) {
      console.error("Error in createWord:", error);
      throw error;
    }
  }

  static async getAllWords() {
    return await Word.findAll({
      include: [
        { model: Meaning, as: "meanings", attributes: ["id", "meaning"] },
        {
          model: Example,
          as: "examples",
          attributes: ["id", "sentence", "explanation"],
        },
      ], // ✅ Sử dụng alias chính xác
    });
  }

  static async getByWord(word) {
    const foundWord = await Word.findOne({
      where: { word: word.toLowerCase() },
      include: [
        { model: Example, as: "examples" },
        { model: Meaning, as: "meanings" },
      ],
    });

    if (!foundWord) {
      return null; // Hoặc trả về thông báo nếu không tìm thấy
    }

    // Định dạng lại dữ liệu để chỉ lấy các trường cần thiết
    return {
      ipa: foundWord.ipa,
      meanings: foundWord.meanings.map((m) => m.meaning), // Lấy danh sách nghĩa
      examples: foundWord.examples.map((ex) => ({
        sentence: ex.sentence,
        explanation: ex.explanation,
      })), // Lấy danh sách ví dụ
    };
  }

  static async updateWord(id, data) {
    return await Word.update(data, { where: { id } });
  }

  static async deleteWord(id) {
    return await Word.destroy({ where: { id } });
  }
}
