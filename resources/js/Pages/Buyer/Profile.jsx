import { Link, useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useBuyerTheme } from '../../Context/BuyerThemeContext';
import AccountSidebar from '../../Components/Buyer/AccountSidebar';
import { Moon, Sun, Menu, X, Save, Shield, Lock, Bell } from 'lucide-react';

export default function Profile() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const { theme, toggleTheme } = useBuyerTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: user?.name || '',
        username: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        birthday: user?.birthday || '',
        gender: user?.gender || '',
        language: user?.language || 'en',
        country: user?.country || '',
        bio: user?.bio || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('buyer.profile.update'), data, {
            onSuccess: (page) => {
                // Update form data with the latest user data from the server
                const updatedUser = page.props.auth.user;
                setData({
                    name: updatedUser?.name || '',
                    username: updatedUser?.username || '',
                    email: updatedUser?.email || '',
                    phone: updatedUser?.phone || '',
                    birthday: updatedUser?.birthday || '',
                    gender: updatedUser?.gender || '',
                    language: updatedUser?.language || 'en',
                    country: updatedUser?.country || '',
                    bio: updatedUser?.bio || '',
                });
            }
        });
    };

    // Calculate profile completion percentage
    const calculateCompletion = () => {
        const fields = ['name', 'username', 'email', 'phone', 'birthday', 'gender', 'language', 'country', 'bio'];
        const filledFields = fields.filter(field => {
            const value = data[field];
            return value && value.trim() !== '';
        }).length;
        return Math.round((filledFields / fields.length) * 100);
    };

    const completionPercentage = calculateCompletion();

    const themeStyles = {
        dark: {
            bg: 'bg-[#0a0f1a]',
            headerBg: 'bg-[#0a1628]',
            border: 'border-white/10',
            text: 'text-white',
            textMuted: 'text-white/60',
            textMutedLight: 'text-white/40',
            cardBg: 'bg-white/5',
            cardBgLight: 'bg-white/8',
            hoverBg: 'hover:bg-white/10',
            inputBg: 'bg-[#0d1b2a]',
            inputBorder: 'border-white/10',
            inputFocus: 'focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20',
            primary: 'bg-blue-600 hover:bg-blue-700',
            primaryText: 'text-white',
        },
        light: {
            bg: 'bg-gray-50',
            headerBg: 'bg-white',
            border: 'border-gray-200',
            text: 'text-gray-900',
            textMuted: 'text-gray-600',
            textMutedLight: 'text-gray-400',
            cardBg: 'bg-white',
            cardBgLight: 'bg-gray-50',
            hoverBg: 'hover:bg-gray-100',
            inputBg: 'bg-white',
            inputBorder: 'border-gray-300',
            inputFocus: 'focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20',
            primary: 'bg-blue-600 hover:bg-blue-700',
            primaryText: 'text-white',
        },
    };

    const styles = themeStyles[theme];

    return (
        <div className={`min-h-screen flex ${styles.bg}`} style={{fontFamily: "'Inter', sans-serif"}}>
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className={`fixed inset-0 z-50 lg:hidden ${theme === 'dark' ? 'bg-black/50' : 'bg-black/30'}`}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <AccountSidebar activeMenu="profile" />
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <AccountSidebar activeMenu="profile" />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-screen transition-all duration-300 lg:ml-72 ml-0">
                {/* Top Header */}
                <div className={`${styles.headerBg} border-b ${styles.border} px-4 md:px-6 py-5 sticky top-0 z-40`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className={`lg:hidden p-2 ${styles.hoverBg} rounded-lg transition-colors`}
                            >
                                {sidebarOpen ? <X className={`w-5 h-5 ${styles.text}`} /> : <Menu className={`w-5 h-5 ${styles.text}`} />}
                            </button>
                            <div>
                                <h1 className={`text-xl md:text-2xl font-semibold ${styles.text}`}>
                                    My Profile
                                </h1>
                                <p className={`text-sm ${styles.textMuted} mt-0.5 hidden sm:block`}>
                                    Manage your account information and preferences
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4">
                            <button
                                onClick={toggleTheme}
                                className={`p-2 ${styles.hoverBg} rounded-lg transition-colors`}
                                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {theme === 'dark' ? <Sun className={`w-5 h-5 ${styles.textMuted}`} /> : <Moon className={`w-5 h-5 ${styles.textMuted}`} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="px-4 md:px-8 py-8">
                    <form onSubmit={handleSubmit}>
                        {/* Profile Completion Card */}
                    <div className={`${styles.cardBg} ${styles.border} rounded-xl p-5 mb-8`}>
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className={`text-sm font-medium ${styles.text}`}>Profile Completion</h3>
                                <p className={`text-xs ${styles.textMuted} mt-0.5`}>Complete your profile to unlock all features</p>
                            </div>
                            <div className="text-right">
                                <p className={`text-2xl font-semibold ${styles.text}`}>{completionPercentage}%</p>
                            </div>
                        </div>
                        <div className={`w-full ${styles.cardBgLight} rounded-full h-2`}>
                            <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{width: `${completionPercentage}%`}}></div>
                        </div>
                    </div>

                    {/* Profile Information Card */}
                    <div className={`${styles.cardBg} ${styles.border} rounded-xl p-6 md:p-8 mb-8`}>
                        <div className="mb-6">
                            <h2 className={`text-lg font-semibold ${styles.text}`}>Profile Information</h2>
                            <p className={`text-sm ${styles.textMuted} mt-1`}>Update your personal details</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 mb-8">
                            <div className="flex-shrink-0">
                                <div className={`w-24 h-24 ${styles.cardBgLight} rounded-full flex items-center justify-center border-2 ${styles.border}`}>
                                    <span className={`text-3xl font-semibold ${styles.text}`}>
                                        {user?.name?.charAt(0)?.toUpperCase() || 'B'}
                                    </span>
                                </div>
                                <div className="mt-3">
                                    <button className={`w-full ${styles.primary} ${styles.primaryText} text-sm font-medium px-4 py-2 rounded-lg transition-colors`}>
                                        Change Photo
                                    </button>
                                    <p className={`text-xs ${styles.textMuted} mt-2 text-center`}>
                                        JPG, PNG or GIF. Max size 2MB.
                                    </p>
                                </div>
                            </div>

                        <div className="flex-1">
                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className={`block text-xs font-medium ${styles.textMuted} mb-2`}>Full Name</label>
                                    <input 
                                        type="text" 
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={`w-full ${styles.inputBg} ${styles.inputBorder} ${styles.inputFocus} rounded-lg px-4 py-3 text-sm ${styles.text} transition-all duration-200`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-xs font-medium ${styles.textMuted} mb-2`}>Username</label>
                                    <input 
                                        type="text" 
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        className={`w-full ${styles.inputBg} ${styles.inputBorder} ${styles.inputFocus} rounded-lg px-4 py-3 text-sm ${styles.text} transition-all duration-200`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-xs font-medium ${styles.textMuted} mb-2`}>Email</label>
                                    <input 
                                        type="email" 
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={`w-full ${styles.inputBg} ${styles.inputBorder} ${styles.inputFocus} rounded-lg px-4 py-3 text-sm ${styles.text} transition-all duration-200`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-xs font-medium ${styles.textMuted} mb-2`}>Phone Number</label>
                                    <input 
                                        type="tel" 
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className={`w-full ${styles.inputBg} ${styles.inputBorder} ${styles.inputFocus} rounded-lg px-4 py-3 text-sm ${styles.text} transition-all duration-200`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-xs font-medium ${styles.textMuted} mb-2`}>Birthday</label>
                                    <input 
                                        type="date" 
                                        value={data.birthday}
                                        onChange={(e) => setData('birthday', e.target.value)}
                                        className={`w-full ${styles.inputBg} ${styles.inputBorder} ${styles.inputFocus} rounded-lg px-4 py-3 text-sm ${styles.text} transition-all duration-200`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-xs font-medium ${styles.textMuted} mb-2`}>Gender</label>
                                    <select 
                                        value={data.gender}
                                        onChange={(e) => setData('gender', e.target.value)}
                                        className={`w-full ${styles.inputBg} ${styles.inputBorder} ${styles.inputFocus} rounded-lg px-4 py-3 text-sm ${styles.text} transition-all duration-200`}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={`block text-xs font-medium ${styles.textMuted} mb-2`}>Preferred Language</label>
                                    <select 
                                        value={data.language}
                                        onChange={(e) => setData('language', e.target.value)}
                                        className={`w-full ${styles.inputBg} ${styles.inputBorder} ${styles.inputFocus} rounded-lg px-4 py-3 text-sm ${styles.text} transition-all duration-200`}
                                    >
                                        <option value="en">English</option>
                                        <option value="id">Indonesian</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={`block text-xs font-medium ${styles.textMuted} mb-2`}>Country</label>
                                    <select 
                                        value={data.country}
                                        onChange={(e) => setData('country', e.target.value)}
                                        className={`w-full ${styles.inputBg} ${styles.inputBorder} ${styles.inputFocus} rounded-lg px-4 py-3 text-sm ${styles.text} transition-all duration-200`}
                                    >
                                        <option value="">Select Country</option>
                                        <option value="ID">Indonesia</option>
                                        <option value="US">United States</option>
                                        <option value="SG">Singapore</option>
                                        <option value="MY">Malaysia</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className={`block text-xs font-medium ${styles.textMuted} mb-2`}>Bio</label>
                                    <textarea 
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                        rows={4}
                                        className={`w-full ${styles.inputBg} ${styles.inputBorder} ${styles.inputFocus} rounded-lg px-4 py-3 text-sm ${styles.text} transition-all duration-200 resize-none`}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button 
                                type="submit"
                                disabled={processing}
                                className={`${styles.primary} ${styles.primaryText} text-sm font-medium px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Save className="w-4 h-4" />
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                    </form>

                    {/* Bottom Information Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`${styles.cardBg} ${styles.border} rounded-xl p-5`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 ${styles.cardBgLight} rounded-lg flex items-center justify-center`}>
                                    <Shield className={`w-5 h-5 ${styles.textMuted}`} />
                                </div>
                                <div>
                                    <h4 className={`text-sm font-medium ${styles.text}`}>Secure Account</h4>
                                    <p className={`text-xs ${styles.textMuted} mt-0.5`}>Your data is protected</p>
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.cardBg} ${styles.border} rounded-xl p-5`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 ${styles.cardBgLight} rounded-lg flex items-center justify-center`}>
                                    <Lock className={`w-5 h-5 ${styles.textMuted}`} />
                                </div>
                                <div>
                                    <h4 className={`text-sm font-medium ${styles.text}`}>Privacy Control</h4>
                                    <p className={`text-xs ${styles.textMuted} mt-0.5`}>Manage your preferences</p>
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.cardBg} ${styles.border} rounded-xl p-5`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 ${styles.cardBgLight} rounded-lg flex items-center justify-center`}>
                                    <Bell className={`w-5 h-5 ${styles.textMuted}`} />
                                </div>
                                <div>
                                    <h4 className={`text-sm font-medium ${styles.text}`}>Stay Updated</h4>
                                    <p className={`text-xs ${styles.textMuted} mt-0.5`}>Get latest news & offers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}