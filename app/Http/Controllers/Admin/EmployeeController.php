<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    private function stubEmployees()
    {
        return collect([
            ['id'=>1,'name'=>'Arya Pratama','email'=>'arya@vesto.com','role'=>'Product Manager','dept'=>'Catalog','status'=>'active','avatar'=>null,'phone'=>'+62-812-0001','joined'=>'2022-01-15','salary'=>12000000,'tasks'=>8,'completed'=>6],
            ['id'=>2,'name'=>'Sari Dewi','email'=>'sari@vesto.com','role'=>'Marketing Lead','dept'=>'Marketing','status'=>'active','avatar'=>null,'phone'=>'+62-812-0002','joined'=>'2022-04-20','salary'=>11500000,'tasks'=>12,'completed'=>10],
            ['id'=>3,'name'=>'Bimo Wicaksono','email'=>'bimo@vesto.com','role'=>'Finance Analyst','dept'=>'Finance','status'=>'active','avatar'=>null,'phone'=>'+62-812-0003','joined'=>'2023-02-10','salary'=>10000000,'tasks'=>5,'completed'=>5],
            ['id'=>4,'name'=>'Rini Handayani','email'=>'rini@vesto.com','role'=>'Customer Support','dept'=>'Support','status'=>'on_leave','avatar'=>null,'phone'=>'+62-812-0004','joined'=>'2023-06-01','salary'=>7500000,'tasks'=>15,'completed'=>11],
            ['id'=>5,'name'=>'Doni Setiawan','email'=>'doni@vesto.com','role'=>'Warehouse Staff','dept'=>'Inventory','status'=>'active','avatar'=>null,'phone'=>'+62-812-0005','joined'=>'2023-09-15','salary'=>6500000,'tasks'=>9,'completed'=>9],
            ['id'=>6,'name'=>'Maya Kusuma','email'=>'maya@vesto.com','role'=>'UI/UX Designer','dept'=>'Tech','status'=>'active','avatar'=>null,'phone'=>'+62-812-0006','joined'=>'2024-01-08','salary'=>13000000,'tasks'=>7,'completed'=>4],
        ]);
    }

    public function index()
    {
        $employees = $this->stubEmployees();
        $depts = $employees->groupBy('dept')->map(fn($g) => $g->count())->toArray();
        $stats = [
            'total'          => $employees->count(),
            'active'         => $employees->where('status','active')->count(),
            'on_leave'       => $employees->where('status','on_leave')->count(),
            'departments'    => count($depts),
            'total_payroll'  => $employees->sum('salary'),
            'avg_completion' => round($employees->avg(fn($e) => $e['tasks']>0 ? ($e['completed']/$e['tasks']*100) : 0)),
        ];
        return Inertia::render('Admin/Employees/Index', [
            'employees'   => $employees->values(),
            'stats'       => $stats,
            'departments' => $depts,
        ]);
    }
}
