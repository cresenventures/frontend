import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus, Plus, ShoppingCart, CreditCard, Loader2, Mail, KeyRound, AlertTriangle } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useLocation } from 'react-router-dom';
import { BACKEND_URL } from '@/lib/config';

const RAZORPAY_KEY_ID = 'rzp_test_njYQGaQX85zmZf';

/*************  ✨ Windsurf Command ⭐  *************/
/*******  10f04a74-bba3-498c-ac05-6860c475542d  *******/
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CartSheet = ({ isOpen, setIsOpen, cart, updateQuantity, removeFromCart, clearCart, user, setUser, setCart }) => {
  const { toast } = useToast();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart'); // Start at cart
  const [isProcessing, setIsProcessing] = useState(false);
  const [showShippingFullScreen, setShowShippingFullScreen] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [shippingDetails, setShippingDetails] = useState({ name: '', phone: '', address: '', city: '', pincode: '' });
  const [calculatedShippingFee, setCalculatedShippingFee] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const totalBoxes = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.numericPrice * item.quantity, 0);
  const shippingCost = calculatedShippingFee !== null ? calculatedShippingFee : totalBoxes * 400;
  const grandTotal = subtotal + shippingCost;
  
  const isRazorpayConfigured = RAZORPAY_KEY_ID && RAZORPAY_KEY_ID.startsWith('rzp_');
  const navigate = useNavigate();
  const location = useLocation();

  // Restore user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('cresen_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  // Save user to localStorage when user logs in
  useEffect(() => {
    if (user && user.email) {
      localStorage.setItem('cresen_user', JSON.stringify(user));
    }
  }, [user]);

  // Handle edit shipping from summary page
  useEffect(() => {
    if (location.state?.editShipping) {
      setIsCheckoutOpen(true);
      setCheckoutStep('address');
      if (location.state.shippingDetails) {
        setShippingDetails(location.state.shippingDetails);
      }
      // Optionally, set cart and subtotal if passed
      if (location.state.cart) setCart(location.state.cart);
    }
    // eslint-disable-next-line
  }, [location.state]);

  useEffect(() => {
    if (!isOpen && !isCheckoutOpen) {
      setCheckoutStep('cart'); // Reset to cart when closed
      setShippingDetails({ name: '', phone: '', address: '', city: '', pincode: '' });
    }
  }, [isOpen, isCheckoutOpen]);

  useEffect(() => {
    if (checkoutStep === 'address') {
      setShowShippingFullScreen(true);
      // Set the URL to /shipping when entering the shipping details step
      window.history.replaceState(null, '', '/shipping');
    } else {
      setShowShippingFullScreen(false);
    }
  }, [checkoutStep]);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        variant: "destructive",
        title: "Your cart is empty!",
        description: "Add some products to your cart before proceeding.",
      });
      return;
    }
    setIsOpen(false);
    setIsCheckoutOpen(true);
    if (user && user.email) {
      // If already logged in, skip Google login step
      setCheckoutStep('address');
      setShippingDetails(prev => ({
        ...prev,
        name: user.name || '',
        phone: '',
        address: '',
        city: '',
        pincode: ''
      }));
    } else {
      setCheckoutStep('google'); // Go to Google login step first
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log('Google credentialResponse:', credentialResponse);
    console.log('Decoded Google token:', decoded);
    setGoogleUser(decoded);
    setUser(decoded);
    setShippingDetails(prev => ({
      ...prev,
      name: decoded.name || '',
      phone: '',
      address: '',
      city: '',
      pincode: ''
    }));
    // Call backend to create/update user with role 'customer'
    try {
      const response = await fetch(`${BACKEND_URL}/api/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: decoded.email })
      });
      const data = await response.json();
      if (data.success && data.user) {
        // Save backend user data to state if needed
        setGoogleUser(user => ({ ...user, ...data.user }));
        setUser(user => ({ ...user, ...data.user }));
      }
      // Fetch cart from backend and merge/replace local cart
      const cartRes = await fetch(`${BACKEND_URL}/api/get-cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: decoded.email })
      });
      const cartData = await cartRes.json();
      if (cartData.success && Array.isArray(cartData.cart) && cartData.cart.length > 0) {
        setCart(cartData.cart);
      }
    } catch (err) {
      toast({ variant: 'destructive', title: 'User creation failed', description: 'Could not create user in database.' });
    }
    setCheckoutStep('address'); // After Google login, go to shipping
  };

  const handleShippingChange = (e) => {
    const { id, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [id]: value }));
  };

  const validateShippingForm = () => {
    for (const key in shippingDetails) {
      if (shippingDetails[key].trim() === '') {
        toast({ variant: 'destructive', title: 'Missing Information', description: `Please fill out the ${key} field.` });
        return false;
      }
    }
    if (shippingDetails.phone.length < 10) {
        toast({ variant: 'destructive', title: 'Invalid Phone Number', description: `Please enter a valid 10-digit phone number.` });
        return false;
    }
    return true;
  };

  // --- Fix 1: Add debug log to confirm button click ---
  const handleProceedToPayment = () => {
    if (!validateShippingForm()) return;
    navigate('/order-confirmation', { replace: true });
    clearCart();
  };

  const CartItem = ({ item }) => {
    // Assign size based on title if not present
    let size = item.size;
    if (!size) {
      if (item.title === 'Standard Roll Box') size = '78mm x 50mtrs';
      else if (item.title === 'Compact Roll Box') size = '56mm x 25mtrs';
    }
    return (
      <div className="flex items-center justify-between py-4">
        <div className="flex items-start gap-4">
          <img
            src={item.image || '/thermalrolls.jpg'}
            alt={item.title}
            className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border"
          />
          <div>
            <h4 className="font-semibold">{item.title}</h4>
            {size && (
              <p className="text-xs text-gray-500 mb-1">Size: {size}</p>
            )}
            <p className="text-sm text-muted-foreground">{item.quantity} x ₹{item.numericPrice.toFixed(2)}</p>
            <p className="font-bold text-primary">₹{(item.numericPrice * item.quantity).toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center border rounded-lg">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.title, item.quantity - 1)}>
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.title, item.quantity + 1)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full md:max-w-md flex flex-col">
          <SheetHeader>
            <SheetTitle>Your Shopping Cart</SheetTitle>
            <SheetDescription>Review your items and proceed to checkout.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto -mx-6 px-6 divide-y">
            {cart.length > 0 ? (
              cart.map((item) => <CartItem key={item.id} item={item} />)
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">Your cart is empty</h3>
                <p className="text-muted-foreground">Add some products to get started!</p>
              </div>
            )}
          </div>
          {cart.length > 0 && (
            <SheetFooter className="mt-auto border-t pt-6 space-y-4">
                <div className="w-full space-y-2">
                    <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                    {/* Remove Grand Total and add shipping info message */}
                    <div className="text-xs text-gray-500 mt-2">Shipping rates will be calculated after entering your shipping address.</div>
                </div>
                <Button size="lg" className="w-full" onClick={handleCheckout}>
                    Proceed to Checkout
                </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={isCheckoutOpen && checkoutStep === 'google'} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-md flex flex-col items-center justify-center">
          <DialogHeader>
            <DialogTitle>Sign in with Google</DialogTitle>
            <DialogDescription>
              Please sign in or create an account to continue checkout.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => toast({ variant: 'destructive', title: 'Google Login Failed', description: 'Please try again.' })}
              width="300"
              scope="openid email profile"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Fullscreen shipping details */}
      {showShippingFullScreen && checkoutStep === 'address' && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">Shipping Details</h2>
            <p className="mb-6 text-gray-600">Provide your address for delivery.</p>
            <div className="grid gap-3 py-4">
              <Label htmlFor="name">Full Name</Label><Input id="name" value={shippingDetails.name} onChange={handleShippingChange} />
              <Label htmlFor="phone">Phone Number</Label><Input id="phone" type="tel" value={shippingDetails.phone} onChange={handleShippingChange} />
              <Label htmlFor="address">Address</Label><Input id="address" value={shippingDetails.address} onChange={handleShippingChange} />
              <Label htmlFor="city">City</Label><Input id="city" value={shippingDetails.city} onChange={handleShippingChange} />
              <Label htmlFor="pincode">Pincode</Label><Input id="pincode" type="number" value={shippingDetails.pincode} onChange={handleShippingChange} />
            </div>
            <Button
              className="w-full mt-2"
              onClick={async () => {
                if (!validateShippingForm()) return;
                // Calculate shipping based on product type
                let shippingFee = 0;
                cart.forEach(item => {
                  if (
                    item.title === 'Standard Roll Box' ||
                    (item.title && item.title.toLowerCase().includes('standard'))
                  ) {
                    shippingFee += 1350 * item.quantity;
                  } else if (
                    item.title === 'Compact Roll Box' ||
                    (item.title && item.title.toLowerCase().includes('compact'))
                  ) {
                    shippingFee += 1200 * item.quantity;
                  }
                });
                setCalculatedShippingFee(shippingFee);
                // Save attempted order to backend
                try {
                  const email = user?.email || googleUser?.email || '';
                  if (!email) {
                    toast({ variant: 'destructive', title: 'Not logged in', description: 'Please log in before saving your shipping details.' });
                    return;
                  }
                  try {
                    const response = await fetch(`${BACKEND_URL}/api/save-attempted-order`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: shippingDetails.name,
                        email,
                        phone: shippingDetails.phone,
                        items: cart,
                        shippingAddress: { ...shippingDetails },
                        shippingFee
                      })
                    });
                    const result = await response.json();
                    if (!result.success) {
                      toast({ variant: 'destructive', title: 'Order Save Failed', description: result.error || 'Could not save attempted order.' });
                      return;
                    }
                  } catch (err) {
                    toast({ variant: 'destructive', title: 'Order Save Failed', description: 'Could not save attempted order.' });
                    console.error('Order save error:', err);
                    return;
                  }
                } catch (err) {
                  toast({ variant: 'destructive', title: 'Order Save Failed', description: 'Could not save attempted order.' });
                }
                toast({ title: 'Shipping Fee Calculated', description: `Shipping Fee: ₹${shippingFee}` });
                // Debug: log shipping details before navigating
                console.log('Navigating to summary with shippingDetails:', shippingDetails);
                // Instead of reload, navigate to summary page (no full reload)
                navigate('/ordersummary', {
                  state: {
                    order: {
                      name: shippingDetails.name,
                      phone: shippingDetails.phone,
                      shippingAddress: { ...shippingDetails },
                      items: cart,
                      shippingFee
                    }
                  },
                  replace: true
                });
                setShowShippingFullScreen(false); // Hide shipping form after navigation
                setIsCheckoutOpen(false); // Close checkout dialog
              }}
            >
              Save & Calculate Shipping
            </Button>
          </div>
        </div>
      )}

      {/* Order Summary Screen */}
      {showSummary && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="mb-4 flex-1">
              <h3 className="font-semibold mb-2 flex items-center">Shipping Details
                <Button
                  variant="link"
                  className="ml-2 p-0 h-auto text-blue-600 text-xs"
                  style={{ textDecoration: 'underline', fontWeight: 400 }}
                  onClick={() => {
                    setShowSummary(false);
                    setShowShippingFullScreen(true);
                    setIsCheckoutOpen(true);
                    setCheckoutStep('address');
                  }}
                >Edit</Button>
              </h3>
              <div className="text-sm text-gray-700">
                <div><b>Name:</b> {shippingDetails.name}</div>
                <div><b>Phone:</b> {shippingDetails.phone}</div>
                <div><b>Address:</b> {shippingDetails.address}, {shippingDetails.city} - {shippingDetails.pincode}</div>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Items</h3>
              {cart.map(item => (
                <div key={item.title} className="flex justify-between">
                  <span>{item.title} x {item.quantity}</span>
                  <span>₹{(item.numericPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mb-2 flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="mb-2 flex justify-between"><span>Shipping</span><span>₹{calculatedShippingFee?.toFixed(2)}</span></div>
            <div className="mb-4 flex justify-between font-bold text-lg"><span>Grand Total</span><span>₹{(subtotal + (calculatedShippingFee || 0)).toFixed(2)}</span></div>
            {/* Proceed to Payment button removed as requested */}
          </div>
        </div>
      )}

      {orderPlaced && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-8">
          <div className="flex flex-col items-center">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="#e6ffe6" stroke="#4ade80" strokeWidth="5" />
              <polyline points="30,55 45,70 70,40" fill="none" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2 className="text-2xl font-bold mt-6 mb-2 text-green-600">Order Placed!</h2>
            <p className="text-gray-700 mb-4">Thank you for your purchase. Your order has been placed successfully.</p>
            <Button className="mt-2" onClick={() => setOrderPlaced(false)}>Close</Button>
          </div>
        </div>
      )}
    </>
  );
};

export default CartSheet;