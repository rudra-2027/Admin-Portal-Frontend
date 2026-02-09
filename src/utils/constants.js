export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const COMPONENT_STATUS = {
    DRAFT: 'draft',
    PENDING: 'pending',
    PUBLISHED: 'published',
    REJECTED: 'rejected'
};

export const USER_ROLES = {
    ADMIN: 'ADMIN',
    CONTRIBUTOR: 'CONTRIBUTOR'
};

export const CATEGORIES = [
    'UI Components',
    'Templates',
    'Layouts',
    'Forms',
    'Navigation',
    'Cards',
    'Modals',
    'Animations',
    'Charts',
    'Other'
];

export const TECH_STACK_OPTIONS = [
    'React',
    'Vue',
    'Angular',
    'Svelte',
    'Next.js',
    'Nuxt.js',
    'Tailwind CSS',
    'Bootstrap',
    'Material-UI',
    'Chakra UI',
    'Framer Motion',
    'GSAP',
    'Three.js',
    'D3.js',
    'TypeScript',
    'JavaScript',
    'HTML',
    'CSS',
    'SCSS'
];

export const STATUS_COLORS = {
    [COMPONENT_STATUS.DRAFT]: 'bg-gray-500',
    [COMPONENT_STATUS.PENDING]: 'bg-yellow-500',
    [COMPONENT_STATUS.PUBLISHED]: 'bg-green-500',
    [COMPONENT_STATUS.REJECTED]: 'bg-red-500'
};
