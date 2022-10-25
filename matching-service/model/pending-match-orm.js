import sequelize from "sequelize";
import { PendingMatch } from "./pending-match-model.js";

export const ormCreatePendingMatch = async (
    username,
    socketId,
    difficultyLevel
) => {
    try {
        const newPendingMatch = await new PendingMatch({
            username,
            socketId,
            difficultyLevel,
        });
        await newPendingMatch.save();
        return true;
    } catch (err) {
        console.log("DB Error: Could not create new Pending Match");
        return { err };
    }
};

export const ormDeletePendingMatch = async (socketId) => {
    try {
        await PendingMatch.destroy({
            where: {
                socketId,
            },
        });
        return true;
    } catch (err) {
        console.log(
            `DB Error: Could not delete Pending match with socketId: ${socketId}`
        );
        return { err };
    }
};

/**
 * Returns First Pending match with desired difficulty level but not equal to the given username
 * and deletes returns the pending match.
 */
export const ormGetFirstMatch = async (username, difficultyLevel) => {
    try {
        const match = await PendingMatch.findOne({
            attributes: ["username", "socketId"],
            order: sequelize.col("createdAt"),
            where: {
                difficultyLevel,
                username: {
                    [sequelize.Op.ne]: username,
                },
            },
        });
        if (match) {
            await PendingMatch.destroy({
                where: {
                    username: match.dataValues.username,
                },
            });
        }

        return match;
    } catch (err) {
        console.log(
            `DB Error: Query to find Pending match with difficulty level: ${difficultyLevel} failed`
        );
        console.log(err);
        return { err };
    }
};

/**
 * Returns true if the pending match exits else false.
 */
export const ormIsPendingMatchExisting = async (socketId) => {
    try {
        const match = await PendingMatch.findOne({
            where: {
                socketId,
            },
        });
        if (match) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(
            `DB Error: Query to find Pending match with socketId: ${socketId} failed`
        );
        return { err };
    }
};
