<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SupplierController extends Controller
{
    /* Stub data — replace with a Supplier model when ready */
    private function stubSuppliers()
    {
        return collect([
            ['id'=>1,'name'=>'PT Maju Bersama','contact'=>'Budi Santoso','email'=>'budi@majubersama.com','phone'=>'+62-21-5551234','city'=>'Jakarta','category'=>'Fashion','status'=>'active','products'=>42,'total_orders'=>128,'total_value'=>48500000,'rating'=>4.8,'joined'=>'2023-03-15'],
            ['id'=>2,'name'=>'CV Sumber Makmur','contact'=>'Siti Rahayu','email'=>'siti@sumbermakmur.id','phone'=>'+62-31-5559876','city'=>'Surabaya','category'=>'Electronics','status'=>'active','products'=>18,'total_orders'=>76,'total_value'=>32000000,'rating'=>4.5,'joined'=>'2023-07-22'],
            ['id'=>3,'name'=>'UD Berkah Jaya','contact'=>'Ahmad Fauzi','email'=>'ahmad@berkahjaya.co.id','phone'=>'+62-22-5557890','city'=>'Bandung','category'=>'Accessories','status'=>'inactive','products'=>9,'total_orders'=>34,'total_value'=>8200000,'rating'=>3.9,'joined'=>'2024-01-10'],
            ['id'=>4,'name'=>'PT Indo Tekstil','contact'=>'Dewi Lestari','email'=>'dewi@indotekstil.com','phone'=>'+62-24-5554321','city'=>'Semarang','category'=>'Footwear','status'=>'active','products'=>31,'total_orders'=>95,'total_value'=>27800000,'rating'=>4.6,'joined'=>'2022-11-05'],
            ['id'=>5,'name'=>'CV Karya Mandiri','contact'=>'Rudi Hartono','email'=>'rudi@karyamandiri.id','phone'=>'+62-61-5556789','city'=>'Medan','category'=>'Bags','status'=>'active','products'=>24,'total_orders'=>61,'total_value'=>15600000,'rating'=>4.2,'joined'=>'2024-04-18'],
        ]);
    }

    public function index()
    {
        $suppliers = $this->stubSuppliers();
        $stats = [
            'total'        => $suppliers->count(),
            'active'       => $suppliers->where('status','active')->count(),
            'inactive'     => $suppliers->where('status','inactive')->count(),
            'total_value'  => $suppliers->sum('total_value'),
            'avg_rating'   => round($suppliers->avg('rating'),1),
            'total_orders' => $suppliers->sum('total_orders'),
        ];
        return Inertia::render('Admin/Suppliers/Index', [
            'suppliers' => $suppliers->values(),
            'stats'     => $stats,
        ]);
    }

    public function show($id)
    {
        $supplier = $this->stubSuppliers()->firstWhere('id', (int)$id);
        abort_unless($supplier, 404);
        return Inertia::render('Admin/Suppliers/Show', ['supplier' => $supplier]);
    }
}
