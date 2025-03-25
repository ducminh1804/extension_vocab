import { WordService } from "../services/word.service.js"; // ✅ Đổi require thành import

export class WordController {
  static async create(req, res) {
    console.log(req.body);
    const word = await WordService.createWord(req.body);
    res.status(201).json(word);
  }

  static async getAll(req, res) {
    const words = await WordService.getAllWords();
    res.status(200).json(words);
  }

  static async getById(req, res) {
    const word = await WordService.getWordById(req.params.id);
    word
      ? res.status(200).json(word)
      : res.status(404).json({ error: "Not found" });
  }

  static async update(req, res) {
    await WordService.updateWord(req.params.id, req.body);
    res.status(204).send();
  }

  static async delete(req, res) {
    await WordService.deleteWord(req.params.id);
    res.status(204).send();
  }
}
