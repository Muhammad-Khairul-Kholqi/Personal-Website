import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_LINK;

export async function GetCertificates() {
    try {
        const res = await axios.get(`${BASE_URL}/api/certificates`);
        return res.data;
    } catch (error) {
        console.error("Failed to fetch cerfificates:", error);
        return [];
    }
}

export async function CreateCertificate(data) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.post(`${BASE_URL}/api/certificates`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to create cerfificate", error);
        throw error;
    }
}

export async function UpdateCertificate(id, data) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.put(`${BASE_URL}/api/certificates/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to update cerfificate:", error);
        throw error;
    }
}

export async function DeleteCertificate(id) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.delete(`${BASE_URL}/api/certificates/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to delete cerfificate:", error);
        throw error;
    }
}
