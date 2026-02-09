import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { componentService } from '../../services/componentService';
import { useToast } from '../../components/ui/Toast';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';
import { CATEGORIES, TECH_STACK_OPTIONS } from '../../utils/constants';
import { validateComponentForm } from '../../utils/validators';
import { FiSave, FiSend, FiInfo, FiLayers, FiCode, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';

const EditComponent = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        loadComponent();
    }, [id]);

    const loadComponent = async () => {
        try {
            const components = await componentService.getMyComponents();
            const component = components.find(c => c._id === id);

            if (!component) {
                toast.error('Component not found');
                navigate('/my-components');
                return;
            }

            setFormData({
                title: component.title,
                description: component.description,
                category: component.category,
                tags: component.tags?.join(', ') || '',
                techStack: component.techStack || [],
                sourceUrl: component.sourceUrl || ''
            });
        } catch (error) {
            toast.error('Failed to load component');
            navigate('/my-components');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleTechStackChange = (tech) => {
        const newTechStack = formData.techStack.includes(tech)
            ? formData.techStack.filter(t => t !== tech)
            : [...formData.techStack, tech];
        setFormData({ ...formData, techStack: newTechStack });
    };

    const handleSubmit = async (e, submitForReview = false) => {
        e.preventDefault();

        const validationErrors = validateComponentForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Please fix the errors in the form');
            return;
        }

        setSaving(true);
        try {
            const componentData = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
            };

            await componentService.update(id, componentData);

            if (submitForReview) {
                await componentService.submit(id);
                toast.success('Component updated and submitted for review!');
            } else {
                toast.success('Component updated!');
            }

            navigate('/my-components');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update component');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="pb-24">
            <div className="max-w-[800px] mx-auto px-12 pt-24 space-y-20">

                {/* HEADER */}
                <header className="flex flex-col items-center gap-6 text-center">
                    <button
                        onClick={() => navigate('/my-components')}
                        className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-lg transition-all"
                    >
                        <FiArrowLeft size={24} />
                    </button>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Edit Submission
                        </h1>
                        <p className="text-base font-medium text-slate-400">
                            Updating asset: <span className="text-indigo-600 font-bold">#{id.slice(-6)}</span>
                        </p>
                    </div>
                </header>

                <div className="flex justify-center w-full">

                    {/* FORM SECTION */}
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="w-full space-y-12"
                    >

                        {/* BASIC INFORMATION */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 space-y-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <FiInfo />
                                </div>
                                <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>
                            </div>

                            <Input
                                label="Asset Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                error={errors.title}
                                required
                            />

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                                    Detailed Description <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={6}
                                    className={`w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:bg-white focus:border-indigo-600/30 transition-all font-medium ${errors.description ? 'border-rose-300 ring-4 ring-rose-50' : ''}`}
                                />
                                {errors.description && (
                                    <p className="mt-2 text-xs font-bold text-rose-500">{errors.description}</p>
                                )}
                            </div>
                        </div>

                        {/* CATEGORIZATION & TECH */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 space-y-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <FiLayers />
                                </div>
                                <h2 className="text-lg font-bold text-slate-900">Categorization & Tech</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                                        Category <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:bg-white focus:border-indigo-600/30 transition-all font-bold"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <Input
                                    label="Tags (Comma separated)"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                                    Tech Stack (Select all that apply)
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {TECH_STACK_OPTIONS.map((tech) => (
                                        <button
                                            key={tech}
                                            type="button"
                                            onClick={() => handleTechStackChange(tech)}
                                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all ${formData.techStack.includes(tech) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-indigo-200'}`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${formData.techStack.includes(tech) ? 'bg-white' : 'bg-slate-300'}`} />
                                            {tech}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* SOURCE */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 space-y-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <FiCode />
                                </div>
                                <h2 className="text-lg font-bold text-slate-900">Source</h2>
                            </div>

                            <Input
                                label="Source URL (GitHub / Gist)"
                                name="sourceUrl"
                                value={formData.sourceUrl}
                                onChange={handleChange}
                                error={errors.sourceUrl}
                            />
                        </div>

                        {/* SUBMIT BUTTONS */}
                        <div className="flex items-center gap-6 pt-6">
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e, false)}
                                disabled={saving}
                                className="flex-1 flex items-center justify-center gap-2 py-5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50"
                            >
                                <FiSave />
                                Update Draft
                            </button>
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e, true)}
                                disabled={saving}
                                className="flex-[2] flex items-center justify-center gap-2 py-5 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all disabled:opacity-50"
                            >
                                <FiSend />
                                Update & Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditComponent;
