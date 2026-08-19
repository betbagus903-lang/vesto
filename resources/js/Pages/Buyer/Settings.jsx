import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { useBuyerTheme } from '../../Context/BuyerThemeContext';
import { Settings as SettingsIcon, Bell, Mail, Globe, Moon, Sun, Save, Menu, X } from 'lucide-react';
import AccountSidebar from '../../Components/Buyer/AccountSidebar';

export default function Settings() {
    const { auth } = usePage().props;
    const { theme, toggleTheme } = useBuyerTheme();
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const themeStyles = {
        dark: {
            bg: 'bg-[#0a0f1a]',
            headerBg: 'bg-[#0a1628]',
            border: 'border-white/10',
            text: 'text-white',
            textMuted: 'text-white/50',
            textMutedLight: 'text-white/40',
            cardBg: 'bg-white/5',
            cardBgLight: 'bg-white/10',
            hoverBg: 'hover:bg-white/10',
            inputBg: 'bg-[#1e3a5f]',
        },
        light: {
            bg: 'bg-gray-50',
            headerBg: 'bg-white',
            border: 'border-gray-200',
            text: 'text-gray-900',
            textMuted: 'text-gray-600',
            textMutedLight: 'text-gray-400',
            cardBg: 'bg-white',
            cardBgLight: 'bg-gray-100',
            hoverBg: 'hover:bg-gray-100',
            inputBg: 'bg-gray-100',
        },
    };

    const styles = themeStyles[theme];
    
    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
        smsNotifications: false,
        orderUpdates: true,
        promotionalEmails: false,
        newsletter: true,
        language: 'id',
        currency: 'IDR',
        darkMode: false,
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        setIsSaving(true);

        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 1500);
    };

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
                <AccountSidebar activeMenu="settings" />
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <AccountSidebar activeMenu="settings" />
            </div>

            <div className="flex-1 min-h-screen transition-all duration-300 lg:ml-72 ml-0">
                {/* Top Header */}
                <div className={`${styles.headerBg} border-b ${styles.border} px-4 md:px-6 py-4 sticky top-0 z-40`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className={`lg:hidden p-2 ${styles.hoverBg} rounded-lg transition-colors`}
                            >
                                {sidebarOpen ? <X className={`w-5 h-5 ${styles.text}`} /> : <Menu className={`w-5 h-5 ${styles.text}`} />}
                            </button>
                            <div>
                                <h1 className={`text-lg md:text-xl font-bold ${styles.text}`}>
                                    Settings
                                </h1>
                                <p className={`text-xs md:text-sm ${styles.textMuted} mt-0.5 hidden sm:block`}>
                                    Manage your preferences
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

                <div className="px-6 py-6">
                    <h1 className={`text-2xl font-bold ${styles.text} mb-6`}>Settings</h1>

                    {saveSuccess && (
                        <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center gap-2">
                            <Save className="w-5 h-5 text-emerald-400" />
                            <p className="text-sm text-emerald-400">Settings saved successfully!</p>
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Notification Preferences */}
                        <div className={`${styles.cardBg} ${styles.border} rounded-xl p-6`}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-[#3b82f6]/20 rounded-lg">
                                    <Bell className="w-6 h-6 text-[#3b82f6]" />
                                </div>
                                <div>
                                    <h2 className={`text-lg font-semibold ${styles.text}`}>Notification Preferences</h2>
                                    <p className={`text-sm ${styles.textMuted}`}>Choose how you want to be notified</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className={`flex items-center justify-between p-4 ${styles.cardBgLight} rounded-lg`}>
                                    <div className="flex items-center gap-3">
                                        <Mail className={`w-5 h-5 ${styles.textMutedLight}`} />
                                        <div>
                                            <h3 className={`font-medium ${styles.text}`}>Email Notifications</h3>
                                            <p className={`text-sm ${styles.textMuted}`}>Receive notifications via email</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleToggle('emailNotifications')}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            settings.emailNotifications ? 'bg-[#3b82f6]' : 'bg-gray-600'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                            settings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                    </button>
                                </div>

                                <div className={`flex items-center justify-between p-4 ${styles.cardBgLight} rounded-lg`}>
                                    <div className="flex items-center gap-3">
                                        <Bell className={`w-5 h-5 ${styles.textMutedLight}`} />
                                        <div>
                                            <h3 className={`font-medium ${styles.text}`}>Push Notifications</h3>
                                            <p className={`text-sm ${styles.textMuted}`}>Receive push notifications in browser</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleToggle('pushNotifications')}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            settings.pushNotifications ? 'bg-[#3b82f6]' : 'bg-gray-600'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                            settings.pushNotifications ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                    </button>
                                </div>

                                <div className={`flex items-center justify-between p-4 ${styles.cardBgLight} rounded-lg`}>
                                    <div className="flex items-center gap-3">
                                        <Mail className={`w-5 h-5 ${styles.textMutedLight}`} />
                                        <div>
                                            <h3 className={`font-medium ${styles.text}`}>SMS Notifications</h3>
                                            <p className={`text-sm ${styles.textMuted}`}>Receive notifications via SMS</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleToggle('smsNotifications')}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            settings.smsNotifications ? 'bg-[#3b82f6]' : 'bg-gray-600'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                            settings.smsNotifications ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Email Preferences */}
                        <div className={`${styles.cardBg} ${styles.border} rounded-xl p-6`}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-[#3b82f6]/20 rounded-lg">
                                    <Mail className="w-6 h-6 text-[#3b82f6]" />
                                </div>
                                <div>
                                    <h2 className={`text-lg font-semibold ${styles.text}`}>Email Preferences</h2>
                                    <p className={`text-sm ${styles.textMuted}`}>Manage your email subscription</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className={`flex items-center justify-between p-4 ${styles.cardBgLight} rounded-lg`}>
                                    <div>
                                        <h3 className={`font-medium ${styles.text}`}>Order Updates</h3>
                                        <p className={`text-sm ${styles.textMuted}`}>Get notified about your order status</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleToggle('orderUpdates')}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            settings.orderUpdates ? 'bg-[#3b82f6]' : 'bg-gray-600'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                            settings.orderUpdates ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                    </button>
                                </div>

                                <div className={`flex items-center justify-between p-4 ${styles.cardBgLight} rounded-lg`}>
                                    <div>
                                        <h3 className={`font-medium ${styles.text}`}>Promotional Emails</h3>
                                        <p className={`text-sm ${styles.textMuted}`}>Receive special offers and promotions</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleToggle('promotionalEmails')}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            settings.promotionalEmails ? 'bg-[#3b82f6]' : 'bg-gray-600'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                            settings.promotionalEmails ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                    </button>
                                </div>

                                <div className={`flex items-center justify-between p-4 ${styles.cardBgLight} rounded-lg`}>
                                    <div>
                                        <h3 className={`font-medium ${styles.text}`}>Newsletter</h3>
                                        <p className={`text-sm ${styles.textMuted}`}>Subscribe to our newsletter</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleToggle('newsletter')}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            settings.newsletter ? 'bg-[#3b82f6]' : 'bg-gray-600'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                            settings.newsletter ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Language & Currency */}
                        <div className={`${styles.cardBg} ${styles.border} rounded-xl p-6`}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-[#3b82f6]/20 rounded-lg">
                                    <Globe className="w-6 h-6 text-[#3b82f6]" />
                                </div>
                                <div>
                                    <h2 className={`text-lg font-semibold ${styles.text}`}>Language & Currency</h2>
                                    <p className={`text-sm ${styles.textMuted}`}>Set your preferred language and currency</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium ${styles.textMutedLight} mb-2`}>Language</label>
                                    <select
                                        value={settings.language}
                                        onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                                        className={`w-full px-4 py-3 ${styles.inputBg} ${styles.border} rounded-lg ${styles.text} focus:outline-none focus:border-[#3b82f6]`}
                                    >
                                        <option value="id">Indonesian</option>
                                        <option value="en">English</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${styles.textMutedLight} mb-2`}>Currency</label>
                                    <select
                                        value={settings.currency}
                                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                        className={`w-full px-4 py-3 ${styles.inputBg} ${styles.border} rounded-lg ${styles.text} focus:outline-none focus:border-[#3b82f6]`}
                                    >
                                        <option value="IDR">Indonesian Rupiah (IDR)</option>
                                        <option value="USD">US Dollar (USD)</option>
                                        <option value="EUR">Euro (EUR)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Appearance */}
                        <div className={`${styles.cardBg} ${styles.border} rounded-xl p-6`}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-[#3b82f6]/20 rounded-lg">
                                    <SettingsIcon className="w-6 h-6 text-[#3b82f6]" />
                                </div>
                                <div>
                                    <h2 className={`text-lg font-semibold ${styles.text}`}>Appearance</h2>
                                    <p className={`text-sm ${styles.textMuted}`}>Customize your viewing experience</p>
                                </div>
                            </div>

                            <div className={`flex items-center justify-between p-4 ${styles.cardBgLight} rounded-lg`}>
                                <div className="flex items-center gap-3">
                                    {settings.darkMode ? <Moon className={`w-5 h-5 ${styles.textMutedLight}`} /> : <Sun className={`w-5 h-5 ${styles.textMutedLight}`} />}
                                    <div>
                                        <h3 className={`font-medium ${styles.text}`}>Dark Mode</h3>
                                        <p className={`text-sm ${styles.textMuted}`}>Switch between light and dark theme</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleToggle('darkMode')}
                                    className={`w-12 h-6 rounded-full transition-colors ${
                                        settings.darkMode ? 'bg-[#3b82f6]' : 'bg-gray-600'
                                    }`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                        settings.darkMode ? 'translate-x-6' : 'translate-x-0.5'
                                    }`} />
                                </button>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-6 py-3 bg-[#3b82f6] text-white font-semibold rounded-lg hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                {isSaving ? 'Saving...' : (
                                    <>
                                        <Save size={18} />
                                        Save Settings
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
