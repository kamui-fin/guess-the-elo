import httpStatus from "http-status"
import { IUser, UserModel } from "../models"
import { ApiError } from "../utils"

export const getUserByEmail = async (email) => {
    const userFound = await UserModel.findOne({ email: email }).exec()
    return userFound
}

export const getUserByName = async (username) => {
    const userFound = await UserModel.findOne({ username }).exec()
    return userFound
}

export const getUserByEmailOrUsername = async (emailOrUsername) => {
    const userFoundEmail = await getUserByEmail(emailOrUsername)
    const userFoundName = await getUserByName(emailOrUsername)
    return userFoundEmail || userFoundName
}

export const createUser = async (password: string, username: string, email?: string) => {
    const existingUser = (await getUserByName(username)) || (await getUserByEmail(email))
    if (existingUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Email or username already taken")
    }
    const newUser = new UserModel({
        username,
        email,
        password,
    })
    await newUser.save()
    return newUser
}
