<div class="flex items-start gap-6 w-full py-4">
    <!-- Kolom 1: Identitas Produk -->
    <div class="flex items-start gap-4 flex-1">
        <input type="checkbox" class="mt-1 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500">
        <div class="flex flex-col gap-1">
            <span class="font-semibold text-white">{{ $record->name }}</span>
            <span class="text-xs text-slate-400">{{ $record->sku }}</span>
            <span class="text-xs text-slate-400">Clothing</span>
        </div>
    </div>

    <!-- Kolom 2: Data Inventaris & Harga -->
    <div class="flex items-center gap-3 flex-1">
        @php
            $image = is_array($record->image) && !empty($record->image) ? $record->image[0] : $record->image;
            $imageUrl = $image ? asset('storage/' . $image) : 'https://via.placeholder.com/60';
        @endphp
        <div class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <img src="{{ $imageUrl }}" alt="{{ $record->name }}" class="w-full h-full object-cover">
        </div>
        <div class="flex flex-col">
            <span class="text-white font-bold">Rp {{ number_format($record->price, 0, ',', '.') }}</span>
            <span class="text-emerald-500 text-xs font-medium">{{ $record->stock }} Available</span>
            <span class="text-slate-400 text-xs">ID: {{ $record->id }}</span>
        </div>
    </div>

    <!-- Kolom 3: Status & Meta Data -->
    <div class="flex items-center gap-4 flex-1">
        <div class="flex flex-col gap-1">
            @if($record->is_active)
                <span class="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded-full w-fit">Active</span>
            @else
                <span class="bg-red-500/10 text-red-400 text-xs font-semibold px-2 py-0.5 rounded-full w-fit">Inactive</span>
            @endif
            <span class="text-slate-400 text-xs">{{ $record->categories->pluck('name')->join(', ') ?: 'N/A' }}</span>
            <span class="text-slate-400 text-xs">{{ ucfirst($record->type) }}</span>
        </div>
        <div class="flex items-center gap-2 ml-auto">
            <button class="p-2 hover:bg-slate-800/50 rounded-lg transition">
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            </button>
            <button class="p-2 hover:bg-slate-800/50 rounded-lg transition">
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    </div>
</div>
