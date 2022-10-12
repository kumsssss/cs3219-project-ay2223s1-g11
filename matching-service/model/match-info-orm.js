import { MatchInfo } from "./match-info-model.js";

export const ormCreateMatchInfo = async (
    firstUsername,
    secondUsername,
    difficultyLevel
) => {
    const usernameOne = firstUsername;
    const usernameTwo = secondUsername;

    if (firstUsername.localeCompare(secondUsername) == 0) {
        throw new Error("Usernames must be unique.");
    } else if (firstUsername.localeCompare(secondUsername) > 0) {
        // Enforce ordering
        usernameOne = secondUsername;
        usernameTwo = firstUsername;
    }

    try {
        const newMatchInfo = await new MatchInfo({
            usernameOne,
            usernameTwo,
            difficultyLevel,
        });
        await newMatchInfo.save();
        return true;
    } catch (err) {
        console.log("DB Error: Could not create new Live Match");
        return { err };
    }
};

export const ormDeleteMatchInfo = async (firstUsername, secondUsername) => {
    const usernameOne = firstUsername;
    const usernameTwo = secondUsername;

    if (firstUsername.localeCompare(secondUsername) > 0) {
        usernameOne = secondUsername;
        usernameTwo = firstUsername;
    }

    try {
        await MatchInfo.destroy({
            where: {
                usernameOne,
                usernameTwo,
            },
        });
        return true;
    } catch (err) {
        console.log(
            `DB Error: Could not delete Match Info with usernames ${usernameOne} and ${usernameTwo}`
        );
        console.log(err);
        return { err };
    }
};

export const ormGetLiveMatch = async (username) => {
    try {
        const matchInfo = await MatchInfo.findOne({
            where: {
                [Op.or]: [{ usernameOne: username }, { usernameTwo: username }],
            },
        });
        return matchInfo;
    } catch (err) {
        console.log(err);
    }
};
