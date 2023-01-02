import { Schema, Document, model } from "mongoose"
import validator from "validator"
import argon2 from "argon2"
import { ApiError } from "../utils"
import httpStatus from "http-status"

export interface IUser {
    username: string
    password: string
    email?: string
}

interface IUserDocument extends IUser, Document {
    isPasswordMatch: (password: string) => Promise<boolean>
}

const schema = new Schema<IUserDocument>(
    {
        username: { type: String, required: true },
        email: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value: string) {
                if (!validator.isEmail(value)) {
                    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, "Invalid email")
                }
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minLength: 8,
            validate(value: string) {
                if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                    throw new ApiError(
                        httpStatus.UNPROCESSABLE_ENTITY,
                        "Password must contain at least one letter and one number"
                    )
                }
            },
        },
    },
    { timestamps: true }
)

schema.methods.isPasswordMatch = async function (password: string) {
    return argon2.verify(this.password, password)
}

schema.methods.toJSON = function () {
    var obj = this.toObject()
    delete obj.password
    return obj
}

schema.pre("save", async function (next) {
    const user = this
    if (user.isModified("password")) {
        user.password = await argon2.hash(user.password)
    }
    next()
})

export const UserModel = model<IUserDocument>("User", schema)
