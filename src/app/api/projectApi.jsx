import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_LINK;

export async function GetProjects() {
    try {
        const res = await axios.get(`${BASE_URL}/api/projects`);
        return res.data;
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return [];
    }
}

export async function CreateProject(data) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.post(`${BASE_URL}/api/projects`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to create project:", error);
        throw error;
    }
}

export async function UpdateProject(id, data) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.put(`${BASE_URL}/api/projects/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to update project:", error);
        throw error;
    }
}

export async function DeleteProject(id) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.delete(`${BASE_URL}/api/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to delete project:", error);
        throw error;
    }
}
