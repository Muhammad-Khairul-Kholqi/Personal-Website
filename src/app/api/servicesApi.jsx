import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_LINK;

export async function getServices() {
    try {
        const res = await axios.get(`${BASE_URL}/api/services`);
        return res.data; 
    } catch (error) {
        console.error("Failed to fetch services:", error);
        return [];
    }
}
