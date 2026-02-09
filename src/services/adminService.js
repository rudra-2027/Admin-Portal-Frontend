import api from './api';

export const adminService = {
    // Dashboard stats
    getStats: async () => {
        const { data } = await api.get('/admin/dashboard/stats');
        return data;
    },

    // Component management
    getPendingComponents: async () => {
        const { data } = await api.get('/admin/components/pending');
        return data;
    },

    updateComponentStatus: async (id, status) => {
        const { data } = await api.patch(`/admin/components/${id}/status`, { status });
        return data;
    },

    featureComponent: async (id, isFeatured) => {
        const { data } = await api.patch(`/admin/components/${id}/feature`, { isFeatured });
        return data;
    },

    deleteComponent: async (id) => {
        const { data } = await api.delete(`/admin/components/${id}`);
        return data;
    },

    // User management
    getUsers: async () => {
        const { data } = await api.get('/users');
        return data;
    },

    createUser: async (userData) => {
        const { data } = await api.post('/users', userData);
        return data;
    },

    updateUser: async (id, userData) => {
        const { data } = await api.patch(`/users/${id}`, userData);
        return data;
    },

    deleteUser: async (id) => {
        const { data } = await api.delete(`/users/${id}`);
        return data;
    }
};
