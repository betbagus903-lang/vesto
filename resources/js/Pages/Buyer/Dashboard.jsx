export default function Dashboard({ user }) {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Halo, {user.name}! 👋
            </h1>
            <p className="text-gray-500">Selamat datang di Vesto — temukan fashion terbaik untuk kamu.</p>
        </div>
    );
}