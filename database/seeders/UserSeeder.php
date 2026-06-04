<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Admin Vesto',
            'email' => 'admin@vesto.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Seller
        User::create([
            'name' => 'Seller Vesto',
            'email' => 'seller@vesto.com',
            'password' => Hash::make('password'),
            'role' => 'seller',
        ]);

        // Buyer
        User::create([
            'name' => 'Buyer Vesto',
            'email' => 'buyer@vesto.com',
            'password' => Hash::make('password'),
            'role' => 'buyer',
        ]);
    }
}