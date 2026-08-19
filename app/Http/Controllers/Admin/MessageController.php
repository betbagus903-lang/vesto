<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
    private function stubConversations()
    {
        return collect([
            ['id'=>1,'name'=>'Budi Santoso','email'=>'budi@example.com','role'=>'buyer','unread'=>3,'last_message'=>'Halo, pesanan saya belum datang.','last_time'=>'2m ago','online'=>true,'avatar'=>null],
            ['id'=>2,'name'=>'Siti Rahayu','email'=>'siti@example.com','role'=>'buyer','unread'=>0,'last_message'=>'Terima kasih, barang sudah diterima!','last_time'=>'15m ago','online'=>true,'avatar'=>null],
            ['id'=>3,'name'=>'Ahmad Fauzi','email'=>'ahmad@example.com','role'=>'buyer','unread'=>1,'last_message'=>'Bisa minta invoice?','last_time'=>'1h ago','online'=>false,'avatar'=>null],
            ['id'=>4,'name'=>'Dewi Lestari','email'=>'dewi@example.com','role'=>'supplier','unread'=>0,'last_message'=>'Stok sudah kami kirim.','last_time'=>'3h ago','online'=>false,'avatar'=>null],
            ['id'=>5,'name'=>'Rudi Hartono','email'=>'rudi@example.com','role'=>'buyer','unread'=>2,'last_message'=>'Produknya rusak saat sampai.','last_time'=>'5h ago','online'=>false,'avatar'=>null],
            ['id'=>6,'name'=>'Tim Support','email'=>'support@vesto.com','role'=>'internal','unread'=>0,'last_message'=>'Tiket #234 telah diselesaikan.','last_time'=>'1d ago','online'=>true,'avatar'=>null],
        ]);
    }

    public function index()
    {
        $convs = $this->stubConversations();
        $stats = [
            'total'    => $convs->count(),
            'unread'   => $convs->sum('unread'),
            'online'   => $convs->where('online',true)->count(),
            'resolved' => 24,
        ];
        return Inertia::render('Admin/Messages/Index', [
            'conversations' => $convs->values(),
            'stats'         => $stats,
        ]);
    }
}
