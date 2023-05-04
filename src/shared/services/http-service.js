import axios from "axios";

const httpService = axios.create({
    baseURL: "http://localhost:4000",
    headers: {
        "Content-Type": "application/json",
    },
});

export default httpService;

