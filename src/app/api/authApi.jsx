import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_LINK;

export const LoginUser = async (email, password) => {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        return { ok: response.ok, data };
    } catch (error) {
        console.error('loginUser error:', error);
        return { ok: false, data: { error: 'Unable to connect to the server' } };
    }
};

export const VerifyToken = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/verify`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return { ok: response.ok, data: await response.json() };
    } catch (error) {
        console.error('verifyToken error:', error);
        return { ok: false, data: null };
    }
};

export async function GetDataUser() {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error('No authentication token found');
        }

        const res = await axios.get(`${BASE_URL}/api/auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        return res.data;
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            throw new Error('Authentication failed. Please login again.');
        }
        throw error;
    }
}

export async function UpdateUserProfile(profileData) {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error('No authentication token found');
        }

        let requestData;
        let headers = {
            Authorization: `Bearer ${token}`
        };

        if (profileData instanceof FormData) {
            requestData = profileData;
        } else {
            requestData = profileData;
            headers['Content-Type'] = 'application/json';
        }

        const res = await axios.put(`${BASE_URL}/api/auth/profile`, requestData, {
            headers
        });

        return res.data;
    } catch (error) {
        console.error("Failed to update profile:", error);
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            throw new Error('Authentication failed. Please login again.');
        }
        throw error;
    }
}

export async function UpdateUserPassword(passwordData) {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error('No authentication token found');
        }

        const res = await axios.put(`${BASE_URL}/api/auth/change-password`, passwordData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return res.data;
    } catch (error) {
        console.error("Failed to change password:", error);
        if (error.response?.status === 401) {
            if (error.response?.data?.error === 'Current password is incorrect') {
                throw new Error('Current password is incorrect');
            }
            localStorage.removeItem("token");
            throw new Error('Authentication failed. Please login again.');
        }
        throw error;
    }
}
