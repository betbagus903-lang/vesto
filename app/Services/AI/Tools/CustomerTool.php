<?php

namespace App\Services\AI\Tools;

use App\Models\User;

class CustomerTool extends BaseTool
{
    public function getName(): string
    {
        return 'manage_customers';
    }

    public function getDescription(): string
    {
        return 'Manage customers: create, view, update, delete, and index customers with full access to all customer operations';
    }

    public function getParameters(): array
    {
        return [
            'action' => [
                'type' => 'string',
                'description' => 'Action to perform: create, view, index, update, delete',
                'enum' => ['create', 'view', 'index', 'update', 'delete']
            ],
            'user_id' => [
                'type' => 'integer',
                'description' => 'User ID (required for view, update, delete actions)'
            ],
            'name' => [
                'type' => 'string',
                'description' => 'Customer name (required for create action)'
            ],
            'email' => [
                'type' => 'string',
                'description' => 'Customer email (required for create action)'
            ],
            'password' => [
                'type' => 'string',
                'description' => 'Customer password (required for create action)'
            ],
            'role' => [
                'type' => 'string',
                'description' => 'User role: admin, seller, buyer',
                'enum' => ['admin', 'seller', 'buyer']
            ],
            'phone' => [
                'type' => 'string',
                'description' => 'Customer phone number'
            ],
            'address' => [
                'type' => 'string',
                'description' => 'Customer address'
            ],
        ];
    }

    protected function getRequiredParameters(): array
    {
        return ['action'];
    }

    public function execute(array $parameters): array
    {
        if (!$this->validate($parameters)) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: action'
            ];
        }

        $action = $parameters['action'];

        try {
            switch ($action) {
                case 'create':
                    return $this->createCustomer($parameters);
                case 'view':
                    return $this->viewCustomer($parameters);
                case 'index':
                    return $this->indexCustomers();
                case 'update':
                    return $this->updateCustomer($parameters);
                case 'delete':
                    return $this->deleteCustomer($parameters);
                default:
                    return [
                        'success' => false,
                        'error' => "Unknown action: {$action}. Valid actions: create, view, index, update, delete"
                    ];
            }
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    private function createCustomer(array $params): array
    {
        if (!isset($params['name']) || !isset($params['email']) || !isset($params['password'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameters for create: name, email, and password are required'
            ];
        }

        // Check if email already exists
        if (User::where('email', $params['email'])->exists()) {
            return [
                'success' => false,
                'error' => 'Email already exists'
            ];
        }

        $user = User::create([
            'name' => $params['name'],
            'email' => $params['email'],
            'password' => bcrypt($params['password']),
            'role' => $params['role'] ?? 'buyer',
            'phone' => $params['phone'] ?? null,
            'address' => $params['address'] ?? null,
        ]);

        return [
            'success' => true,
            'data' => $user->toArray(),
            'message' => "Customer '{$user->name}' created successfully"
        ];
    }

    private function viewCustomer(array $params): array
    {
        if (!isset($params['user_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: user_id'
            ];
        }

        $user = User::find($params['user_id']);
        if (!$user) {
            return [
                'success' => false,
                'error' => 'Customer not found'
            ];
        }

        return [
            'success' => true,
            'data' => $user->toArray(),
            'message' => "Customer '{$user->name}' details retrieved"
        ];
    }

    private function indexCustomers(): array
    {
        $users = User::orderBy('created_at', 'desc')->get();
        
        return [
            'success' => true,
            'data' => $users->toArray(),
            'message' => "Retrieved {$users->count()} customers"
        ];
    }

    private function updateCustomer(array $params): array
    {
        if (!isset($params['user_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: user_id'
            ];
        }

        $user = User::find($params['user_id']);
        if (!$user) {
            return [
                'success' => false,
                'error' => 'Customer not found'
            ];
        }

        $updateData = [];
        if (isset($params['name'])) $updateData['name'] = $params['name'];
        if (isset($params['email'])) {
            // Check if email already exists for another user
            if (User::where('email', $params['email'])->where('id', '!=', $user->id)->exists()) {
                return [
                    'success' => false,
                    'error' => 'Email already exists'
                ];
            }
            $updateData['email'] = $params['email'];
        }
        if (isset($params['password'])) $updateData['password'] = bcrypt($params['password']);
        if (isset($params['role'])) $updateData['role'] = $params['role'];
        if (isset($params['phone'])) $updateData['phone'] = $params['phone'];
        if (isset($params['address'])) $updateData['address'] = $params['address'];

        $user->update($updateData);

        return [
            'success' => true,
            'data' => $user->fresh()->toArray(),
            'message' => "Customer '{$user->name}' updated successfully"
        ];
    }

    private function deleteCustomer(array $params): array
    {
        if (!isset($params['user_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: user_id'
            ];
        }

        $user = User::find($params['user_id']);
        if (!$user) {
            return [
                'success' => false,
                'error' => 'Customer not found'
            ];
        }

        $name = $user->name;
        $user->delete();

        return [
            'success' => true,
            'message' => "Customer '{$name}' deleted successfully"
        ];
    }
}