import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicService } from '../../services/publicService';
import ComponentCard from '../../components/ComponentCard';
import { SkeletonCard } from '../../components/ui/Loader';
import { FiSearch, FiLayers, FiZap, FiGithub, FiArrowRight, FiActivity, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Home = () => {
    const { user, loading: authLoading } = useAuth();
    const [featuredComponents, setFeaturedComponents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && user) {
            navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        loadPublishedComponents();
    }, []);

    const loadPublishedComponents = async () => {
        try {
            // Fetch components without the 'isFeatured' filter to show all "Approved" (Published) assets
            const data = await publicService.getComponents({ status: 'published', limit: 12 });
            setFeaturedComponents(data.components || data);
        } catch (error) {
            console.error('Error loading components:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* HERO SECTION - Premium Mesh Gradient */}
            <section className="relative pt-40 pb-48 px-6 overflow-hidden bg-white text-center">
                {/* Visual Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
                        {/* Mesh Gradients */}
                        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[80%] bg-indigo-50/60 rounded-full blur-[120px] animate-pulse" />
                        <div className="absolute top-[10%] right-[-10%] w-[60%] h-[70%] bg-blue-50/50 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

                        {/* Modern Grid Pattern Decoration */}
                        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-[0.03]"
                            style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto relative z-10 text-center space-y-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-10"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-slate-200">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                            Platform V2 Now Live
                        </div>

                        <h1 className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.85] py-2">
                            Build with <br />
                            <span className="text-indigo-600">Pure Intent</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed tracking-tight">
                            The definitive source for high-performance UI components. <br className="hidden md:block" />
                            Engineered for speed, built for craftsmen.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-8 justify-center items-center"
                    >
                        <Link to="/components">
                            <button className="px-14 py-6 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xl shadow-2xl shadow-indigo-100 hover:bg-slate-900 hover:scale-[1.05] transition-all flex items-center gap-3 active:scale-95">
                                <FiSearch strokeWidth={3} />
                                Start Browsing
                            </button>
                        </Link>
                        <Link to="/login">
                            <button className="px-14 py-6 bg-white border border-slate-200 text-slate-900 rounded-[1.5rem] font-black text-xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-3 shadow-xl shadow-slate-100/50">
                                <FiPlus />
                                Get Started
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* FEATURED SECTION */}
            <section className="py-32 px-6 bg-slate-50">
                <div className="max-w-[1440px] mx-auto">
                    <div className="flex items-end justify-between mb-20 px-4">
                        <div className="space-y-4">
                            <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Curated Collection</h2>
                            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Featured Creations</h3>
                        </div>
                        <Link to="/components" className="group flex items-center gap-3 text-sm font-black text-slate-900 hover:text-indigo-600 transition-colors">
                            VIEW FULL REPOSITORY
                            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                                <FiArrowRight />
                            </div>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {[...Array(6)].map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : featuredComponents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {featuredComponents.map((component, idx) => (
                                <motion.div
                                    key={component._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <ComponentCard component={component} />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                            <FiActivity className="mx-auto text-slate-100 text-6xl mb-6" />
                            <p className="text-slate-400 font-bold">No featured components currently live.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* MINIMAL STATS */}
            <section className="py-40 px-6 border-t border-slate-100 bg-white">
                <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-24">
                    <div className="space-y-6 text-center md:text-left">
                        <div className="text-7xl font-black text-slate-900 tracking-tighter">1k+</div>
                        <div className="space-y-1">
                            <p className="text-lg font-black text-slate-800">Verified Assets</p>
                            <p className="text-sm text-slate-400 font-medium">Production-ready UI components across 12 categories.</p>
                        </div>
                    </div>
                    <div className="space-y-6 text-center md:text-left">
                        <div className="text-7xl font-black text-indigo-600 tracking-tighter">500</div>
                        <div className="space-y-1">
                            <p className="text-lg font-black text-slate-800">Elite Contributors</p>
                            <p className="text-sm text-slate-400 font-medium">Top designers and developers from the global community.</p>
                        </div>
                    </div>
                    <div className="space-y-6 text-center md:text-left">
                        <div className="text-7xl font-black text-slate-200 tracking-tighter">50k</div>
                        <div className="space-y-1">
                            <p className="text-lg font-black text-slate-800">Direct Downloads</p>
                            <p className="text-sm text-slate-400 font-medium">Helping teams launch beautiful interfaces faster.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-24 px-6 mb-24">
                <div className="max-w-[1440px] mx-auto bg-slate-900 rounded-[3rem] p-20 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[40%] h-full bg-indigo-600/10 skew-x-12 translate-x-1/2" />

                    <div className="relative z-10 space-y-10">
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                            Ready to Elevate Your <br />
                            Development Workflow?
                        </h2>
                        <div className="flex flex-wrap justify-center gap-6">
                            <Link to="/login">
                                <button className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20">
                                    Get Started Now
                                </button>
                            </Link>
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="px-12 py-5 bg-slate-800 text-white rounded-2xl font-black text-lg hover:bg-slate-700 transition-all flex items-center gap-3">
                                <FiGithub size={24} /> View Source
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
