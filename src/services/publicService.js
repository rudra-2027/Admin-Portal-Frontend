import api from './api';

export const publicService = {
    getComponents: async (params = {}) => {
        const { data } = await api.get('/components', { params });
        return data;
    },

    getComponentBySlug: async (slug) => {
        const { data } = await api.get(`/components/${slug}`);
        return data;
    }
};
