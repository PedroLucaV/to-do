import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    "todo_list",
    "root",
    "Sen@iDev77!.",
    {
        host: "localhost",
        dialect: "mysql"
    }
)

export default sequelize;