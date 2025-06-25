import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';

const RAZORPAY_KEY_ID = 'rzp_test_njYQGaQX85zmZf';

function OrderSummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, shippingDetails, calculatedShippingFee, subtotal } = location.state || {};
  const [isProcessing, setIsProcessing] = React.useState(false);

  if (!cart || !shippingDetails) {
    return <div className="min-h-screen flex items-center justify-center text-xl">No order data found.</div>;
  }

  const grandTotal = subtotal + (calculatedShippingFee || 0);

  const handleProceedToPayment = async () => {
    setIsProcessing(true);
    // Payment logic here (reuse from CartSheet if needed)
    // ...
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Order Summary</h2>
        <div className="mb-4">
          <h3 className="font-semibold mb-2 flex items-center justify-between">
            Shipping Details
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={() => {
                // Go back to shipping step
                navigate('/', { state: { editShipping: true, cart, shippingDetails, subtotal } });
              }}
            >
              Edit
            </Button>
          </h3>
          <div className="text-sm text-gray-700">
            <div><b>Name:</b> {shippingDetails.name}</div>
            <div><b>Phone:</b> {shippingDetails.phone}</div>
            <div><b>Address:</b> {shippingDetails.address}, {shippingDetails.city} - {shippingDetails.pincode}</div>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Items</h3>
          <ul className="text-sm text-gray-700">
            {cart.map((item, idx) => (
              <li key={idx} className="flex justify-between border-b py-1">
                <span>{item.title} x {item.quantity}</span>
                <span>₹{(item.numericPrice * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-between mb-1 font-semibold"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between mb-1"><span>Shipping</span><span>₹{calculatedShippingFee !== null ? calculatedShippingFee.toFixed(2) : '...'}</span></div>
        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span>Grand Total</span><span>₹{grandTotal.toFixed(2)}</span></div>
        <Button onClick={handleProceedToPayment} disabled={isProcessing} className="w-full mt-6">
          {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
          Proceed to Payment (₹{grandTotal.toFixed(2)})
        </Button>
      </div>
    </div>
  );
}

export default OrderSummaryPage;
