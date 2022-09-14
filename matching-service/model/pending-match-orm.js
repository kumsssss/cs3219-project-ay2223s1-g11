import sequelize from "sequelize";
import { PendingMatch } from "./pending-match-model.js";

export const ormCreatePendingMatch = async (username, socketId, difficultyLevel) => {
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
    console.log(err);
    return { err };
  }
};

export const ormDeletePendingMatch = async (username) => {
  try {
    await PendingMatch.destroy({
      where: {
        username,
      },
    });
    return true;
  } catch (err) {
    console.log(
      `DB Error: Could not delete Pending match with Username: ${username}`
    );
    console.log(err);
    return { err };
  }
};

export const ormGetFirstMatch = async (difficultyLevel) => {
  try {
    const match = await PendingMatch.findOne({
      attributes: ["username", "socketId"],
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
