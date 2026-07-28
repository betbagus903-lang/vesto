import BuyerLayout from '@/Layouts/BuyerLayout';
import { useState } from 'react';

export default function Addresses() {
    const [showForm, setShowForm] = useState(false);

    return (
        <BuyerLayout title="Addresses">
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                    <div>
                        <h1 className="text-xl font-black text-gray-900">Addresses</h1>
                        <p className="text-sm text-gray-400 mt-1">Manage your shipping addresses</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="text-sm font-bold bg-gray-900 text-white px-4 py-2.5 rounded-xl hover:bg-gray-700 transition-colors">
                        + Add Address
                    </button>
                </div>

                {/* Add Form */}
                {showForm && (
                    <div className="px-8 py-6 border-b border-gray-100 bg-gray-50">
                        <h2 className="font-black text-gray-900 mb-4 text-sm uppercase tracking-widest">New Address</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                { label: 'Full Name', placeholder: 'Your full name', type: 'text' },
                                { label: 'Phone', placeholder: '+62 xxx xxxx xxxx', type: 'tel' },
                                { label: 'Province', placeholder: 'e.g. North Sumatra', type: 'text' },
                                { label: 'City', placeholder: 'e.g. Medan', type: 'text' },
                                { label: 'District', placeholder: 'e.g. Medan Baru', type: 'text' },
                                { label: 'Postal Code', placeholder: '20xxx', type: 'text' },
                            ].map((f) => (
                                <div key={f.label}>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{f.label}</label>
                                    <input type={f.type} placeholder={f.placeholder}
                                        className="w-full border border-gray-200 text-gray-900 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-gray-900 transition-colors bg-white placeholder-gray-300"/>
                                </div>
                            ))}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Full Address</label>
                                <textarea rows={3} placeholder="Street name, building, block number..."
                                    className="w-full border border-gray-200 text-gray-900 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-gray-900 transition-colors bg-white placeholder-gray-300 resize-none"/>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button className="bg-gray-900 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors">
                                Save Address
                            </button>
                            <button onClick={() => setShowForm(false)}
                                className="border border-gray-200 text-gray-700 text-sm font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                <div className="text-center py-20">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                    </div>
                    <p className="font-black text-gray-900 mb-1">No addresses saved</p>
                    <p className="text-sm text-gray-400 mb-6">Add a shipping address for faster checkout.</p>
                    <button onClick={() => setShowForm(true)}
                        className="inline-block bg-gray-900 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors">
                        + Add Address
                    </button>
                </div>
            </div>
        </BuyerLayout>
    );
}