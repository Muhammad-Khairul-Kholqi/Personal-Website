import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_LINK;

export async function GetContact() {
    try {
        const res = await axios.get(`${BASE_URL}/api/contact`);
        return res.data;
    } catch (error) {
        console.error("Failed to fetch contacts:", error);
        return [];
    }
}

export async function CreateContact(data) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.post(`${BASE_URL}/api/contact`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to create contact:", error);
        throw error;
    }
}

export async function UpdateContact(id, data) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.put(`${BASE_URL}/api/contact/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to update contact:", error);
        throw error;
    }
}

export async function DeleteContact(id) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.delete(`${BASE_URL}/api/contact/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to delete contact:", error);
        throw error;
    }
}
