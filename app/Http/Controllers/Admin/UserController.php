<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::where('role', 'buyer')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users
        ]);
    }

    public function destroy(User $user)
    {
        if ($user->role === 'admin') {
            abort(403, 'Tidak bisa hapus akun admin.');
        }

        $user->delete();

        return back()->with('message', 'User berhasil dihapus.');
    }
}