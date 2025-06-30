import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';

// Utility to load Razorpay script
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function OrderSummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [orderData, setOrderData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [razorpayKey, setRazorpayKey] = React.useState(null);

  React.useEffect(() => {
    // If order data is passed via navigation state, use it directly
    if (location.state && location.state.order) {
      setOrderData(location.state.order);
      setLoading(false);
      return;
    }
    async function fetchOrder() {
      setLoading(true);
      setError(null);
      try {
        // Try to get user email from localStorage
        let user = null;
        try {
          user = JSON.parse(localStorage.getItem('cresen_user'));
        } catch {}
        const email = user?.email;
        if (!email) {
          setError('User not logged in.');
          setLoading(false);
          return;
        }
        const res = await fetch(`/api/get-latest-attempted-order?email=${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error('Failed to fetch order');
        const data = await res.json();
        if (!data.success || !data.order) throw new Error('No attempted order found');
        setOrderData(data.order);
      } catch (err) {
        setError(err.message || 'Error fetching order');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [location.state]);

  // Fetch Razorpay key from backend on mount
  React.useEffect(() => {
    async function fetchKey() {
      try {
        const res = await fetch('/api/get-razorpay-key');
        const data = await res.json();
        if (data.success && data.key) {
          setRazorpayKey(data.key);
        } else {
          setRazorpayKey(null);
        }
      } catch {
        setRazorpayKey(null);
      }
    }
    fetchKey();
  }, []);

  const handleProceedToPayment = async () => {
    setIsProcessing(true);
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem('cresen_user'));
    } catch {}
    const email = user?.email;
    if (!email) {
      setError('User not logged in.');
      setIsProcessing(false);
      return;
    }
    if (!razorpayKey) {
      setError('Payment system not ready. Please try again later.');
      setIsProcessing(false);
      return;
    }
    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError('Failed to load Razorpay.');
      setIsProcessing(false);
      return;
    }
    // Calculate grandTotal before using it
    const shippingDetails = orderData?.shippingAddress || {};
    const cart = orderData?.items || [];
    const calculatedShippingFee = orderData?.shippingFee || 0;
    const subtotal = orderData?.subtotal || cart.reduce((sum, item) => sum + (item.numericPrice * item.quantity), 0);
    const grandTotal = (subtotal || 0) + (calculatedShippingFee || 0);
    // 1. Create order on backend to get order_id
    let orderId;
    try {
      console.log('[Razorpay] Creating order:', { amount: Math.round(grandTotal * 100), currency: 'INR' });
      const res = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(grandTotal * 100), currency: 'INR' })
      });
      const data = await res.json();
      console.log('[Razorpay] Backend response:', data);
      if (!data.success || !data.order) throw new Error('Failed to create Razorpay order: ' + (data.error || 'No order object'));
      orderId = data.order.id;
    } catch (err) {
      setError('Failed to create payment order. ' + (err.message || ''));
      setIsProcessing(false);
      return;
    }
    // 2. Open Razorpay modal with order_id
    const name = orderData?.name || shippingDetails?.name || '-';
    const phone = orderData?.phone || shippingDetails?.phone || '-';
    const address = shippingDetails?.address || '-';
    const city = shippingDetails?.city || '-';
    const pincode = shippingDetails?.pincode || '-';
    const options = {
      key: razorpayKey, // Use fetched key
      amount: Math.round(grandTotal * 100), // in paise
      currency: 'INR',
      name: 'Cresen Ventures',
      description: 'Order Payment',
      order_id: orderId,
      handler: async function (response) {
        // On payment success, call backend to save order
        try {
          const res = await fetch('/api/confirm-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, paymentId: response.razorpay_payment_id })
          });
          const data = await res.json();
          if (!data.success) {
            setError(data.message || 'Failed to confirm order.');
            setIsProcessing(false);
            return;
          }
          localStorage.setItem('cresen_cart', JSON.stringify([]));
          navigate('/orders', { replace: true });
        } catch (err) {
          setError('Failed to confirm order.');
        }
        setIsProcessing(false);
      },
      prefill: {
        name: name,
        email: email,
        contact: phone,
      },
      notes: {
        address: address + ', ' + city + ' - ' + pincode,
      },
      theme: {
        color: '#2563eb',
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      setError('Payment failed. Please try again.');
      setIsProcessing(false);
      console.error('[Razorpay] Payment failed:', response);
    });
    rzp.open();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-blue-700 font-semibold">Loading order summary...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <div className="text-red-600 font-bold mb-2">{error}</div>
          <Button onClick={() => window.location.href = '/'}>Go Home</Button>
        </div>
      </div>
    );
  }

  // Fallbacks for missing fields
  const shippingDetails = orderData?.shippingAddress || {};
  const cart = orderData?.items || [];
  const calculatedShippingFee = orderData?.shippingFee || 0;
  const subtotal = orderData?.subtotal || cart.reduce((sum, item) => sum + (item.numericPrice * item.quantity), 0);
  const grandTotal = (subtotal || 0) + (calculatedShippingFee || 0);

  // Use shippingDetails for name/phone/address if top-level fields are missing
  const name = orderData?.name || shippingDetails?.name || '-';
  const phone = orderData?.phone || shippingDetails?.phone || '-';
  const address = shippingDetails?.address || '-';
  const city = shippingDetails?.city || '-';
  const pincode = shippingDetails?.pincode || '-';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-2">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-blue-100 p-5 flex flex-col min-h-[70vh] relative order-summary-card">
        <h2 className="text-2xl font-extrabold mb-3 text-blue-800 tracking-tight text-center drop-shadow">Order Summary</h2>
        <div className="mb-3 flex-1">
          <h3 className="font-semibold mb-1 flex items-center text-blue-700 text-base">Shipping Details
            <Button
              variant="link"
              className="ml-2 p-0 h-auto text-blue-600 text-xs"
              style={{ textDecoration: 'underline', fontWeight: 400 }}
              onClick={() => {
                navigate('/', {
                  state: {
                    editShipping: true,
                    shippingDetails: shippingDetails,
                    cart: cart
                  }
                });
              }}
            >Edit</Button>
          </h3>
          <div className="text-xs text-gray-700 space-y-0.5 pl-2">
            <div><b>Name:</b> {name}</div>
            <div><b>Phone:</b> {phone}</div>
            <div><b>Address:</b> {address}, {city} - {pincode}</div>
          </div>
        </div>
        <hr className="my-1 border-blue-100" />
        <div className="mb-2 flex-1">
          <h3 className="font-semibold mb-1 text-blue-700 text-base">Items</h3>
          <ul className="text-xs text-gray-700 divide-y divide-blue-50 rounded-lg overflow-hidden bg-blue-50/60 border border-blue-100 shadow-sm">
            {(cart || []).map((item, idx) => (
              <li key={idx} className="flex justify-between items-center py-1 px-2">
                <span className="font-medium">{item.title} <span className="text-xs text-gray-500">x {item.quantity}</span></span>
                <span className="font-semibold text-blue-700">₹{(item.numericPrice * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-0.5 mt-1 mb-1 text-sm">
          <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-semibold">₹{(subtotal || 0).toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="font-semibold">₹{calculatedShippingFee !== null && calculatedShippingFee !== undefined ? calculatedShippingFee.toFixed(2) : '0.00'}</span></div>
        </div>
        <div className="flex justify-between font-bold text-lg border-t border-blue-100 pt-2 mt-1 text-blue-800">
          <span>Grand Total</span><span>₹{grandTotal.toFixed(2)}</span>
        </div>
        <div className="mt-auto pt-4">
          <Button onClick={handleProceedToPayment} disabled={isProcessing} className="w-full py-2 text-base font-bold shadow bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500">
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
            Proceed to Payment (₹{grandTotal.toFixed(2)})
          </Button>
        </div>
        <style>{`
          .order-summary-card {
            animation: fadeInUp 0.7s cubic-bezier(.23,1.01,.32,1) 0s 1;
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @media (max-width: 600px) {
            .order-summary-card {
              padding: 0.7rem !important;
              border-radius: 0.8rem !important;
            }
            .order-summary-card h2 {
              font-size: 1.1rem !important;
            }
            .order-summary-card ul {
              font-size: 0.95rem !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default OrderSummaryPage;
