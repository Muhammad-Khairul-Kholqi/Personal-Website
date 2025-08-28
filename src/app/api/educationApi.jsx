import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_LINK;

export async function GetEducations() {
    try {
        const res = await axios.get(`${BASE_URL}/api/educations`);
        return res.data;
    } catch (error) {
        console.error("Failed to fetch educations:", error);
        return [];
    }
}

export async function CreateEducation(data) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.post(`${BASE_URL}/api/educations`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to create education:", error);
        throw error;
    }
}

export async function UpdateEducation(id, data) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.put(`${BASE_URL}/api/educations/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to update education:", error);
        throw error;
    }
}

export async function DeleteEducation(id) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.delete(`${BASE_URL}/api/educations/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to delete education:", error);
        throw error;
    }
}
