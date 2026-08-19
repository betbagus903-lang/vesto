import { useState } from 'react';
import AdminLayout from '../../Components/Admin/AdminLayout';
import { Shield, Mail, Globe, Save, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../Context/ThemeContext';

export default function AdminSettings() {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState('general');
    const [showPassword, setShowPassword] = useState(false);

    const darkBg = theme === 'dark' ? 'bg-[#0a0f1a]' : 'bg-gray-50';
    const darkCardBg = theme === 'dark' ? 'bg-[#111827]' : 'bg-white';
    const darkBorder = theme === 'dark' ? 'border-[#1f2937]' : 'border-gray-200';
    const darkText = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const darkTextMuted = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    const darkInputBg = theme === 'dark' ? 'bg-[#1f2937]' : 'bg-gray-100';
    const darkInputBorder = theme === 'dark' ? 'border-[#374151]' : 'border-gray-300';

    return (
        <AdminLayout title="Settings">
            <div className={darkBg + " min-h-screen p-6"}>
                <div className="mb-6">
                    <h1 className={"text-2xl font-bold " + darkText + " mb-2"}>Settings</h1>
                    <p className={"text-sm " + darkTextMuted}>Manage your application settings</p>
                </div>

                <div className={darkCardBg + " " + darkBorder + " rounded-xl mb-6"}>
                    <div className={"flex border-b " + darkBorder}>
                        <button
                            onClick={() => setActiveTab('general')}
                            className={"flex items-center gap-2 px-6 py-4 font-medium transition-colors " + 
                                (activeTab === 'general' ? 'text-[#3b82f6] border-b-2 border-[#3b82f6]' : darkTextMuted + " hover:" + darkText)}
                        >
                            <Globe className="w-4 h-4" />
                            General
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={"flex items-center gap-2 px-6 py-4 font-medium transition-colors " + 
                                (activeTab === 'security' ? 'text-[#3b82f6] border-b-2 border-[#3b82f6]' : darkTextMuted + " hover:" + darkText)}
                        >
                            <Shield className="w-4 h-4" />
                            Security
                        </button>
                        <button
                            onClick={() => setActiveTab('email')}
                            className={"flex items-center gap-2 px-6 py-4 font-medium transition-colors " + 
                                (activeTab === 'email' ? 'text-[#3b82f6] border-b-2 border-[#3b82f6]' : darkTextMuted + " hover:" + darkText)}
                        >
                            <Mail className="w-4 h-4" />
                            Email
                        </button>
                    </div>
                </div>

                <div className={darkCardBg + " " + darkBorder + " rounded-xl p-6"}>
                    {activeTab === 'general' && (
                        <div>
                            <h2 className={"text-lg font-semibold " + darkText + " mb-6 flex items-center gap-2"}>
                                <Globe className="w-5 h-5" />
                                General Settings
                            </h2>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={"block text-sm font-medium " + darkText + " mb-2"}>
                                            Application Name
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue="Vesto"
                                            className={"w-full px-4 py-2.5 rounded-lg " + darkInputBg + " " + darkInputBorder + " focus:border-[#3b82f6] focus:ring-[#3b82f6] " + darkText + " outline-none transition-all"}
                                        />
                                    </div>
                                    <div>
                                        <label className={"block text-sm font-medium " + darkText + " mb-2"}>
                                            Site URL
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue="https://vesto.com"
                                            className={"w-full px-4 py-2.5 rounded-lg " + darkInputBg + " " + darkInputBorder + " focus:border-[#3b82f6] focus:ring-[#3b82f6] " + darkText + " outline-none transition-all"}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={"block text-sm font-medium " + darkText + " mb-2"}>
                                        Default Language
                                    </label>
                                    <select
                                        className={"w-full px-4 py-2.5 rounded-lg " + darkInputBg + " " + darkInputBorder + " focus:border-[#3b82f6] focus:ring-[#3b82f6] " + darkText + " outline-none transition-all"}
                                    >
                                        <option>English</option>
                                        <option>Indonesian</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3b82f6] text-white font-medium rounded-lg hover:bg-[#2563eb] transition-colors">
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div>
                            <h2 className={"text-lg font-semibold " + darkText + " mb-6 flex items-center gap-2"}>
                                <Shield className="w-5 h-5" />
                                Security Settings
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className={"block text-sm font-medium " + darkText + " mb-2"}>
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className={"w-full px-4 py-2.5 rounded-lg " + darkInputBg + " " + darkInputBorder + " focus:border-[#3b82f6] focus:ring-[#3b82f6] " + darkText + " outline-none transition-all pr-10"}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2"
                                        >
                                            {showPassword ? (
                                                <EyeOff className={"w-4 h-4 " + darkTextMuted} />
                                            ) : (
                                                <Eye className={"w-4 h-4 " + darkTextMuted} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3b82f6] text-white font-medium rounded-lg hover:bg-[#2563eb] transition-colors">
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'email' && (
                        <div>
                            <h2 className={"text-lg font-semibold " + darkText + " mb-6 flex items-center gap-2"}>
                                <Mail className="w-5 h-5" />
                                Email Settings
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className={"block text-sm font-medium " + darkText + " mb-2"}>
                                        Mail Driver
                                    </label>
                                    <select
                                        className={"w-full px-4 py-2.5 rounded-lg " + darkInputBg + " " + darkInputBorder + " focus:border-[#3b82f6] focus:ring-[#3b82f6] " + darkText + " outline-none transition-all"}
                                    >
                                        <option>SMTP</option>
                                        <option>Sendmail</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3b82f6] text-white font-medium rounded-lg hover:bg-[#2563eb] transition-colors">
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
