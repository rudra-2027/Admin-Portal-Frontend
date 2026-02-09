import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminService } from '../../services/adminService';
import { useToast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';
import {
    FiPlus,
    FiTrash2,
    FiToggleLeft,
    FiToggleRight,
    FiUsers,
    FiSearch,
    FiShield,
    FiMail,
    FiMoreVertical
} from 'react-icons/fi';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'CONTRIBUTOR'
    });
    const toast = useToast();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await adminService.getUsers();
            setUsers(data);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await adminService.createUser(formData);
            toast.success('User created successfully');
            setShowCreateModal(false);
            setFormData({ username: '', email: '', password: '', role: 'CONTRIBUTOR' });
            loadUsers();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to create user');
        }
    };

    const handleToggleActive = async (userId, currentStatus) => {
        try {
            await adminService.updateUser(userId, { isActive: !currentStatus });
            toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`);
            loadUsers();
        } catch (error) {
            toast.error('Failed to update user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await adminService.deleteUser(userId);
            toast.success('User deleted successfully');
            loadUsers();
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <main className="min-h-screen pb-20">
            <div className="max-w-[1400px] mx-auto px-8 pt-10 space-y-8">

                {/* HEADER */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest">
                            System Access
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            User Management
                        </h1>
                        <p className="text-sm font-medium text-slate-500">
                            Manage roles, permissions and account status
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="h-11 px-6 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-indigo-600 transition-all flex items-center gap-2 self-start md:self-auto"
                    >
                        <FiPlus size={18} /> Add New User
                    </button>
                </header>

                {/* TABLE CARD */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative group max-w-sm w-full">
                            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name, email or role..."
                                className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600/30 transition-all font-medium"
                            />
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Active: {users.filter(u => u.isActive).length}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-slate-300" />
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Inactive: {users.filter(u => !u.isActive).length}</span>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <AnimatePresence>
                                    {users.map((user, index) => (
                                        <motion.tr
                                            key={user._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="hover:bg-slate-50/50 transition-colors group"
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{user.username}</p>
                                                        <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                                            <FiMail size={10} /> {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    {user.role === 'ADMIN' ? (
                                                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-rose-100">
                                                            <FiShield size={10} /> Admin
                                                        </span>
                                                    ) : (
                                                        <span className="px-2.5 py-1 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-200">
                                                            Contributor
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                                    <span className={`text-xs font-bold leading-none ${user.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                        {user.isActive ? 'Active' : 'Deactivated'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleToggleActive(user._id, user.isActive)}
                                                        className={`p-2 rounded-xl border transition-all ${user.isActive
                                                            ? 'bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-600 hover:text-white'
                                                            : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                                                            }`}
                                                        title={user.isActive ? 'Suspend User' : 'Activate User'}
                                                    >
                                                        {user.isActive ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all"
                                                        title="Delete User"
                                                    >
                                                        <FiTrash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL STYLING FIX */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Register New System User"
            >
                <form onSubmit={handleCreateUser} className="p-2 space-y-5">
                    <Input
                        label="Account Name"
                        placeholder="e.g. johndoe"
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                    />
                    <Input
                        label="Work Email"
                        placeholder="john@company.com"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <Input
                        label="Temporary Password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Assign Role
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600/30 transition-all appearance-none"
                        >
                            <option value="CONTRIBUTOR">Standard Contributor</option>
                            <option value="ADMIN">System Administrator</option>
                        </select>
                    </div>
                    <div className="flex gap-3 justify-end pt-4">
                        <button
                            type="button"
                            onClick={() => setShowCreateModal(false)}
                            className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-indigo-600 transition-all"
                        >
                            Create Account
                        </button>
                    </div>
                </form>
            </Modal>
        </main>
    );
};

export default UserManagement;

