import AdminLayout from '../../Components/Admin/AdminLayout';

export default function Dashboard({ stats = {} }) {
    return (
        <AdminLayout title="Dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Total User</p>
                    <p className="text-3xl font-bold text-gray-800">{stats?.total_users ?? 0}</p>
                    <p className="text-xs text-green-500 mt-2">👥 Buyer terdaftar</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">User Baru Hari Ini</p>
                    <p className="text-3xl font-bold text-gray-800">{stats?.new_users_today ?? 0}</p>
                    <p className="text-xs text-blue-500 mt-2">🆕 Hari ini</p>
                </div>
            </div>
        </AdminLayout>
    );
}