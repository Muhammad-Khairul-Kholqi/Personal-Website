import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_LINK;

export async function GetSkills() {
    try {
        const res = await axios.get(`${BASE_URL}/api/skills`);
        return res.data;
    } catch (error) {
        console.error("Failed to fetch hard skills:", error);
        return [];
    }
}

export async function CreateHardSkill(data) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.post(`${BASE_URL}/api/skills`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to create hard skill:", error);
        throw error;
    }
}

export async function UpdateHardSkill(id, data) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.put(`${BASE_URL}/api/skills/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to update hard skill:", error);
        throw error;
    }
}

export async function DeleteHardSkill(id) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.delete(`${BASE_URL}/api/skills/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to delete hard skill:", error);
        throw error;
    }
}
