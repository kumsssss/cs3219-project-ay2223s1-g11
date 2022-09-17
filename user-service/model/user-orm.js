import { createUser, countUsername } from './repository.js';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
    try {
        const newUser = await createUser({username, password});
        newUser.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new user');
        return { err };
    }
}

export async function ormDoesUsernameExist(username) {
    try {
        const usernameCount = await countUsername(username);
        return usernameCount > 0;
    } catch (err) {
        console.log('ERROR: Could not query database to check');
        return { err };
    }
}
