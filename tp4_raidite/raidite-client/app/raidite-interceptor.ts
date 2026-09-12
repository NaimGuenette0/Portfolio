import axios from "axios";

export const raidite = axios.create();

raidite.interceptors.request.use((config) => {

    config.headers.Authorization = "Bearer " + sessionStorage.getItem("token");

    return config;

});