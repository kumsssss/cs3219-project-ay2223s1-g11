import userModel from '../model/user-model.js';
import { ormCreateUser as _createUser } from '../model/user-orm.js'
import {expireToken, getToken, setToken} from '../redis/datastore.js'
import {createToken, verifyToken} from '../auth/token.js'
import 'dotenv/config'
import bcrypt from 'bcryptjs'

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const encryptedPassword = await bcrypt.hash(password, `${process.env.SALT}` | 0);
            const resp = await _createUser(username, encryptedPassword);
            console.log(resp);
            if (resp.err) {
                return res.status(400).json({message: 'Could not create a new user!'});
            } else {
                console.log(`Created new user ${username} successfully!`)
                return res.status(201).json({message: `Created new user ${username} successfully!`});
            }
        } else {
            return res.status(400).json({message: 'Username and/or Password are missing!'});
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: 'Database failure when creating new user!'})
    }
}

export async function loginUser(req, res) {
    try {
        const { username, password} = req.body
        if (!username || !password) {
            return res.status(400).json({message: 'Username and/or Password are missing!'})
        }
        const user = await userModel.findOne({username: username})

        if (!user) {
            return res.status(400).json({message: 'User does not exist!'})
        }

        const matchingPassword = await bcrypt.compare(password, user.password)
        if (matchingPassword) {
            const token = createToken(username)
            await setToken(token)
            return res.status(200).json({token: token})
        }
        else {
            return res.status(400).json({message:"Invalid credentials!"})
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: "Server error: failed to login"})
    }
}

export async function changePassword(req, res) {
    try {
        const { username, currentPassword, newPassword } = req.body
        if (!username || !currentPassword || !newPassword) {
            return res.status(400).json({message: 'Username and/or Passwords are missing!'})
        }
        const user = await userModel.findOne({username: username})
        if (!user) {
            return res.status(400).json({message: "User does not exist!"})
        }
        const validPassword = await bcrypt.compare(currentPassword, user.password)
        if (validPassword) {
            const sameAsOld = await bcrypt.compare(newPassword, user.password)
            if (sameAsOld) {
                return res.status(400).json({message: "New password must not be the same as current password"})
            }
            user.password = await bcrypt.hash(newPassword, `${process.env.SALT}` | 0)
            await user.save()
            return res.status(200).json({message: "Password changed successfully"})
        }
        else {
            return res.status(400).json({message:"Invalid credentials!"})
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: "Server error: failed to change password"})
    }
}

export async function deleteUser(req, res) {
    try {
        const token = req.headers.authorization;
        const {username} = req.body
        if (!token || !username) {
            return res.status(400).json({message: "Token or username is missing!"})
        }

        const isValid = await verifyToken(token)
        const user = await userModel.findOne({username: username})
        if (!isValid) {
            return res.status(401).json({message: "Unable to delete user! Token has expired"})
        }
        if (!user) {
            return res.status(400).json({message: "Unable to delete user! User does not exist"})
        }
        await user.delete();
        return res.status(200).json({message: "Successfully deleted user!"})
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: "Server error: failed to delete user"})
    }
}

export async function logoutUser(req, res) {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(400).json({message: "Token is missing!"})
        }
        const active = await getToken(token)
        if (active) {
            const deactivate = await expireToken(token)
            if (!deactivate) {
                console.log("Unable to expire token")
            }
        }
        return res.status(200).json({message: "Successfully logged out!"})
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: "Server error: failed to logout"})
    }
}

export async function validateUserToken(req, res) {
    try {
        const token = req.headers.authorization;
        console.log(token)
        if (!token) {
            return res.status(400).json({message: "Token is missing!"})
        }
        const verified = verifyToken(token);
        console.log(verified)
        const active = await getToken(token)
        if (verified && active) {
            return res.status(200).json({message: "Successfully verified"});
        } else {
            return res.status(401).json({message: "Token is invalid!"});
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({message: "Server error: failed to validate token"})
    }
}
