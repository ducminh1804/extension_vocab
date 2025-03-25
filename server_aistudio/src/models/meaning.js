import { DataTypes } from "sequelize";
import { Word } from "./word.js"; // Dùng import thay vì require
import { sequelize } from "../configs/config.js"; // Import sequelize

export const Meaning = sequelize.define("Meaning", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  words_id: {
    type: DataTypes.INTEGER,
    references: { model: Word, key: "id" },
  },
  meaning: { type: DataTypes.TEXT, allowNull: false },
});

Word.hasMany(Meaning, { foreignKey: "words_id", as: "meanings" });
Meaning.belongsTo(Word, { foreignKey: "words_id", as: "words" });
