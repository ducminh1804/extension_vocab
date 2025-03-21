import { DataTypes } from "sequelize";
import { Word } from "./words.js"; // Dùng import thay vì require
import { sequelize } from "../configs/config.js"; // Import sequelize

export const Example = sequelize.define("Example", {
  words_id: {
    type: DataTypes.INTEGER,
    references: { model: Word, key: "id" },
  },
  sentence: { type: DataTypes.TEXT },
  explanation: { type: DataTypes.TEXT },
});

// Thiết lập quan hệ
Word.hasMany(Example, { foreignKey: "words_id" });
Example.belongsTo(Word, { foreignKey: "words_id" });
