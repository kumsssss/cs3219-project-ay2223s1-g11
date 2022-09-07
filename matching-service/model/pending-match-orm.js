import sequelize from "sequelize";
import { PendingMatch } from "./pending-match-model.js";

export const ormCreatePendingMatch = async (socketId, difficultyLevel) => {
  try {
    const newPendingMatch = await new PendingMatch({
      socketId,
      difficultyLevel,
    });
    await newPendingMatch.save();
    return true;
  } catch (err) {
    console.log("DB Error: Could not create new Pending Match");
    console.log(err);
    return { err };
  }
};

export const ormDeletePendingMatch = async (socketId) => {
  try {
    await PendingMatch.destroy({
      where: {
        socketId: socketId,
      },
    });
    return true;
  } catch (err) {
    console.log(
      `DB Error: Could not delete Pending match with socket id: ${socketId}`
    );
    console.log(err);
    return { err };
  }
};

export const ormGetFirstMatch = async (difficultyLevel) => {
  try {
    const match = await PendingMatch.findOne({
      attributes: ["socketId"],
      order: sequelize.col("createdAt"),
      where: {
        difficultyLevel: difficultyLevel,
      },
    });
    return match;
  } catch (err) {
    console.log(err);
  }
};
