import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_LINK;

export async function GetTechnologies() {
    try {
        const res = await axios.get(`${BASE_URL}/api/technology`);
        return res.data; 
    } catch (error) {
        console.error("Failed to fetch technologies:", error);
        return [];
    }
}

export async function CreateTechnology(data) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.post(`${BASE_URL}/api/technology`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to create technology:", error);
        throw error;
    }
}

export async function UpdateTechnology(id, data) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.put(`${BASE_URL}/api/technology/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to update technology:", error);
        throw error;
    }
}

export async function DeleteTechnology(id) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.delete(`${BASE_URL}/api/technology/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to delete technology:", error);
        throw error;
    }
}
