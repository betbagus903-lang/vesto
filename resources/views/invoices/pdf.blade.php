<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }
        .invoice-info {
            text-align: right;
        }
        .invoice-info h2 {
            margin: 0;
            font-size: 18px;
        }
        .invoice-info p {
            margin: 5px 0;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 10px;
            color: #333;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f5f5f5;
            font-weight: bold;
        }
        .totals {
            text-align: right;
            margin-top: 20px;
        }
        .totals table {
            width: 300px;
            margin-left: auto;
        }
        .totals td {
            padding: 5px 10px;
        }
        .totals .total {
            font-weight: bold;
            font-size: 14px;
            border-top: 2px solid #333;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 11px;
            color: #666;
        }
        .status {
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status.paid {
            background-color: #d4edda;
            color: #155724;
        }
        .status.unpaid {
            background-color: #f8d7da;
            color: #721c24;
        }
        .status.refunded {
            background-color: #fff3cd;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Vesto</div>
            <div class="invoice-info">
                <h2>INVOICE</h2>
                <p><strong>Invoice #:</strong> {{ $invoice->invoice_number }}</p>
                <p><strong>Date:</strong> {{ $invoice->created_at->format('d M Y') }}</p>
                <p><strong>Status:</strong> 
                    <span class="status {{ $invoice->payment_status }}">{{ $invoice->payment_status }}</span>
                </p>
            </div>
        </div>

        <div class="section">
            <div class="info-grid">
                <div>
                    <div class="section-title">Bill To</div>
                    @if($invoice->order->user)
                        <p>{{ $invoice->order->user->name }}</p>
                        <p>{{ $invoice->order->user->email }}</p>
                        <p>{{ ucfirst($invoice->order->user->role) }}</p>
                    @endif
                </div>
                <div>
                    <div class="section-title">Order Information</div>
                    <p><strong>Order #:</strong> {{ $invoice->order->order_number }}</p>
                    <p><strong>Channel:</strong> {{ ucfirst($invoice->order->channel) }}</p>
                </div>
            </div>
        </div>

        @if($invoice->order->addresses && $invoice->order->addresses->count() > 0)
        <div class="section">
            <div class="info-grid">
                @foreach($invoice->order->addresses as $address)
                <div>
                    <div class="section-title">{{ ucfirst($address->address_type) }} Address</div>
                    <p>{{ $address->first_name }} {{ $address->last_name }}</p>
                    <p>{{ $address->email }}</p>
                    @if($address->phone)
                        <p>{{ $address->phone }}</p>
                    @endif
                    <p>{{ $address->address }}</p>
                    <p>{{ $address->city }}, {{ $address->province }}</p>
                    <p>{{ $address->postal_code }}</p>
                    <p>{{ $address->country }}</p>
                </div>
                @endforeach
            </div>
        </div>
        @endif

        <div class="section">
            <div class="section-title">Order Items</div>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($invoice->order->items as $item)
                        <tr>
                            <td>{{ $item->product->name }}</td>
                            <td>{{ $item->quantity }}</td>
                            <td>{{ number_format($item->price, 0, ',', '.') }}</td>
                            <td>{{ number_format($item->total, 0, ',', '.') }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div class="totals">
            <table>
                <tr>
                    <td>Subtotal</td>
                    <td>{{ number_format($invoice->subtotal, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td>Tax</td>
                    <td>{{ number_format($invoice->tax, 0, ',', '.') }}</td>
                </tr>
                <tr class="total">
                    <td>Grand Total</td>
                    <td>{{ number_format($invoice->grand_total, 0, ',', '.') }}</td>
                </tr>
            </table>
        </div>

        <div class="footer">
            <p>Thank you for your business!</p>
            <p>If you have any questions, please contact us at support@vesto.com</p>
        </div>
    </div>
</body>
</html>
