import api from './api';

export const componentService = {
    // Contributor operations
    create: async (componentData) => {
        const { data } = await api.post('/components', componentData);
        return data;
    },

    update: async (id, componentData) => {
        const { data } = await api.put(`/components/${id}`, componentData);
        return data;
    },

    delete: async (id) => {
        const { data } = await api.delete(`/components/${id}`);
        return data;
    },

    submit: async (id) => {
        const { data } = await api.post(`/components/${id}/submit`);
        return data;
    },

    getMyComponents: async () => {
        const { data } = await api.get('/components/my');
        return data;
    },

    uploadImages: async (id, files) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('images', file);
        });

        const { data } = await api.post(`/components/${id}/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return data;
    }
};
