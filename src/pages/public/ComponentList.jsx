import React, { useState, useEffect } from 'react';
import { publicService } from '../../services/publicService';
import ComponentCard from '../../components/ComponentCard';
import { SkeletonCard } from '../../components/ui/Loader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { CATEGORIES, TECH_STACK_OPTIONS } from '../../utils/constants';
import { FiSearch, FiFilter } from 'react-icons/fi';

const ComponentList = () => {
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTech, setSelectedTech] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        loadComponents();
    }, [searchTerm, selectedCategory, selectedTech, page]);

    const loadComponents = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 12,
                search: searchTerm || undefined,
                category: selectedCategory || undefined,
                techStack: selectedTech || undefined
            };

            const data = await publicService.getComponents(params);
            const newComponents = data.components || data;

            if (page === 1) {
                setComponents(newComponents);
            } else {
                setComponents((prev) => [...prev, ...newComponents]);
            }

            setHasMore(newComponents.length === 12);
        } catch (error) {
            console.error('Error loading components:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        loadComponents();
    };

    const handleFilterChange = () => {
        setPage(1);
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 gradient-text">Browse Components</h1>

                {/* Search and Filters */}
                <div className="glass rounded-xl p-6 mb-8">
                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Search components..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit" icon={<FiSearch />}>
                                Search
                            </Button>
                        </div>
                    </form>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-base-content-200 mb-2">
                                Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    handleFilterChange();
                                }}
                                className="w-full px-4 py-2 glass rounded-lg text-base-content-100 focus:outline-none focus:ring-2 focus:ring-accent"
                            >
                                <option value="">All Categories</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-base-content-200 mb-2">
                                Tech Stack
                            </label>
                            <select
                                value={selectedTech}
                                onChange={(e) => {
                                    setSelectedTech(e.target.value);
                                    handleFilterChange();
                                }}
                                className="w-full px-4 py-2 glass rounded-lg text-base-content-100 focus:outline-none focus:ring-2 focus:ring-accent"
                            >
                                <option value="">All Technologies</option>
                                {TECH_STACK_OPTIONS.map((tech) => (
                                    <option key={tech} value={tech}>
                                        {tech}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Components Grid */}
                {loading && page === 1 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : components.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {components.map((component) => (
                                <ComponentCard key={component._id} component={component} />
                            ))}
                        </div>

                        {hasMore && (
                            <div className="text-center">
                                <Button
                                    onClick={() => setPage((p) => p + 1)}
                                    loading={loading}
                                    variant="secondary"
                                >
                                    Load More
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12 glass rounded-xl">
                        <p className="text-base-content-300">No components found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComponentList;
