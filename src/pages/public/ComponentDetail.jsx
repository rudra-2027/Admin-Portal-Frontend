import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicService } from '../../services/publicService';
import Loader from '../../components/ui/Loader';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatDate, formatNumber } from '../../utils/formatters';
import { FiEye, FiDownload, FiExternalLink, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ComponentDetail = () => {
    const { slug } = useParams();
    const [component, setComponent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        loadComponent();
    }, [slug]);

    const loadComponent = async () => {
        try {
            const data = await publicService.getComponentBySlug(slug);
            setComponent(data);
        } catch (error) {
            console.error('Error loading component:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    if (!component) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-base-content-100 mb-4">Component not found</h2>
                    <Link to="/components">
                        <Button variant="gradient">Browse Components</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Back button */}
                <Link to="/components" className="inline-flex items-center gap-2 text-base-content-200 hover:text-base-content-100 mb-6">
                    <FiArrowLeft /> Back to Components
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Image Gallery */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="glass rounded-xl overflow-hidden mb-4"
                        >
                            {component.previewImages && component.previewImages.length > 0 ? (
                                <img
                                    src={component.previewImages[selectedImage]}
                                    alt={component.title}
                                    className="w-full h-96 object-cover"
                                />
                            ) : (
                                <div className="w-full h-96 flex items-center justify-center bg-secondary">
                                    <span className="text-base-content-300">No preview available</span>
                                </div>
                            )}
                        </motion.div>

                        {/* Thumbnail Gallery */}
                        {component.previewImages && component.previewImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {component.previewImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`glass rounded-lg overflow-hidden ${selectedImage === index ? 'ring-2 ring-accent' : ''
                                            }`}
                                    >
                                        <img src={img} alt={`Preview ${index + 1}`} className="w-full h-20 object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Component Info */}
                    <div>
                        <div className="flex items-start justify-between mb-4">
                            <h1 className="text-4xl font-bold text-base-content-100">{component.title}</h1>
                            {component.isFeatured && <Badge variant="warning">Featured</Badge>}
                        </div>

                        <p className="text-base-content-200 text-lg mb-6">{component.description}</p>

                        {/* Stats */}
                        <div className="flex gap-6 mb-6 text-base-content-300">
                            <span className="flex items-center gap-2">
                                <FiEye /> {formatNumber(component.views || 0)} views
                            </span>
                            <span className="flex items-center gap-2">
                                <FiDownload /> {formatNumber(component.downloads || 0)} downloads
                            </span>
                        </div>

                        {/* Category */}
                        {component.category && (
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-base-content-300 mb-2">Category</h3>
                                <Badge variant="info">{component.category}</Badge>
                            </div>
                        )}

                        {/* Tech Stack */}
                        {component.techStack && component.techStack.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-base-content-300 mb-2">Tech Stack</h3>
                                <div className="flex flex-wrap gap-2">
                                    {component.techStack.map((tech, index) => (
                                        <Badge key={index} variant="accent">
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {component.tags && component.tags.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-base-content-300 mb-2">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {component.tags.map((tag, index) => (
                                        <Badge key={index} variant="default">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4">
                            {component.sourceUrl && (
                                <a href={component.sourceUrl} target="_blank" rel="noopener noreferrer">
                                    <Button variant="gradient" icon={<FiExternalLink />}>
                                        View Source
                                    </Button>
                                </a>
                            )}
                            <Button variant="secondary" icon={<FiDownload />}>
                                Download
                            </Button>
                        </div>

                        {/* Meta */}
                        <div className="mt-8 pt-6 border-t border-base-content-300 border-opacity-20">
                            <p className="text-sm text-base-content-300">
                                Published on {formatDate(component.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComponentDetail;
