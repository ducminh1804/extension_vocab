import { DataTypes } from "sequelize";
import { sequelize } from "../configs/config.js";

export const Word = sequelize.define("Word", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  word: { type: DataTypes.STRING, allowNull: false },
  ipa: { type: DataTypes.STRING },
});
