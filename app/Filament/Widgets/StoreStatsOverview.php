<?php

namespace App\Filament\Widgets;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StoreStatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        return [
            Stat::make('Total Produk', Product::count())
                ->description('Semua produk di katalog')
                ->color('primary'),
            Stat::make('Kategori', Category::count())
                ->description('Kategori aktif & nonaktif')
                ->color('success'),
            Stat::make('Stok Habis', Product::where('stock', 0)->count())
                ->description('Produk perlu restock')
                ->color('danger'),
            Stat::make('Buyer', User::where('role', 'buyer')->count())
                ->description('Pelanggan terdaftar')
                ->color('warning'),
        ];
    }
}
