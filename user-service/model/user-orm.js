import { createUser, countUsername, getUser } from './repository.js';
import userModel from './user-model.js';

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

export async function ormGetUser(username) {
    try {
        const user = await getUser(username);
        return user;
    }
    catch (err) {
        console.log('ERROR: Could not query database to get user');
        return { err };
    }
}
