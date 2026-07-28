import BuyerLayout from '@/Layouts/BuyerLayout';
import { Link } from '@inertiajs/react';

export default function Profile({ user }) {
    return (
        <BuyerLayout title="Profile">
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                    <h1 className="text-xl font-black text-gray-900">Profile</h1>
                    <Link href="/profile" className="text-sm font-semibold border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                        Edit
                    </Link>
                </div>
                <div className="divide-y divide-gray-100">
                    {[
                        { label: 'Full Name', value: user.name },
                        { label: 'Email', value: user.email },
                        { label: 'Member Since', value: new Date(user.created_at).toLocaleDateString('en-US', {day: 'numeric', month: 'long', year: 'numeric'}) },
                        { label: 'Account Status', value: 'Active' },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between px-8 py-5">
                            <span className="text-sm text-gray-500 w-40">{item.label}</span>
                            <span className="text-sm font-semibold text-gray-900 flex-1">{item.value}</span>
                        </div>
                    ))}
                </div>
                <div className="px-8 py-6 border-t border-gray-100">
                    <Link href="/profile"
                        className="inline-block bg-gray-900 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors">
                        Edit Profile →
                    </Link>
                </div>
            </div>
        </BuyerLayout>
    );
}