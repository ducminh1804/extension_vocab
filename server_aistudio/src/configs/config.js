import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("vocab", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  logging: false, // Ẩn log query SQL
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL Connected!");
  } catch (error) {
    console.error("❌ MySQL Connection Failed!", error);
    process.exit(1);
  }
};
await sequelize.sync({ force: true }); // Xóa toàn bộ bảng & tạo lại
