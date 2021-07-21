import axios from "axios";

const api = axios.create({
    baseURL: "https://cadastro-equipamento-backend.herokuapp.com/"
})

export default api;