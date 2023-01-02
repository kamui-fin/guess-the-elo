import { authService, userService } from "../services"
import { catchAsync } from "../utils"
import httpStatus from "http-status"

export const register = catchAsync(async (req, res) => {
    const { password, username, email } = req.body
    const user = await userService.createUser(password, username, email)
    const id = user._id.toString()
    req.session.userId = id
    res.status(httpStatus.CREATED).send(user)
})

export const logout = catchAsync(async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            throw err()
        }
        res.status(httpStatus.NO_CONTENT).send()
    })
})

export const login = catchAsync(async (req, res) => {
    const { username, password } = req.body
    const user = await authService.loginUser(username, password)
    const id = user._id.toString()
    req.session.userId = id
    res.send(user)
})
