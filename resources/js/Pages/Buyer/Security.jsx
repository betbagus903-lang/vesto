import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Shield, Lock, Eye, EyeOff, Check, AlertTriangle } from 'lucide-react';
import AccountSidebar from '../../Components/Buyer/AccountSidebar';

export default function Security() {
    const { auth } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        setIsUpdating(true);

        // Simulate API call
        setTimeout(() => {
            setIsUpdating(false);
            setUpdateSuccess(true);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setUpdateSuccess(false), 3000);
        }, 1500);
    };

    const securitySettings = [
        { id: 1, name: 'Two-Factor Authentication', status: 'disabled', description: 'Add an extra layer of security to your account' },
        { id: 2, name: 'Login Alerts', status: 'enabled', description: 'Get notified when someone logs into your account' },
        { id: 3, name: 'Session Timeout', status: 'enabled', description: 'Automatically log out after 30 minutes of inactivity' },
    ];

    const activeSessions = [
        { id: 1, device: 'Chrome on Windows', location: 'Jakarta, Indonesia', lastActive: '2 minutes ago', current: true },
        { id: 2, device: 'Safari on iPhone', location: 'Jakarta, Indonesia', lastActive: '2 hours ago', current: false },
        { id: 3, device: 'Firefox on Mac', location: 'Bandung, Indonesia', lastActive: '3 days ago', current: false },
    ];

    return (
        <div className="min-h-screen flex bg-[#0f172a]" style={{fontFamily: "'Inter', sans-serif"}}>
            <AccountSidebar activeMenu="security" />

            <div className="ml-72 flex-1 min-h-screen">
                <div className="px-6 py-6">
                    <h1 className="text-2xl font-bold text-white mb-6">Security</h1>

                    {/* Change Password */}
                    <div className="bg-[#1e3a5f] border border-[#1e3a5f] rounded-xl p-6 mb-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-[#3b82f6]/20 rounded-lg">
                                <Lock className="w-6 h-6 text-[#3b82f6]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Change Password</h2>
                                <p className="text-sm text-gray-400">Update your password to keep your account secure</p>
                            </div>
                        </div>

                        {updateSuccess && (
                            <div className="mb-4 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center gap-2">
                                <Check className="w-5 h-5 text-emerald-400" />
                                <p className="text-sm text-emerald-400">Password updated successfully!</p>
                            </div>
                        )}

                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#0a1628] border border-[#1e3a5f] rounded-lg text-white focus:outline-none focus:border-[#3b82f6]"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#0a1628] border border-[#1e3a5f] rounded-lg text-white focus:outline-none focus:border-[#3b82f6]"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#0a1628] border border-[#1e3a5f] rounded-lg text-white focus:outline-none focus:border-[#3b82f6]"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="px-6 py-3 bg-[#3b82f6] text-white font-semibold rounded-lg hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isUpdating ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>

                    {/* Security Settings */}
                    <div className="bg-[#1e3a5f] border border-[#1e3a5f] rounded-xl p-6 mb-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-[#3b82f6]/20 rounded-lg">
                                <Shield className="w-6 h-6 text-[#3b82f6]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Security Settings</h2>
                                <p className="text-sm text-gray-400">Manage your account security preferences</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {securitySettings.map((setting) => (
                                <div key={setting.id} className="flex items-center justify-between p-4 bg-[#0a1628] rounded-lg">
                                    <div>
                                        <h3 className="font-medium text-white">{setting.name}</h3>
                                        <p className="text-sm text-gray-400">{setting.description}</p>
                                    </div>
                                    <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        setting.status === 'enabled'
                                            ? 'bg-emerald-500/20 text-emerald-400'
                                            : 'bg-gray-700 text-gray-400'
                                    }`}>
                                        {setting.status === 'enabled' ? 'Enabled' : 'Enable'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Sessions */}
                    <div className="bg-[#1e3a5f] border border-[#1e3a5f] rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-[#3b82f6]/20 rounded-lg">
                                    <Shield className="w-6 h-6 text-[#3b82f6]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">Active Sessions</h2>
                                    <p className="text-sm text-gray-400">Manage devices logged into your account</p>
                                </div>
                            </div>
                            <button className="text-sm text-red-400 hover:text-red-300 transition-colors">
                                Sign out all other sessions
                            </button>
                        </div>

                        <div className="space-y-3">
                            {activeSessions.map((session) => (
                                <div key={session.id} className="flex items-center justify-between p-4 bg-[#0a1628] rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                                            <span className="text-xl">💻</span>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-white">{session.device}</h3>
                                            <p className="text-sm text-gray-400">{session.location}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {session.current && (
                                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                                                Current
                                            </span>
                                        )}
                                        <p className="text-xs text-gray-500 mt-1">{session.lastActive}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
