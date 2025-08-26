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
