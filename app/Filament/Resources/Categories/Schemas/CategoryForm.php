<?php

namespace App\Filament\Resources\Categories\Schemas;

use App\Models\Category;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class CategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Category Name')
                    ->required()
                    ->maxLength(255)
                    ->live(onBlur: true)
                    ->afterStateUpdated(function ($set, ?string $state, $get): void {
                        if (blank($get('slug'))) {
                            $set('slug', Str::slug($state ?? ''));
                        }
                    })
                    ->helperText('Enter the category name'),

                TextInput::make('slug')
                    ->label('URL Slug')
                    ->required()
                    ->maxLength(255)
                    ->unique(ignoreRecord: true)
                    ->helperText('Auto-generated from name'),

                Select::make('parent_id')
                    ->label('Parent Category')
                    ->relationship('parent', 'name')
                    ->searchable()
                    ->preload()
                    ->nullable()
                    ->helperText('Optional: Select a parent category'),

                RichEditor::make('description')
                    ->label('Description')
                    ->columnSpanFull()
                    ->helperText('Detailed description of the category'),

                FileUpload::make('logo_path')
                    ->label('Logo')
                    ->image()
                    ->directory('categories/logos')
                    ->visibility('public')
                    ->helperText('Upload category logo (recommended: 200x200px)'),

                FileUpload::make('banner_path')
                    ->label('Banner Image')
                    ->image()
                    ->directory('categories/banners')
                    ->visibility('public')
                    ->helperText('Upload category banner (recommended: 1200x400px)'),

                TextInput::make('meta_title')
                    ->label('Meta Title')
                    ->maxLength(255)
                    ->helperText('SEO title for search engines'),

                Textarea::make('meta_description')
                    ->label('Meta Description')
                    ->rows(3)
                    ->helperText('SEO description for search engines'),

                TextInput::make('meta_keywords')
                    ->label('Meta Keywords')
                    ->maxLength(255)
                    ->helperText('Comma-separated keywords'),

                TextInput::make('position')
                    ->label('Display Position')
                    ->required()
                    ->numeric()
                    ->default(0)
                    ->minValue(0)
                    ->helperText('Lower numbers appear first'),

                Select::make('display_mode')
                    ->label('Display Mode')
                    ->options([
                        'products_and_description' => 'Products and Description',
                        'products_only' => 'Products Only',
                        'description_only' => 'Description Only',
                    ])
                    ->default('products_and_description')
                    ->required()
                    ->helperText('Choose what to display on category page'),

                Toggle::make('is_active')
                    ->label('Visible in Menu')
                    ->default(true)
                    ->helperText('Show this category in navigation menu'),
            ]);
    }
}
