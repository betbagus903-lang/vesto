import { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Lock, Truck, CreditCard, MapPin, User, Phone, Mail } from 'lucide-react';
import Navbar from '../Components/Shared/Navbar';

function fmt(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

export default function Checkout() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [cartItems, setCartItems] = useState([]);
    const [currentStep, setCurrentStep] = useState(1); // 1: address, 2: shipping, 3: payment, 4: review
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const countries = [
        'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
        'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
        'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon',
        'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
        'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador',
        'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon',
        'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
        'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
        'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait',
        'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
        'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
        'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
        'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman',
        'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
        'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
        'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
        'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
        'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
        'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City',
        'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
    ];

    const [formData, setFormData] = useState({
        // Billing Address
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
        country: 'Indonesia',

        // Shipping Method
        shippingMethod: '', // standard, express

        // Payment Method
        paymentMethod: '', // cod, transfer

        // Coupon Code
        couponCode: '',
    });

    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');
    const [appliedCouponId, setAppliedCouponId] = useState(null);

    useEffect(() => {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('vesto_cart');
        if (savedCart) {
            const cart = JSON.parse(savedCart);
            setCartItems(cart);
            if (cart.length === 0) {
                router.visit('/cart');
            }
        } else {
            router.visit('/cart');
        }

        // Load saved addresses
        const savedAddressesData = localStorage.getItem('vesto_addresses');
        if (savedAddressesData) {
            const addresses = JSON.parse(savedAddressesData);
            setSavedAddresses(addresses);
            // Auto-select default address
            const defaultAddress = addresses.find(addr => addr.isDefault);
            if (defaultAddress) {
                setSelectedAddress(defaultAddress);
                // Auto-fill form with default address
                setFormData(prev => ({
                    ...prev,
                    firstName: defaultAddress.recipient?.split(' ')[0] || '',
                    lastName: defaultAddress.recipient?.split(' ').slice(1).join(' ') || '',
                    phone: defaultAddress.phone || '',
                    address: defaultAddress.address || '',
                    city: defaultAddress.city || '',
                    province: defaultAddress.province || '',
                    postalCode: defaultAddress.postalCode || '',
                }));
            }
        }

        // Auto-fill with user profile data if available
        if (user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.name?.split(' ')[0] || prev.firstName,
                lastName: user.name?.split(' ').slice(1).join(' ') || prev.lastName,
                email: user.email || prev.email,
                phone: user.phone || prev.phone,
            }));
        }
    }, [user]);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = formData.shippingMethod === 'express' ? 25000 : (subtotal > 200000 ? 0 : 15000);
    const total = subtotal + shippingCost - couponDiscount;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
        setFormData(prev => ({
            ...prev,
            firstName: address.recipient?.split(' ')[0] || '',
            lastName: address.recipient?.split(' ').slice(1).join(' ') || '',
            phone: address.phone || '',
            address: address.address || '',
            city: address.city || '',
            province: address.province || '',
            postalCode: address.postalCode || '',
        }));
    };

    const handleAddressProceed = () => {
        // Validate address fields
        if (formData.firstName && formData.lastName && formData.email && formData.phone &&
            formData.address && formData.city && formData.province && formData.postalCode) {
            setCurrentStep(2);
        }
    };

    const handleShippingSelect = (method) => {
        setFormData(prev => ({ ...prev, shippingMethod: method }));
        setCurrentStep(3);
    };

    const handlePaymentSelect = (method) => {
        setFormData(prev => ({ ...prev, paymentMethod: method }));
        setCurrentStep(4);
    };

    const handleApplyCoupon = async () => {
        if (!formData.couponCode.trim()) {
            setCouponError('Please enter a coupon code');
            setCouponSuccess('');
            return;
        }

        try {
            const response = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({
                    code: formData.couponCode,
                    subtotal: subtotal,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setCouponDiscount(data.discount);
                setAppliedCouponId(data.coupon_id);
                setCouponSuccess(`Coupon applied! You saved ${fmt(data.discount)}`);
                setCouponError('');
            } else {
                setCouponDiscount(0);
                setAppliedCouponId(null);
                setCouponError(data.message || 'Invalid coupon code');
                setCouponSuccess('');
            }
        } catch (error) {
            setCouponDiscount(0);
            setAppliedCouponId(null);
            setCouponError('Failed to validate coupon. Please try again.');
            setCouponSuccess('');
        }
    };

    const handlePlaceOrder = () => {
        router.post('/orders', {
            ...formData,
            cartItems,
            subtotal,
            shippingCost,
            total,
            couponCode: appliedCouponId ? formData.couponCode : null,
        }, {
            onSuccess: () => {
                // Clear cart from localStorage
                localStorage.removeItem('vesto_cart');
                window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: 0 } }));
            },
            onError: (errors) => {
                const first = Object.values(errors)[0];
                alert(Array.isArray(first) ? first[0] : first || 'Failed to place order. Please try again.');
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Bar */}
            <div className="bg-gray-900 text-white text-center py-2.5 text-xs tracking-widest font-medium">
                FREE SHIPPING ON ORDERS ABOVE RP200.000
            </div>

            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 1 ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}>1</div>
                            <span className="text-sm font-semibold">Address</span>
                        </div>
                        <ArrowRight className={`w-4 h-4 ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-300'}`} />
                        <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 2 ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}>2</div>
                            <span className="text-sm font-semibold">Shipping</span>
                        </div>
                        <ArrowRight className={`w-4 h-4 ${currentStep >= 3 ? 'text-gray-900' : 'text-gray-300'}`} />
                        <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 3 ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}>3</div>
                            <span className="text-sm font-semibold">Payment</span>
                        </div>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Progressive Forms */}
                    <div className="lg:col-span-2 space-y-4">
                        
                        {/* Step 1: Address Form - Always visible */}
                        <div className="bg-white rounded-lg overflow-hidden">
                            <div className="px-4 py-4 bg-gray-50">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-600" />
                                    <span className="text-base font-bold text-gray-900">
                                        Billing Address {currentStep > 1 ? '✓' : ''}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 border-t border-gray-200">
                                {/* Saved Addresses */}
                                {savedAddresses.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs font-semibold text-gray-900 mb-2">Saved Addresses</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {savedAddresses.map((address) => (
                                                <button
                                                    key={address.id}
                                                    type="button"
                                                    onClick={() => handleSelectAddress(address)}
                                                    className={`p-3 border-2 rounded-lg text-left transition-all ${
                                                        selectedAddress?.id === address.id
                                                            ? 'border-gray-900 bg-gray-50'
                                                            : 'border-gray-200 hover:border-gray-400'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm font-semibold text-gray-900">{address.label}</span>
                                                        {address.isDefault && (
                                                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">Default</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-600">{address.recipient}</p>
                                                    <p className="text-xs text-gray-500">{address.address}, {address.city}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-900 mb-1">First Name *</label>
                                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-900 mb-1">Last Name *</label>
                                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-900 mb-1">Email *</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-900 mb-1">Phone *</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400" required />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-gray-900 mb-1">Address *</label>
                                        <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-900 mb-1">City *</label>
                                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-900 mb-1">Province *</label>
                                        <input type="text" name="province" value={formData.province} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-900 mb-1">Postal Code *</label>
                                        <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-900 mb-1">Country</label>
                                        <select name="country" value={formData.country} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400 bg-white">
                                            {countries.map(country => (
                                                <option key={country} value={country}>{country}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {currentStep === 1 && (
                                    <div className="flex justify-end mt-4">
                                        <button onClick={handleAddressProceed} className="flex items-center gap-2 bg-gray-900 text-white font-semibold text-sm px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                                            Proceed
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Step 2: Shipping Method - Only visible after step 1 */}
                        {currentStep >= 2 && (
                            <div className="bg-white rounded-lg overflow-hidden">
                                <div className="px-4 py-4 bg-gray-50">
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-gray-600" />
                                        <span className="text-base font-bold text-gray-900">
                                            Shipping Method {currentStep > 2 ? '✓' : ''}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-gray-200">
                                    <div className="space-y-3">
                                        <label className={`flex items-center p-4 border-2 rounded cursor-pointer transition-all ${formData.shippingMethod === 'standard' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                                            <input type="radio" name="shippingMethod" value="standard" checked={formData.shippingMethod === 'standard'} onChange={() => handleShippingSelect('standard')} className="w-4 h-4 text-gray-900" />
                                            <div className="ml-3 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Truck className="w-4 h-4 text-gray-600" />
                                                        <span className="text-sm font-semibold text-gray-900">Standard Shipping</span>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900">{shippingCost === 0 ? 'FREE' : fmt(shippingCost)}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-0.5">{shippingCost === 0 ? 'Free shipping applied!' : 'Delivery in 3-5 business days'}</p>
                                            </div>
                                        </label>
                                        <label className={`flex items-center p-4 border-2 rounded cursor-pointer transition-all ${formData.shippingMethod === 'express' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                                            <input type="radio" name="shippingMethod" value="express" checked={formData.shippingMethod === 'express'} onChange={() => handleShippingSelect('express')} className="w-4 h-4 text-gray-900" />
                                            <div className="ml-3 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Truck className="w-4 h-4 text-gray-600" />
                                                        <span className="text-sm font-semibold text-gray-900">Express Shipping</span>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900">{fmt(25000)}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-0.5">Delivery in 1-2 business days</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Payment Method - Only visible after step 2 */}
                        {currentStep >= 3 && (
                            <div className="bg-white rounded-lg overflow-hidden">
                                <div className="px-4 py-4 bg-gray-50">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-gray-600" />
                                        <span className="text-base font-bold text-gray-900">
                                            Payment Method {currentStep > 3 ? '✓' : ''}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-gray-200">
                                    <div className="space-y-3">
                                        <label className={`flex items-center p-4 border-2 rounded cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                                            <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={() => handlePaymentSelect('cod')} className="w-4 h-4 text-gray-900" />
                                            <div className="ml-3 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="w-4 h-4 text-gray-600" />
                                                    <span className="text-sm font-semibold text-gray-900">Cash on Delivery (COD)</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-0.5">Pay with cash when your order is delivered</p>
                                            </div>
                                        </label>
                                        <label className={`flex items-center p-4 border-2 rounded cursor-pointer transition-all ${formData.paymentMethod === 'transfer' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                                            <input type="radio" name="paymentMethod" value="transfer" checked={formData.paymentMethod === 'transfer'} onChange={() => handlePaymentSelect('transfer')} className="w-4 h-4 text-gray-900" />
                                            <div className="ml-3 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="w-4 h-4 text-gray-600" />
                                                    <span className="text-sm font-semibold text-gray-900">Bank Transfer</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-0.5">Transfer to our bank account</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-4 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
                            
                            {/* Cart Items */}
                            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                {cartItems.map((item, index) => (
                                    <div key={index} className="flex gap-3">
                                        <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                            {item.image ? (
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-xl">📦</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {item.name}
                                            </p>
                                            {item.variantName && (
                                                <p className="text-xs text-gray-500">
                                                    {item.variantName}
                                                </p>
                                            )}
                                            <p className="text-sm text-gray-600 mt-1">
                                                Qty: {item.quantity} × {fmt(item.price)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Code */}
                            <div className="border-t border-gray-200 pt-3 mb-3">
                                <label className="block text-xs font-semibold text-gray-900 mb-2">Coupon Code</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="couponCode"
                                        value={formData.couponCode}
                                        onChange={handleInputChange}
                                        placeholder="Enter coupon code"
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400 text-sm"
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded hover:bg-gray-800 transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {couponError && (
                                    <p className="text-xs text-red-500 mt-1">{couponError}</p>
                                )}
                                {couponSuccess && (
                                    <p className="text-xs text-green-600 mt-1">{couponSuccess}</p>
                                )}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-gray-200 pt-3 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Subtotal</span>
                                    <span className="text-sm font-semibold text-gray-900">{fmt(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Shipping</span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {shippingCost === 0 ? 'FREE' : fmt(shippingCost)}
                                    </span>
                                </div>
                                {couponDiscount > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-green-600">Coupon Discount</span>
                                        <span className="text-sm font-semibold text-green-600">-{fmt(couponDiscount)}</span>
                                    </div>
                                )}
                                <div className="border-t border-gray-200 pt-2">
                                    <div className="flex justify-between">
                                        <span className="text-base font-bold text-gray-900">Total</span>
                                        <span className="text-base font-bold text-gray-900">{fmt(total)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-gray-50 rounded">
                                <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-2">
                                    <Lock className="w-3 h-3" />
                                    Secure checkout powered by Vesto
                                </p>
                            </div>

                            {/* Place Order Button */}
                            {currentStep >= 4 && formData.paymentMethod && (
                                <button
                                    onClick={handlePlaceOrder}
                                    className="w-full mt-4 flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    <Lock className="w-4 h-4" />
                                    Place Order
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-950 text-gray-400 py-8 mt-16">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <span className="text-xl font-black text-white tracking-widest">VESTO</span>
                    <p className="text-xs">© 2026 Vesto. All rights reserved.</p>
                    <div className="flex gap-4 text-xs">
                        <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy</a>
                        <a href="/terms" className="hover:text-white transition-colors">Terms</a>
                        <a href="/contact" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
