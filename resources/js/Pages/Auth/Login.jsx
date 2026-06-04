import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-gray-950 flex">
            <Head title="Login — Vesto" />

            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden border-r border-gray-800">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="absolute border border-white rounded-full"
                            style={{
                                width: `${(i + 1) * 120}px`,
                                height: `${(i + 1) * 120}px`,
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}
                        />
                    ))}
                </div>

                <Link href="/" className="text-2xl font-black tracking-widest text-white relative z-10">VESTO</Link>

                <div className="relative z-10">
                    {/* Fashion quote */}
                    <div className="mb-8">
                        <div className="w-12 h-px bg-gray-500 mb-6"></div>
                        <p className="text-gray-400 text-sm italic leading-relaxed">"Fashion is the armor to survive the reality of everyday life."</p>
                        <p className="text-gray-600 text-xs mt-2">— Bill Cunningham</p>
                    </div>

                    <h2 className="text-6xl font-black text-white leading-none mb-2">WELCOME</h2>
                    <h2 className="text-6xl font-black leading-none mb-6" style={{WebkitTextStroke: '1px #4b5563', color: 'transparent'}}>BACK.</h2>
                    <p className="text-gray-400 text-base leading-relaxed max-w-sm">Your style journey continues. Sign in to explore the latest collections crafted for you.</p>

                    {/* Tags */}
                    <div className="flex gap-2 mt-8 flex-wrap">
                        {['#NewCollection', '#PremiumFashion', '#Vesto2026'].map((tag) => (
                            <span key={tag} className="text-xs text-gray-500 border border-gray-700 px-3 py-1 rounded-full">{tag}</span>
                        ))}
                    </div>
                </div>

                <p className="text-gray-700 text-xs relative z-10">© 2026 Vesto. All rights reserved.</p>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
                {/* Subtle top right decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-800 rounded-bl-full opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-800 rounded-tr-full opacity-20"></div>

                <div className="w-full max-w-md relative z-10">
                    <Link href="/" className="lg:hidden text-2xl font-black tracking-widest text-white block mb-10">
                        VESTO
                    </Link>

                    {/* Header */}
                    <div className="mb-8">
                        <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Member Access</span>
                        <h1 className="text-4xl font-black text-white mt-2 mb-1">Sign In</h1>
                        <div className="w-12 h-0.5 bg-white mt-3 mb-4"></div>
                        <p className="text-gray-500 text-sm">
                            New to Vesto?{' '}
                            <Link href="/register" className="text-white font-semibold hover:text-gray-300 transition-colors">
                                Create account →
                            </Link>
                        </p>
                    </div>

                    {status && (
                        <div className="mb-6 text-sm font-medium text-green-400 bg-green-400/10 px-4 py-3 rounded-xl border border-green-400/20">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-gray-400 transition-all placeholder-gray-600"
                                placeholder="your@email.com"
                                autoFocus
                            />
                            <InputError message={errors.email} className="mt-2 text-red-400 text-xs" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-gray-400 transition-all placeholder-gray-600"
                                placeholder="••••••••"
                            />
                            <InputError message={errors.password} className="mt-2 text-red-400 text-xs" />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded bg-gray-800 border-gray-700 accent-white"
                                />
                                <span className="text-sm text-gray-500">Remember me</span>
                            </label>
                            {canResetPassword && (
                                <Link href={route('password.request')} className="text-sm text-gray-500 hover:text-white transition-colors">
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-white text-gray-900 font-black text-sm py-4 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed tracking-widest uppercase"
                        >
                            {processing ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Bottom fashion tags */}
                    <div className="mt-10 pt-8 border-t border-gray-800">
                        <div className="flex gap-2 flex-wrap">
                            {['Fashion', 'Style', 'Premium', 'Vesto'].map((tag) => (
                                <span key={tag} className="text-xs text-gray-700 font-semibold tracking-widest uppercase">{tag} /</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}