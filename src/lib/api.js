import axios from "axios"

export const api = axios.create({
    baseURL: process.env.MEDICAL_BOOKING_API_URL, // backend base URL
});