import { Example } from "../models/example.js";
import { Meaning } from "../models/meaning.js";
import { Word } from "../models/word.js"; // ✅ Dùng import thay vì require

export class WordService {
  static async createWord(data) {
    try {
      const { word, ipa, meanings, examples } = data;
      const newWord = await Word.create(
        {
          word,
          ipa,
          meanings: data.meanings
            ? data.meanings.map((m) => ({ meaning: m }))
            : [],
          examples: examples ? examples.map((ex) => ({ ...ex })) : [],
        },
        {
          include: [
            { model: Example, as: "examples" },
            { model: Meaning, as: "meanings"},
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

  static async getWordById(id) {
    return await Word.findByPk(id);
  }

  static async updateWord(id, data) {
    return await Word.update(data, { where: { id } });
  }

  static async deleteWord(id) {
    return await Word.destroy({ where: { id } });
  }
}
