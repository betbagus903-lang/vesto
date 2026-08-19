<?php

namespace App\Services\AI\Tools;

use App\Models\Order;
use App\Models\User;

class OrderTool extends BaseTool
{
    public function getName(): string
    {
        return 'manage_orders';
    }

    public function getDescription(): string
    {
        return 'Manage orders: create, view, update, delete, process, ship, cancel, and refund orders with full access to all order operations';
    }

    public function getParameters(): array
    {
        return [
            'action' => [
                'type' => 'string',
                'description' => 'Action to perform: create, view, index, update, delete, process, ship, cancel, refund',
                'enum' => ['create', 'view', 'index', 'update', 'delete', 'process', 'ship', 'cancel', 'refund']
            ],
            'order_id' => [
                'type' => 'integer',
                'description' => 'Order ID (required for view, update, delete, process, ship, cancel, refund actions)'
            ],
            'user_id' => [
                'type' => 'integer',
                'description' => 'User ID (required for create action)'
            ],
            'total' => [
                'type' => 'number',
                'description' => 'Order total amount (required for create action)'
            ],
            'status' => [
                'type' => 'string',
                'description' => 'Order status: pending, processing, shipped, delivered, cancelled, refunded',
                'enum' => ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
            ],
            'shipping_address' => [
                'type' => 'string',
                'description' => 'Shipping address'
            ],
            'notes' => [
                'type' => 'string',
                'description' => 'Order notes'
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
                    return $this->createOrder($parameters);
                case 'view':
                    return $this->viewOrder($parameters);
                case 'index':
                    return $this->indexOrders();
                case 'update':
                    return $this->updateOrder($parameters);
                case 'delete':
                    return $this->deleteOrder($parameters);
                case 'process':
                    return $this->processOrder($parameters);
                case 'ship':
                    return $this->shipOrder($parameters);
                case 'cancel':
                    return $this->cancelOrder($parameters);
                case 'refund':
                    return $this->refundOrder($parameters);
                default:
                    return [
                        'success' => false,
                        'error' => "Unknown action: {$action}. Valid actions: create, view, index, update, delete, process, ship, cancel, refund"
                    ];
            }
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    private function createOrder(array $params): array
    {
        if (!isset($params['user_id']) || !isset($params['total'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameters for create: user_id and total are required'
            ];
        }

        $user = User::find($params['user_id']);
        if (!$user) {
            return [
                'success' => false,
                'error' => 'User not found'
            ];
        }

        $order = Order::create([
            'user_id' => $params['user_id'],
            'total' => $params['total'],
            'status' => $params['status'] ?? 'pending',
            'shipping_address' => $params['shipping_address'] ?? $user->email,
            'notes' => $params['notes'] ?? 'Order created via AI Assistant',
        ]);

        return [
            'success' => true,
            'data' => $order->toArray(),
            'message' => "Order #{$order->id} created successfully for user {$user->name}"
        ];
    }

    private function viewOrder(array $params): array
    {
        if (!isset($params['order_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: order_id'
            ];
        }

        $order = Order::with('user')->find($params['order_id']);
        if (!$order) {
            return [
                'success' => false,
                'error' => 'Order not found'
            ];
        }

        return [
            'success' => true,
            'data' => $order->toArray(),
            'message' => "Order #{$order->id} details retrieved"
        ];
    }

    private function indexOrders(): array
    {
        $orders = Order::with('user')->orderBy('created_at', 'desc')->get();
        
        return [
            'success' => true,
            'data' => $orders->toArray(),
            'message' => "Retrieved {$orders->count()} orders"
        ];
    }

    private function updateOrder(array $params): array
    {
        if (!isset($params['order_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: order_id'
            ];
        }

        $order = Order::find($params['order_id']);
        if (!$order) {
            return [
                'success' => false,
                'error' => 'Order not found'
            ];
        }

        $updateData = [];
        if (isset($params['status'])) $updateData['status'] = $params['status'];
        if (isset($params['total'])) $updateData['total'] = $params['total'];
        if (isset($params['shipping_address'])) $updateData['shipping_address'] = $params['shipping_address'];
        if (isset($params['notes'])) $updateData['notes'] = $params['notes'];

        $order->update($updateData);

        return [
            'success' => true,
            'data' => $order->fresh()->toArray(),
            'message' => "Order #{$order->id} updated successfully"
        ];
    }

    private function deleteOrder(array $params): array
    {
        if (!isset($params['order_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: order_id'
            ];
        }

        $order = Order::find($params['order_id']);
        if (!$order) {
            return [
                'success' => false,
                'error' => 'Order not found'
            ];
        }

        $orderId = $order->id;
        $order->delete();

        return [
            'success' => true,
            'message' => "Order #{$orderId} deleted successfully"
        ];
    }

    private function processOrder(array $params): array
    {
        if (!isset($params['order_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: order_id'
            ];
        }

        $order = Order::find($params['order_id']);
        if (!$order) {
            return [
                'success' => false,
                'error' => 'Order not found'
            ];
        }

        $order->update(['status' => 'processing']);

        return [
            'success' => true,
            'data' => $order->fresh()->toArray(),
            'message' => "Order #{$order->id} is now being processed"
        ];
    }

    private function shipOrder(array $params): array
    {
        if (!isset($params['order_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: order_id'
            ];
        }

        $order = Order::find($params['order_id']);
        if (!$order) {
            return [
                'success' => false,
                'error' => 'Order not found'
            ];
        }

        $order->update(['status' => 'shipped']);

        return [
            'success' => true,
            'data' => $order->fresh()->toArray(),
            'message' => "Order #{$order->id} has been shipped"
        ];
    }

    private function cancelOrder(array $params): array
    {
        if (!isset($params['order_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: order_id'
            ];
        }

        $order = Order::find($params['order_id']);
        if (!$order) {
            return [
                'success' => false,
                'error' => 'Order not found'
            ];
        }

        $order->update(['status' => 'cancelled']);

        return [
            'success' => true,
            'data' => $order->fresh()->toArray(),
            'message' => "Order #{$order->id} has been cancelled"
        ];
    }

    private function refundOrder(array $params): array
    {
        if (!isset($params['order_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: order_id'
            ];
        }

        $order = Order::find($params['order_id']);
        if (!$order) {
            return [
                'success' => false,
                'error' => 'Order not found'
            ];
        }

        $order->update(['status' => 'refunded']);

        return [
            'success' => true,
            'data' => $order->fresh()->toArray(),
            'message' => "Order #{$order->id} has been refunded"
        ];
    }
}