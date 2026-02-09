import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { componentService } from '../../services/componentService';
import { useToast } from '../../components/ui/Toast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { CATEGORIES, TECH_STACK_OPTIONS } from '../../utils/constants';
import { validateComponentForm } from '../../utils/validators';
import { FiSave, FiSend, FiUpload, FiImage, FiCode, FiLayers, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';

const CreateComponent = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        tags: '',
        techStack: [],
        sourceUrl: ''
    });
    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    const handleSubmit = async (e, submitForReview = false) => {
        e.preventDefault();

        const validationErrors = validateComponentForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(true);
        try {
            const componentData = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
            };

            const component = await componentService.create(componentData);

            if (images.length > 0) {
                await componentService.uploadImages(component._id, images);
            }

            if (submitForReview) {
                await componentService.submit(component._id);
                toast.success('Component created and submitted for review!');
            } else {
                toast.success('Component saved as draft!');
            }

            navigate('/my-components');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to create component');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-24">
            <div className="max-w-[800px] mx-auto px-12 pt-24 space-y-20">

                {/* HEADER */}
                <header className="space-y-2 text-center">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        Create New Asset
                    </h1>
                    <p className="text-base font-medium text-slate-400">
                        Share your UI components with the platform community
                    </p>
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
                                placeholder="e.g., Glassmorphic Login Sidebar"
                            />

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                                    Detailed Description <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={5}
                                    className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:bg-white focus:border-indigo-600/30 transition-all font-medium ${errors.description ? 'border-rose-300 ring-4 ring-rose-50' : ''}`}
                                    placeholder="Explain the component's features, usage, and any dependencies..."
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
                                        className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:bg-white focus:border-indigo-600/30 transition-all font-bold ${errors.category ? 'border-rose-300' : ''}`}
                                    >
                                        <option value="">Select Category</option>
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
                                    placeholder="modern, dark, glassy"
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
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all ${formData.techStack.includes(tech) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-indigo-200 hover:bg-white'}`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${formData.techStack.includes(tech) ? 'bg-white' : 'bg-slate-300'}`} />
                                            {tech}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* SOURCE & IMAGES */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 space-y-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <FiCode />
                                </div>
                                <h2 className="text-lg font-bold text-slate-900">Source & Media</h2>
                            </div>

                            <Input
                                label="Source URL (GitHub / Gist)"
                                name="sourceUrl"
                                value={formData.sourceUrl}
                                onChange={handleChange}
                                error={errors.sourceUrl}
                                placeholder="https://github.com/..."
                            />

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                                    Component Previews
                                </label>
                                <label className="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 hover:border-indigo-300 transition-all">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:shadow-lg transition-all mb-4 text-xl">
                                            <FiImage />
                                        </div>
                                        <p className="text-base font-bold text-slate-600">
                                            {images.length > 0 ? `${images.length} files selected` : 'Drag and drop or click to upload images'}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">PNG, JPG up to 5MB</p>
                                    </div>
                                    <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>
                        </div>

                        {/* SUBMIT BUTTONS */}
                        <div className="flex items-center gap-6 pt-6">
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e, false)}
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 py-5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
                            >
                                <FiSave />
                                Save as Draft
                            </button>
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e, true)}
                                disabled={loading}
                                className="flex-[2] flex items-center justify-center gap-2 py-5 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all disabled:opacity-50"
                            >
                                <FiSend />
                                Submit for Review
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateComponent;
