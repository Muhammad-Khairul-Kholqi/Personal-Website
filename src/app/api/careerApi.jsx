import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_LINK;

export async function GetCareers() {
    try {
        const res = await axios.get(`${BASE_URL}/api/careers`);
        return res.data;
    } catch (error) {
        console.error("Failed to fetch careers:", error);
        return [];
    }
}

export async function GetCareersById(id) {
    try {
        const res = await axios.get(`${BASE_URL}/api/careers/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Failed to fetch career with id ${id}:`, error);
        return null;
    }
}

export async function CreateCareers(data) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.post(`${BASE_URL}/api/careers`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to create career:", error);
        throw error;
    }
}

export async function UpdateCareers(id, data) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.put(`${BASE_URL}/api/careers/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to update career:", error);
        throw error;
    }
}

export async function DeleteCareers(id) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.delete(`${BASE_URL}/api/careers/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to delete career:", error);
        throw error;
    }
}
