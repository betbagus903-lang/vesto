<?php

namespace App\Services\AI\Tools;

use App\Models\Shipment;
use App\Models\Order;

class ShipmentTool extends BaseTool
{
    public function getName(): string
    {
        return 'manage_shipments';
    }

    public function getDescription(): string
    {
        return 'Manage shipments: create, view, update, delete, and index shipments with full access to all shipment operations';
    }

    public function getParameters(): array
    {
        return [
            'action' => [
                'type' => 'string',
                'description' => 'Action to perform: create, view, index, update, delete',
                'enum' => ['create', 'view', 'index', 'update', 'delete']
            ],
            'shipment_id' => [
                'type' => 'integer',
                'description' => 'Shipment ID (required for view, update, delete actions)'
            ],
            'order_id' => [
                'type' => 'integer',
                'description' => 'Order ID (required for create action)'
            ],
            'carrier' => [
                'type' => 'string',
                'description' => 'Shipping carrier name (e.g., JNE, GoSend, J&T)'
            ],
            'tracking_number' => [
                'type' => 'string',
                'description' => 'Tracking number'
            ],
            'status' => [
                'type' => 'string',
                'description' => 'Shipment status: pending, shipped, in_transit, delivered, cancelled',
                'enum' => ['pending', 'shipped', 'in_transit', 'delivered', 'cancelled']
            ],
            'notes' => [
                'type' => 'string',
                'description' => 'Shipment notes'
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
                    return $this->createShipment($parameters);
                case 'view':
                    return $this->viewShipment($parameters);
                case 'index':
                    return $this->indexShipments();
                case 'update':
                    return $this->updateShipment($parameters);
                case 'delete':
                    return $this->deleteShipment($parameters);
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

    private function createShipment(array $params): array
    {
        if (!isset($params['order_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter for create: order_id is required'
            ];
        }

        $order = Order::find($params['order_id']);
        if (!$order) {
            return [
                'success' => false,
                'error' => 'Order not found'
            ];
        }

        $shipment = Shipment::create([
            'order_id' => $params['order_id'],
            'carrier' => $params['carrier'] ?? 'Standard Shipping',
            'tracking_number' => $params['tracking_number'] ?? null,
            'status' => $params['status'] ?? 'pending',
            'notes' => $params['notes'] ?? 'Shipment created via AI Assistant',
        ]);

        return [
            'success' => true,
            'data' => $shipment->toArray(),
            'message' => "Shipment '{$shipment->shipment_number}' created successfully for order #{$order->id}"
        ];
    }

    private function viewShipment(array $params): array
    {
        if (!isset($params['shipment_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: shipment_id'
            ];
        }

        $shipment = Shipment::with('order')->find($params['shipment_id']);
        if (!$shipment) {
            return [
                'success' => false,
                'error' => 'Shipment not found'
            ];
        }

        return [
            'success' => true,
            'data' => $shipment->toArray(),
            'message' => "Shipment '{$shipment->shipment_number}' details retrieved"
        ];
    }

    private function indexShipments(): array
    {
        $shipments = Shipment::with('order')->orderBy('created_at', 'desc')->get();
        
        return [
            'success' => true,
            'data' => $shipments->toArray(),
            'message' => "Retrieved {$shipments->count()} shipments"
        ];
    }

    private function updateShipment(array $params): array
    {
        if (!isset($params['shipment_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: shipment_id'
            ];
        }

        $shipment = Shipment::find($params['shipment_id']);
        if (!$shipment) {
            return [
                'success' => false,
                'error' => 'Shipment not found'
            ];
        }

        $updateData = [];
        if (isset($params['carrier'])) $updateData['carrier'] = $params['carrier'];
        if (isset($params['tracking_number'])) $updateData['tracking_number'] = $params['tracking_number'];
        if (isset($params['status'])) $updateData['status'] = $params['status'];
        if (isset($params['notes'])) $updateData['notes'] = $params['notes'];

        $shipment->update($updateData);

        return [
            'success' => true,
            'data' => $shipment->fresh()->toArray(),
            'message' => "Shipment '{$shipment->shipment_number}' updated successfully"
        ];
    }

    private function deleteShipment(array $params): array
    {
        if (!isset($params['shipment_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: shipment_id'
            ];
        }

        $shipment = Shipment::find($params['shipment_id']);
        if (!$shipment) {
            return [
                'success' => false,
                'error' => 'Shipment not found'
            ];
        }

        $number = $shipment->shipment_number;
        $shipment->delete();

        return [
            'success' => true,
            'message' => "Shipment '{$number}' deleted successfully"
        ];
    }
}