import httpStatus from "http-status"
import { userService } from "../services"
import { ApiError } from "../utils"

export const loginUser = async (usernameOrEmail: string, password: string) => {
    const user = await userService.getUserByEmailOrUsername(usernameOrEmail)
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials")
    }
    return user
}
