import { sequelize } from "./repository.js";
import { Op } from "sequelize";
import { PendingMatch } from "./pending-match-model.js";

export const ormCreatePendingMatch = async (
    username,
    socketId,
    inputFilterKey
) => {
    const filterKey = inputFilterKey.toLowerCase();
    try {
        const newPendingMatch = await new PendingMatch({
            username,
            socketId,
            filterKey,
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
 * Returns First Pending match with desired filterKey but not equal to the given username
 * and deletes returns the pending match.
 */
export const ormGetMatchWithFilterKey = async (username, inputfilterKey) => {
    try {
        const filterKey = inputfilterKey.toLowerCase();
        const result = await sequelize.transaction(async (t) => {
            const match = await PendingMatch.findOne(
                {
                    attributes: ["username", "socketId"],
                    order: sequelize.col("createdAt"),
                    where: {
                        filterKey,
                        username: {
                            [Op.ne]: username,
                        },
                    },
                },
                { transaction: t }
            );

            if (match) {
                await PendingMatch.destroy(
                    {
                        where: {
                            username: match.dataValues.username,
                        },
                    },
                    { transaction: t }
                );
            }

            return match;
        });

        return result;
    } catch (err) {
        console.log(
            `DB Error: Query to find Pending match with filterKey: ${inputfilterKey.toLowerCase()} failed`
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

/**
 * Returns true if the pending match exist then delete it else false.
 */
export const ormDeleteIfPedningMatchExists = async (socketId) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            const match = await PendingMatch.findOne(
                {
                    where: {
                        socketId,
                    },
                },
                { transaction: t }
            );
            if (match) {
                await PendingMatch.destroy(
                    {
                        where: {
                            username: match.dataValues.username,
                        },
                    },
                    { transaction: t }
                );
                return true;
            } else {
                return false;
            }
        });

        return result;
    } catch (err) {
        console.log(
            `DB Error: Query to find and delete Pending match with socketId: ${socketId} failed`
        );
        return { err };
    }
};
