import { axios } from "@/config";

export const login = (creds) => {
    return axios.post(`/auth/login`, { ...creds });
};

export const register = (creds) => {
    return axios.post(`/auth/register`, { ...creds });
};
