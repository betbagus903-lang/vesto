<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\RichEditor;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                // Informasi Produk
                TextInput::make('name')
                    ->label('Nama Produk')
                    ->required()
                    ->maxLength(255)
                    ->live(onBlur: true)
                    ->afterStateUpdated(function ($set, ?string $state, $get): void {
                        if (blank($get('slug'))) {
                            $set('slug', Str::slug($state ?? ''));
                        }
                    }),
                TextInput::make('slug')
                    ->label('URL Key')
                    ->required()
                    ->maxLength(255)
                    ->unique(ignoreRecord: true),
                RichEditor::make('short_description')
                    ->label('Deskripsi Singkat')
                    ->columnSpanFull(),
                RichEditor::make('description')
                    ->label('Deskripsi Lengkap')
                    ->columnSpanFull(),
                TextInput::make('price')
                    ->label('Harga')
                    ->required()
                    ->numeric()
                    ->prefix('Rp')
                    ->minValue(0),
                TextInput::make('compare_at_price')
                    ->label('Harga Coret')
                    ->numeric()
                    ->prefix('Rp')
                    ->minValue(0)
                    ->helperText('Opsional — untuk tampilan diskon'),
                TextInput::make('stock')
                    ->label('Stok')
                    ->required()
                    ->numeric()
                    ->default(0)
                    ->minValue(0),
                FileUpload::make('images')
                    ->label('Gambar Produk')
                    ->multiple()
                    ->directory('products')
                    ->disk('public')
                    ->visibility('public')
                    ->imageEditor()
                    ->downloadable()
                    ->previewable()
                    ->reorderable()
                    ->appendFiles()
                    ->columnSpanFull(),

                // Pengaturan
                Select::make('type')
                    ->label('Tipe Produk')
                    ->options([
                        'simple' => 'Simple',
                        'configurable' => 'Configurable',
                    ])
                    ->default('simple')
                    ->required(),
                TextInput::make('sku')
                    ->label('SKU')
                    ->required()
                    ->maxLength(255)
                    ->unique(ignoreRecord: true)
                    ->helperText('Kode unik produk, tanpa spasi'),
                Toggle::make('is_active')
                    ->label('Status Aktif')
                    ->default(true),
                Toggle::make('is_featured')
                    ->label('Produk Unggulan')
                    ->default(false),

                // Kategori
                Select::make('categories')
                    ->label('Pilih Kategori')
                    ->relationship('categories', 'name')
                    ->multiple()
                    ->searchable()
                    ->preload()
                    ->required()
                    ->helperText('Pilih satu atau beberapa kategori untuk produk ini'),
            ]);
    }
}
