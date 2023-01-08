import Axios from "axios"

const API_URL = "http://localhost:8080"
export const axios = Axios.create({baseURL: API_URL})
