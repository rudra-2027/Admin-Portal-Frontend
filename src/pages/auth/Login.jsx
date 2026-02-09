import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

/* -------------------- INPUT COMPONENT -------------------- */
const Input = ({ label, type = 'text', ...props }) => (
    <div className="space-y-4 mb-8">
        <label className="block text-base font-medium text-slate-700">
            {label}
        </label>
        <input
            type={type}
            className="
        w-full
        rounded-2xl
        border border-slate-300
        px-10 py-8
        text-black
        transition
      "
            {...props}
        />
    </div>
);

/* -------------------- BUTTON COMPONENT -------------------- */
const Button = ({ children, loading, fullWidth, size = 'lg', ...props }) => {
    return (
        <button
            disabled={loading}
            className={`
        ${fullWidth ? 'w-full' : ''}
        mt-10
        py-5
        text-lg
        rounded-2xl
        bg-indigo-600
        text-white
        font-semibold
        hover:bg-indigo-700
        transition
        disabled:opacity-60
        disabled:cursor-not-allowed
        shadow-lg
      `}
            {...props}
        >
            {loading ? 'Signing in…' : children}
        </button>
    );
};


/* -------------------- LOGIN PAGE -------------------- */
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            toast.error('Username and password are required');
            return;
        }

        setLoading(true);
        try {
            const user = await login(username, password);
            toast.success('Welcome back 👋');

            navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
        } catch (error) {
            toast.error(
                error.response?.data?.error ||
                'Authentication failed. Check your credentials.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500 px-8">

            <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[620px]">

                {/* LEFT PANEL */}
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                    <div className="max-w-xl px-12 text-white space-y-6">
                        <h1 className="text-4xl font-extrabold leading-tight">
                            Welcome to Platform
                        </h1>

                        <p className="text-white/85 text-lg leading-relaxed">
                            Secure admin access to manage users, monitor system activity,
                            and control platform workflows efficiently.
                        </p>

                        <ul className="space-y-3 text-base text-white/90">
                            <li>✔ Secure authentication</li>
                            <li>✔ Role-based dashboard</li>
                            <li>✔ Full activity logging</li>
                        </ul>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="flex items-center justify-center px-7 py-2">
                    <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl px-12 py-14 border border-slate-100">

                        {/* HEADER */}
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-extrabold text-slate-800">
                                Sign in
                            </h2>
                            <p className="mt-3 text-sm text-slate-500">
                                Use your platform credentials
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            <Input
                                label="Username"
                                placeholder="john.doe"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <Input
                                type="password"
                                label="Password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <Button type="submit" loading={loading} fullWidth size="lg">
                                Sign in
                            </Button>

                        </form>

                        <p className="mt-12 text-xs text-slate-400 text-center">
                            Authorized access only. All actions are logged.
                        </p>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
