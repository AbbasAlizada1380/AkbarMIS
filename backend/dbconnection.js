import { Sequelize } from "sequelize";

const sequelize = new Sequelize("orders", "root", "open@123", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
});
export default sequelize;
