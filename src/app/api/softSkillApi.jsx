import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_LINK;

export async function GetSoftSkills() {
    try {
        const res = await axios.get(`${BASE_URL}/api/soft-skills`);
        return res.data;
    } catch (error) {
        console.error("Failed to fetch soft skills:", error);
        return [];
    }
}

export async function CreateSoftSkill(data) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.post(`${BASE_URL}/api/soft-skills`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to create soft skill:", error);
        throw error;
    }
}

export async function UpdateSoftSkill(id, data) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.put(`${BASE_URL}/api/soft-skills/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to update soft skill:", error);
        throw error;
    }
}

export async function DeleteSoftSkill(id) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.delete(`${BASE_URL}/api/soft-skills/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to delete soft skill:", error);
        throw error;
    }
}
