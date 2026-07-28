<?php

namespace App\Filament\Resources\Products\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn ($query) => $query->with('categories'))
            ->columns([
                TextColumn::make('name')
                    ->label('Nama Produk')
                    ->searchable()
                    ->sortable()
                    ->grow(),
                TextColumn::make('images')
                    ->label('Gambar')
                    ->formatStateUsing(function ($state, $record) {
                        $images = is_array($record->images) ? $record->images : [];
                        if (!empty($images)) {
                            $firstImage = $images[0];
                            return "<img src='/storage/{$firstImage}' width='50' height='50' class='rounded object-cover'>";
                        }
                        return "<img src='https://via.placeholder.com/50' width='50' height='50' class='rounded object-cover'>";
                    })->html(),
                TextColumn::make('sku')
                    ->label('SKU')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('price')
                    ->label('Harga')
                    ->money('IDR')
                    ->sortable(),
                TextColumn::make('type')
                    ->label('Tipe')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'simple' => 'success',
                        'configurable' => 'warning',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'simple' => 'Simple',
                        'configurable' => 'Configurable',
                        default => $state,
                    }),
                TextColumn::make('categories.name')
                    ->label('Kategori')
                    ->badge()
                    ->color('primary')
                    ->separator(', '),
                IconColumn::make('is_active')
                    ->label('Status')
                    ->boolean(),
            ])
            ->filters([
                SelectFilter::make('type')
                    ->label('Tipe')
                    ->options([
                        'simple' => 'Simple',
                        'configurable' => 'Configurable',
                    ]),
                TernaryFilter::make('is_active')
                    ->label('Status Aktif'),
            ])
            ->recordActions([
                EditAction::make()->label('Edit'),
                DeleteAction::make()->label('Hapus'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()->label('Hapus Terpilih'),
                ]),
            ])
            ->defaultSort('updated_at', 'desc');
    }
}
