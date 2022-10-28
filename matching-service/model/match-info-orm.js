import { MatchInfo } from "./match-info-model.js";

export const ormCreateMatchInfo = async (
    inputUsernameOne,
    inputUsernameTwo,
    inputDifficultyLevel,
    inputTopic
) => {
    if (inputDifficultyLevel === null && inputTopic === null) {
        throw new Error("Match Info: both difficulty level and topic.");
    }

    let difficultyLevel = null;
    if (inputDifficultyLevel !== null) {
        difficultyLevel = inputDifficultyLevel.toLowerCase();
    }

    let topic = null;
    if (inputTopic !== null) {
        topic = inputTopic.toLowerCase();
    }

    let usernameOne = inputUsernameOne;
    let usernameTwo = inputUsernameTwo;
    if (inputUsernameOne.localeCompare(inputUsernameTwo) == 0) {
        throw new Error("Match Pending Match: Usernames must be unique.");
    } else if (inputUsernameOne.localeCompare(inputUsernameTwo) > 0) {
        // Enforce ordering
        usernameOne = inputUsernameTwo;
        usernameTwo = inputUsernameOne;
    }

    try {
        const newMatchInfo = await new MatchInfo({
            usernameOne,
            usernameTwo,
            difficultyLevel,
            topic,
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

export const ormGetAllMatchInfo = async (username) => {
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
