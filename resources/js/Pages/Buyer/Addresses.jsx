import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { useBuyerTheme } from '../../Context/BuyerThemeContext';
import AccountSidebar from '../../Components/Buyer/AccountSidebar';
import { Moon, Sun, Menu, X } from 'lucide-react';

export default function Addresses() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const { theme, toggleTheme } = useBuyerTheme();
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

    const [addresses, setAddresses] = useState([
        {
            id: 1,
            label: 'Home',
            recipient: 'John Doe',
            phone: '+62 812 3456 7890',
            address: 'Jl. Sudirman No. 123',
            city: 'Jakarta',
            province: 'DKI Jakarta',
            postalCode: '12345',
            isDefault: true,
        },
        {
            id: 2,
            label: 'Office',
            recipient: 'John Doe',
            phone: '+62 812 3456 7890',
            address: 'Jl. Thamrin No. 456',
            city: 'Jakarta',
            province: 'DKI Jakarta',
            postalCode: '12346',
            isDefault: false,
        },
    ]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    const handleSetDefault = (id) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        })));
    };

    const handleDelete = (id) => {
        setAddresses(addresses.filter(addr => addr.id !== id));
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        setShowAddForm(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (editingAddress) {
            setAddresses(addresses.map(addr => 
                addr.id === editingAddress.id ? editingAddress : addr
            ));
        } else {
            const newAddress = {
                id: Date.now(),
                label: 'New Address',
                recipient: 'New Recipient',
                phone: '+62 812 3456 7890',
                address: 'New Address',
                city: 'Jakarta',
                province: 'DKI Jakarta',
                postalCode: '12347',
                isDefault: false,
            };
            setAddresses([...addresses, newAddress]);
        }
        setShowAddForm(false);
        setEditingAddress(null);
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
                <AccountSidebar activeMenu="addresses" />
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <AccountSidebar activeMenu="addresses" />
            </div>

            {/* Main Content */}
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
                                    Addresses
                                </h1>
                                <p className={`text-xs md:text-sm ${styles.textMuted} mt-0.5 hidden sm:block`}>
                                    Manage your delivery addresses
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
                    <div className="mb-6">
                        <h1 className={`text-xl font-semibold ${styles.text}`}>
                            Addresses
                        </h1>
                        <p className={`text-sm ${styles.textMutedLight} mt-1`}>Manage your shipping addresses</p>
                    </div>

                    {showAddForm ? (
                        <div className={`${styles.cardBg} ${styles.border} rounded-lg p-4 mb-6`}>
                            <h3 className={`text-sm font-medium ${styles.text} mb-4`}>
                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                            </h3>
                            <form onSubmit={handleSave}>
                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className={`block text-xs ${styles.textMuted} mb-1`}>Label</label>
                                        <input 
                                            type="text" 
                                            defaultValue={editingAddress?.label || ''}
                                            className={`w-full ${styles.inputBg} ${styles.border} rounded px-3 py-2 text-sm ${styles.text} focus:outline-none focus:border-violet-500/50`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-xs ${styles.textMuted} mb-1`}>Recipient Name</label>
                                        <input 
                                            type="text" 
                                            defaultValue={editingAddress?.recipient || ''}
                                            className={`w-full ${styles.inputBg} ${styles.border} rounded px-3 py-2 text-sm ${styles.text} focus:outline-none focus:border-violet-500/50`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-xs ${styles.textMuted} mb-1`}>Phone Number</label>
                                        <input 
                                            type="tel" 
                                            defaultValue={editingAddress?.phone || ''}
                                            className={`w-full ${styles.inputBg} ${styles.border} rounded px-3 py-2 text-sm ${styles.text} focus:outline-none focus:border-violet-500/50`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-xs ${styles.textMuted} mb-1`}>City</label>
                                        <input 
                                            type="text" 
                                            defaultValue={editingAddress?.city || ''}
                                            className={`w-full ${styles.inputBg} ${styles.border} rounded px-3 py-2 text-sm ${styles.text} focus:outline-none focus:border-violet-500/50`}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={`block text-xs ${styles.textMuted} mb-1`}>Address</label>
                                        <input 
                                            type="text" 
                                            defaultValue={editingAddress?.address || ''}
                                            className={`w-full ${styles.inputBg} ${styles.border} rounded px-3 py-2 text-sm ${styles.text} focus:outline-none focus:border-violet-500/50`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-xs ${styles.textMuted} mb-1`}>Province</label>
                                        <input 
                                            type="text" 
                                            defaultValue={editingAddress?.province || ''}
                                            className={`w-full ${styles.inputBg} ${styles.border} rounded px-3 py-2 text-sm ${styles.text} focus:outline-none focus:border-violet-500/50`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-xs ${styles.textMuted} mb-1`}>Postal Code</label>
                                        <input 
                                            type="text" 
                                            defaultValue={editingAddress?.postalCode || ''}
                                            className={`w-full ${styles.inputBg} ${styles.border} rounded px-3 py-2 text-sm ${styles.text} focus:outline-none focus:border-violet-500/50`}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        type="submit"
                                        className={`bg-white text-black text-xs font-medium px-4 py-2 rounded hover:bg-gray-200 transition-colors`}
                                    >
                                        Save Address
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setEditingAddress(null);
                                        }}
                                        className={`bg-gray-700 ${styles.text} text-xs font-medium px-4 py-2 rounded hover:bg-gray-600 transition-colors`}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setShowAddForm(true)}
                            className={`bg-white text-black text-xs font-medium px-4 py-2 rounded hover:bg-gray-200 transition-colors mb-6`}
                        >
                            + Add New Address
                        </button>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                        {addresses.map((address) => (
                            <div key={address.id} className={`${styles.cardBg} ${styles.border} rounded-lg p-4`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className={`text-sm font-medium ${styles.text}`}>{address.label}</h3>
                                            {address.isDefault && (
                                                <span className={`bg-gray-700 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-xs px-2 py-0.5 rounded`}>
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-xs ${styles.text}`}>{address.recipient}</p>
                                        <p className={`text-xs ${styles.textMutedLight}`}>{address.phone}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleEdit(address)}
                                            className={`${styles.textMutedLight} hover:${styles.text} transition-colors`}
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(address.id)}
                                            className={`${styles.textMutedLight} hover:text-red-400 transition-colors`}
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-0.5 mb-3">
                                    <p className={`text-xs ${styles.textMutedLight}`}>{address.address}</p>
                                    <p className={`text-xs ${styles.textMutedLight}`}>{address.city}, {address.province}</p>
                                    <p className={`text-xs ${styles.textMutedLight}`}>{address.postalCode}</p>
                                </div>
                                {!address.isDefault && (
                                    <button 
                                        onClick={() => handleSetDefault(address.id)}
                                        className={`${styles.inputBg} ${styles.border} ${styles.text} text-xs font-medium px-3 py-1.5 rounded hover:border-violet-500/50 transition-colors`}
                                    >
                                        Set as Default
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}