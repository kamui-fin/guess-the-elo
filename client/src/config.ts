import Axios from "axios";

const API_URL = "http://localhost:3080";
export const axios = Axios.create({ baseURL: API_URL });
