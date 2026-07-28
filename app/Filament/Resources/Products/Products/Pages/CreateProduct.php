<?php

namespace App\Filament\Resources\Products\Pages;

use App\Filament\Resources\Products\ProductResource;
use App\Models\Product;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class CreateProduct extends CreateRecord
{
    protected static string $resource = ProductResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('type')
                    ->label('Tipe Produk')
                    ->options([
                        'simple' => 'Simple',
                        'configurable' => 'Configurable',
                    ])
                    ->default('simple')
                    ->required()
                    ->live(),
                TextInput::make('sku')
                    ->label('SKU')
                    ->required()
                    ->maxLength(255)
                    ->unique()
                    ->helperText('Kode unik produk, tanpa spasi'),
            ]);
    }

    protected function handleRecordCreation(array $data): Product
    {
        // Create product with minimal data
        $product = Product::create([
            'type' => $data['type'],
            'sku' => $data['sku'],
            'name' => 'Draft Product',
            'slug' => 'draft-' . Str::random(8),
            'price' => 0,
            'stock' => 0,
            'is_active' => false,
        ]);

        Notification::make()
            ->title('Produk berhasil dibuat')
            ->body('Silakan lengkapi data produk')
            ->success()
            ->send();

        return $product;
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('edit', ['record' => $this->record]);
    }
}
