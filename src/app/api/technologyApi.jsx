import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_LINK;

export async function getTechnologies() {
    try {
        const res = await axios.get(`${BASE_URL}/api/technology`);
        return res.data; 
    } catch (error) {
        console.error("Failed to fetch technologies:", error);
        return [];
    }
}
