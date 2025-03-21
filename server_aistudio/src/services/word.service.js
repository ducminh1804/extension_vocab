import { Word } from "../models/words.js"; // ✅ Dùng import thay vì require

export class WordService {
  static async createWord(data) {
    return await Word.create(data);
  }

  static async getAllWords() {
    return await Word.findAll();
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
