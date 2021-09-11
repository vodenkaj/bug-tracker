import * as userModel from "../models/userModel.js"
import * as projectModel from "../models/projectModel.js"
import argon2 from "argon2"

export const signIn = async (email, password) => {
    const userRecord = await userModel.getOne(email);

    if (!userRecord)
        throw new Error("User not found!");

    const isPasswordValid = await argon2.verify(userRecord.password, password);

    if (isPasswordValid) {
        delete userRecord.password;

        return userRecord;
    } else {
        throw new Error("Invalid password!");
    }
}

export const signUp = async (email, password, first_name, last_name) => {
    const hashedPassword = await argon2.hash(password);

    const userRecord = await userModel.create(email, hashedPassword, first_name, last_name);

    if (!userRecord)
        throw new Error("User cannot be created!");

    delete userRecord.password;
    return userRecord;
}

export const hasUserAuth = async (userId, projectId) => {
    const user = await projectModel.getUser(userId, projectId);
    return user.length > 0;
}
