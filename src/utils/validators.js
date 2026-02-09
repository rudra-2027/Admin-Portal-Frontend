export const isRequired = (value) => {
    return value && value.trim() !== '';
};

export const isEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPassword = (password) => {
    return password && password.length >= 6;
};

export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const validateComponentForm = (formData) => {
    const errors = {};

    if (!isRequired(formData.title)) {
        errors.title = 'Title is required';
    }

    if (!isRequired(formData.description)) {
        errors.description = 'Description is required';
    }

    if (!formData.category) {
        errors.category = 'Category is required';
    }

    if (formData.sourceUrl && !isValidUrl(formData.sourceUrl)) {
        errors.sourceUrl = 'Invalid URL format';
    }

    return errors;
};
