<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

abstract class BaseController extends Controller
{
    protected $model;
    protected $resourceName;
    protected $indexRoute;
    protected $viewPath;
    
    public function index(Request $request)
    {
        $query = $this->model::query();
        
        // Apply search
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        
        // Apply filters
        $this->applyFilters($query, $request);
        
        // Apply sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);
        
        // Pagination
        $perPage = $request->get('per_page', 10);
        $items = $query->paginate($perPage);
        
        return Inertia::render($this->viewPath . '/Index', [
            $this->resourceName => $items->items(),
            'pagination' => [
                'total' => $items->total(),
                'per_page' => $items->perPage(),
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'from' => $items->firstItem(),
                'to' => $items->lastItem(),
            ],
            'filters' => $this->getFilters($request),
        ], 'admin');
    }
    
    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);
        
        $item = $this->model::create($validated);
        
        $this->afterStore($item, $validated);
        
        return redirect()->route($this->indexRoute)->with('success', $this->getSuccessMessage('created'));
    }
    
    public function update(Request $request, $id)
    {
        $item = $this->model::findOrFail($id);
        
        $validated = $this->validateRequest($request, $id);
        
        $item->update($validated);
        
        $this->afterUpdate($item, $validated);
        
        return redirect()->route($this->indexRoute)->with('success', $this->getSuccessMessage('updated'));
    }
    
    public function destroy($id)
    {
        $item = $this->model::findOrFail($id);
        $item->delete();
        
        return redirect()->route($this->indexRoute)->with('success', $this->getSuccessMessage('deleted'));
    }
    
    protected function applyFilters($query, Request $request)
    {
        // Override in child controllers
    }
    
    protected function getFilters(Request $request)
    {
        return [
            'search' => $request->get('search', ''),
            'sort_by' => $request->get('sort_by', 'created_at'),
            'sort_order' => $request->get('sort_order', 'desc'),
            'per_page' => $request->get('per_page', 10),
        ];
    }
    
    abstract protected function validateRequest(Request $request, $id = null);
    
    protected function afterStore($item, $validated)
    {
        // Override in child controllers
    }
    
    protected function afterUpdate($item, $validated)
    {
        // Override in child controllers
    }
    
    protected function getSuccessMessage($action)
    {
        $messages = [
            'created' => 'Data berhasil dibuat.',
            'updated' => 'Data berhasil diperbarui.',
            'deleted' => 'Data berhasil dihapus.',
        ];
        
        return $messages[$action] ?? 'Operation completed successfully.';
    }
}