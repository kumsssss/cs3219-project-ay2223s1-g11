import { Sequelize } from "sequelize";

const sequelizeInit = new Sequelize("test.db", "user", "pass", {
    dialect: "sqlite",
    host: "./dev.sqlite",
    logging: (...msg) => console.log(`DB: ${msg[0]}`),
});

// Established connection with database
try {
    await sequelizeInit.authenticate();
    console.log("DB: Database connection has been established successfully.");
} catch (error) {
    console.error("DB: Unable to connect to the database:", error);
}

export const sequelize = sequelizeInit;
