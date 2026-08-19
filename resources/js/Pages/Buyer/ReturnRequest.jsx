import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Package, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import AccountSidebar from '../../Components/Buyer/AccountSidebar';

function fmt(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
    }).format(value ?? 0);
}

export default function ReturnRequest({ order = null }) {
    const { auth } = usePage().props;
    const [step, setStep] = useState(1);
    const [returnType, setReturnType] = useState('');
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const RETURN_REASONS = [
        'Item arrived damaged',
        'Item is defective',
        'Wrong item received',
        'Item not as described',
        'Item does not fit',
        'Changed my mind',
        'Other',
    ];

    const handleNext = () => {
        if (step === 1 && returnType) setStep(2);
        else if (step === 2 && reason) setStep(3);
        else if (step === 3 && selectedItems.length > 0) setStep(4);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
        }, 1500);
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex bg-[#0f172a]" style={{fontFamily: "'Inter', sans-serif"}}>
                <AccountSidebar activeMenu="orders" />
                <div className="ml-72 flex-1 min-h-screen">
                    <div className="px-6 py-6">
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-[#1e293b] rounded-2xl p-8 text-center">
                                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-white mb-2">Return Request Submitted</h2>
                                <p className="text-gray-400 mb-6">
                                    Your return request has been submitted successfully. We will review it and get back to you within 2-3 business days.
                                </p>
                                <Link
                                    href="/buyer/orders"
                                    className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Orders
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-[#0f172a]" style={{fontFamily: "'Inter', sans-serif"}}>
            <AccountSidebar activeMenu="orders" />

            <div className="ml-72 flex-1 min-h-screen">
                <div className="px-6 py-6">
                    <div className="max-w-2xl mx-auto">
                        {/* Header */}
                        <div className="mb-6">
                            <Link href="/buyer/orders" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Orders
                            </Link>
                            <h1 className="text-2xl font-bold text-white">Request Return / Refund</h1>
                        </div>

                        {/* Progress */}
                        <div className="flex items-center justify-between mb-8">
                            {[1, 2, 3, 4].map((s) => (
                                <div key={s} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        step >= s ? 'bg-gray-900 text-white' : 'bg-gray-700 text-gray-400'
                                    }`}>
                                        {s}
                                    </div>
                                    {s < 4 && <div className={`w-16 h-1 mx-2 ${step > s ? 'bg-gray-900' : 'bg-gray-700'}`} />}
                                </div>
                            ))}
                        </div>

                        <div className="bg-[#1e293b] rounded-2xl p-8">
                            {/* Step 1: Return Type */}
                            {step === 1 && (
                                <div>
                                    <h2 className="text-lg font-semibold text-white mb-4">What type of return do you need?</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setReturnType('refund')}
                                            className={`p-6 rounded-xl border-2 transition-all ${
                                                returnType === 'refund'
                                                    ? 'border-gray-900 bg-gray-900/20'
                                                    : 'border-gray-700 hover:border-gray-600'
                                            }`}
                                        >
                                            <RefreshCw className={`w-8 h-8 mb-3 ${returnType === 'refund' ? 'text-gray-900' : 'text-gray-500'}`} />
                                            <h3 className="font-semibold text-white mb-1">Refund</h3>
                                            <p className="text-sm text-gray-400">Get your money back</p>
                                        </button>
                                        <button
                                            onClick={() => setReturnType('exchange')}
                                            className={`p-6 rounded-xl border-2 transition-all ${
                                                returnType === 'exchange'
                                                    ? 'border-gray-900 bg-gray-900/20'
                                                    : 'border-gray-700 hover:border-gray-600'
                                            }`}
                                        >
                                            <Package className={`w-8 h-8 mb-3 ${returnType === 'exchange' ? 'text-gray-900' : 'text-gray-500'}`} />
                                            <h3 className="font-semibold text-white mb-1">Exchange</h3>
                                            <p className="text-sm text-gray-400">Get a different item</p>
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleNext}
                                        disabled={!returnType}
                                        className="mt-6 w-full bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Continue
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Reason */}
                            {step === 2 && (
                                <div>
                                    <h2 className="text-lg font-semibold text-white mb-4">Why are you returning this item?</h2>
                                    <div className="space-y-3 mb-6">
                                        {RETURN_REASONS.map((r) => (
                                            <button
                                                key={r}
                                                onClick={() => setReason(r)}
                                                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                                                    reason === r
                                                        ? 'border-gray-900 bg-gray-900/20'
                                                        : 'border-gray-700 hover:border-gray-600'
                                                }`}
                                            >
                                                <span className="text-white">{r}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="flex-1 bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            disabled={!reason}
                                            className="flex-1 bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Select Items */}
                            {step === 3 && (
                                <div>
                                    <h2 className="text-lg font-semibold text-white mb-4">Select items to return</h2>
                                    <div className="space-y-3 mb-6">
                                        {order?.items?.map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setSelectedItems(prev =>
                                                        prev.includes(index)
                                                            ? prev.filter(i => i !== index)
                                                            : [...prev, index]
                                                    );
                                                }}
                                                className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                                                    selectedItems.includes(index)
                                                        ? 'border-gray-900 bg-gray-900/20'
                                                        : 'border-gray-700 hover:border-gray-600'
                                                }`}
                                            >
                                                <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="w-6 h-6 text-gray-600" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="text-white font-medium">{item.name}</p>
                                                    <p className="text-sm text-gray-400">{fmt(item.price)}</p>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                    selectedItems.includes(index)
                                                        ? 'border-gray-900 bg-gray-900'
                                                        : 'border-gray-600'
                                                }`}>
                                                    {selectedItems.includes(index) && (
                                                        <CheckCircle className="w-4 h-4 text-white" />
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setStep(2)}
                                            className="flex-1 bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            disabled={selectedItems.length === 0}
                                            className="flex-1 bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Additional Details */}
                            {step === 4 && (
                                <form onSubmit={handleSubmit}>
                                    <h2 className="text-lg font-semibold text-white mb-4">Additional details</h2>
                                    
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Description (optional)
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Please provide any additional details about your return..."
                                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 resize-none"
                                            rows={4}
                                        />
                                    </div>

                                    <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4 mb-6">
                                        <div className="flex gap-3">
                                            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-blue-300 font-medium mb-1">Return Policy</p>
                                                <p className="text-xs text-blue-400">
                                                    Items must be returned within 30 days of delivery. Items must be in original condition with tags attached.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setStep(3)}
                                            className="flex-1 bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
