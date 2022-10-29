import { DataTypes } from "sequelize";
import { sequelize } from "./repository.js";

/**
 * Stores the users which are pending to match.
 * Primary key is the username.
 */
export const PendingMatch = sequelize.define("PendingMatch", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    socketId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    filterKey: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Creates PendingMatches Table, dropping it first if it already exists.
await PendingMatch.sync({ force: true });
console.log("DB: PendingMatch were synchronized successfully.");
