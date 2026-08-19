import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { useBuyerTheme } from '../../Context/BuyerThemeContext';
import AccountSidebar from '../../Components/Buyer/AccountSidebar';
import { Moon, Sun, Menu, X } from 'lucide-react';

export default function PaymentMethods() {
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

    const [paymentMethods, setPaymentMethods] = useState([
        {
            id: 1,
            type: 'credit_card',
            name: 'Visa ending in 4242',
            cardNumber: '**** **** **** 4242',
            expiryDate: '12/25',
            isDefault: true,
        },
        {
            id: 2,
            type: 'debit_card',
            name: 'Mastercard ending in 8888',
            cardNumber: '**** **** **** 8888',
            expiryDate: '08/24',
            isDefault: false,
        },
    ]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedType, setSelectedType] = useState('credit_card');

    const handleSetDefault = (id) => {
        setPaymentMethods(paymentMethods.map(method => ({
            ...method,
            isDefault: method.id === id
        })));
    };

    const handleDelete = (id) => {
        setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    };

    const handleSave = (e) => {
        e.preventDefault();
        const newMethod = {
            id: Date.now(),
            type: selectedType,
            name: 'New Payment Method',
            isDefault: false,
        };
        setPaymentMethods([...paymentMethods, newMethod]);
        setShowAddForm(false);
    };

    const getIcon = (type) => {
        switch(type) {
            case 'credit_card':
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                );
            case 'debit_card':
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                );
            default:
                return null;
        }
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
                <AccountSidebar activeMenu="payment" />
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <AccountSidebar activeMenu="payment" />
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
                                    Payment Methods
                                </h1>
                                <p className={`text-xs md:text-sm ${styles.textMuted} mt-0.5 hidden sm:block`}>
                                    Manage your payment options
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
                            Payment Methods
                        </h1>
                        <p className={`text-sm ${styles.textMutedLight} mt-1`}>Manage your payment options</p>
                    </div>

                    {showAddForm ? (
                        <div className={`${styles.cardBg} ${styles.border} rounded-lg p-4 mb-6`}>
                            <h3 className={`text-sm font-medium ${styles.text} mb-4`}>Add New Payment Method</h3>
                            <form onSubmit={handleSave}>
                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className={`block text-xs ${styles.textMuted} mb-1`}>Name on Card</label>
                                        <input 
                                            type="text" 
                                            className={`w-full ${styles.inputBg} ${styles.border} rounded px-3 py-2 text-sm ${styles.text} focus:outline-none focus:border-violet-500/50`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-xs ${styles.textMuted} mb-1`}>Card Number</label>
                                        <input 
                                            type="text" 
                                            className={`w-full ${styles.inputBg} ${styles.border} rounded px-3 py-2 text-sm ${styles.text} focus:outline-none focus:border-violet-500/50`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-xs ${styles.textMuted} mb-1`}>Expiry Date</label>
                                        <input 
                                            type="text" 
                                            placeholder="MM/YY"
                                            className={`w-full ${styles.inputBg} ${styles.border} rounded px-3 py-2 text-sm ${styles.text} focus:outline-none focus:border-violet-500/50`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-xs ${styles.textMuted} mb-1`}>CVV</label>
                                        <input 
                                            type="text" 
                                            placeholder="123"
                                            className={`w-full ${styles.inputBg} ${styles.border} rounded px-3 py-2 text-sm ${styles.text} focus:outline-none focus:border-violet-500/50`}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button 
                                        type="submit"
                                        className={`bg-white text-black text-xs font-medium px-4 py-2 rounded hover:bg-gray-200 transition-colors`}
                                    >
                                        Add Payment Method
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
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
                            + Add New Payment Method
                        </button>
                    )}

                    <div className="space-y-3">
                        {paymentMethods.map((method) => (
                            <div key={method.id} className={`${styles.cardBg} ${styles.border} rounded-lg p-4`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 ${styles.cardBgLight} rounded flex items-center justify-center`}>
                                            <div className={styles.textMutedLight}>
                                                {getIcon(method.type)}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className={`text-sm font-medium ${styles.text}`}>{method.name}</h3>
                                            <p className={`text-xs ${styles.textMutedLight}`}>{method.cardNumber}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {method.isDefault && (
                                            <span className={`bg-gray-700 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-xs px-2 py-0.5 rounded`}>
                                                Default
                                            </span>
                                        )}
                                        <button 
                                            onClick={() => handleDelete(method.id)}
                                            className={`${styles.textMutedLight} hover:text-red-400 transition-colors`}
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
