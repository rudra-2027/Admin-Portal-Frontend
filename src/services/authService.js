import api from './api';

export const authService = {
    login: async (username, password) => {
        const { data } = await api.post('/auth/login', { username, password });

        // Store tokens
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        // Decode user info from token (simple base64 decode of JWT payload)
        const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
        const user = { id: payload.id, role: payload.role };
        localStorage.setItem('user', JSON.stringify(user));

        return user;
    },

    logout: async () => {
        const refreshToken = localStorage.getItem('refreshToken');

        try {
            await api.post('/auth/logout', { refreshToken });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage regardless of API call success
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('accessToken');
    }
};
