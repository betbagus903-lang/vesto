<?php

namespace App\Services\AI\Tools;

use App\Models\Invoice;
use App\Models\Order;

class InvoiceTool extends BaseTool
{
    public function getName(): string
    {
        return 'manage_invoices';
    }

    public function getDescription(): string
    {
        return 'Manage invoices: create, view, update, delete, and index invoices with full access to all invoice operations';
    }

    public function getParameters(): array
    {
        return [
            'action' => [
                'type' => 'string',
                'description' => 'Action to perform: create, view, index, update, delete',
                'enum' => ['create', 'view', 'index', 'update', 'delete']
            ],
            'invoice_id' => [
                'type' => 'integer',
                'description' => 'Invoice ID (required for view, update, delete actions)'
            ],
            'order_id' => [
                'type' => 'integer',
                'description' => 'Order ID (required for create action)'
            ],
            'subtotal' => [
                'type' => 'number',
                'description' => 'Invoice subtotal amount'
            ],
            'tax' => [
                'type' => 'number',
                'description' => 'Tax amount'
            ],
            'grand_total' => [
                'type' => 'number',
                'description' => 'Grand total amount'
            ],
            'payment_status' => [
                'type' => 'string',
                'description' => 'Payment status: pending, paid, cancelled, refunded',
                'enum' => ['pending', 'paid', 'cancelled', 'refunded']
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
                    return $this->createInvoice($parameters);
                case 'view':
                    return $this->viewInvoice($parameters);
                case 'index':
                    return $this->indexInvoices();
                case 'update':
                    return $this->updateInvoice($parameters);
                case 'delete':
                    return $this->deleteInvoice($parameters);
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

    private function createInvoice(array $params): array
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

        $invoice = Invoice::create([
            'order_id' => $params['order_id'],
            'subtotal' => $params['subtotal'] ?? $order->total,
            'tax' => $params['tax'] ?? 0,
            'grand_total' => $params['grand_total'] ?? $order->total,
            'payment_status' => $params['payment_status'] ?? 'pending',
        ]);

        return [
            'success' => true,
            'data' => $invoice->toArray(),
            'message' => "Invoice '{$invoice->invoice_number}' created successfully for order #{$order->id}"
        ];
    }

    private function viewInvoice(array $params): array
    {
        if (!isset($params['invoice_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: invoice_id'
            ];
        }

        $invoice = Invoice::with('order')->find($params['invoice_id']);
        if (!$invoice) {
            return [
                'success' => false,
                'error' => 'Invoice not found'
            ];
        }

        return [
            'success' => true,
            'data' => $invoice->toArray(),
            'message' => "Invoice '{$invoice->invoice_number}' details retrieved"
        ];
    }

    private function indexInvoices(): array
    {
        $invoices = Invoice::with('order')->orderBy('created_at', 'desc')->get();
        
        return [
            'success' => true,
            'data' => $invoices->toArray(),
            'message' => "Retrieved {$invoices->count()} invoices"
        ];
    }

    private function updateInvoice(array $params): array
    {
        if (!isset($params['invoice_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: invoice_id'
            ];
        }

        $invoice = Invoice::find($params['invoice_id']);
        if (!$invoice) {
            return [
                'success' => false,
                'error' => 'Invoice not found'
            ];
        }

        $updateData = [];
        if (isset($params['subtotal'])) $updateData['subtotal'] = $params['subtotal'];
        if (isset($params['tax'])) $updateData['tax'] = $params['tax'];
        if (isset($params['grand_total'])) $updateData['grand_total'] = $params['grand_total'];
        if (isset($params['payment_status'])) $updateData['payment_status'] = $params['payment_status'];

        $invoice->update($updateData);

        return [
            'success' => true,
            'data' => $invoice->fresh()->toArray(),
            'message' => "Invoice '{$invoice->invoice_number}' updated successfully"
        ];
    }

    private function deleteInvoice(array $params): array
    {
        if (!isset($params['invoice_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: invoice_id'
            ];
        }

        $invoice = Invoice::find($params['invoice_id']);
        if (!$invoice) {
            return [
                'success' => false,
                'error' => 'Invoice not found'
            ];
        }

        $number = $invoice->invoice_number;
        $invoice->delete();

        return [
            'success' => true,
            'message' => "Invoice '{$number}' deleted successfully"
        ];
    }
}