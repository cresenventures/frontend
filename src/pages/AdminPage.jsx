import React, { useState, useEffect, useRef } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { BACKEND_URL } from '@/lib/config';

const ALLOWED_EMAILS = [
  'cresenventures@gmail.com',
  'forvoq@gmail.com',
  'leo112944@gmail.com',
];

const TABS = [
  { key: 'attempted', label: 'Attempted' },
  { key: 'new', label: 'New Orders' },
  { key: 'dispatched', label: 'Dispatched' },
];

function AdminPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('attempted');
  const [orders, setOrders] = useState({ attempted: [], new: [], dispatched: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shippingCodes, setShippingCodes] = useState({}); // For new orders input
  const [editShippingId, setEditShippingId] = useState(null); // For dispatched edit mode
  const [editShippingValue, setEditShippingValue] = useState("");
  const dispatchedRefs = useRef({});
  const [scrollToId, setScrollToId] = useState(null);

  // Google login success handler
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const email = (decoded.email || '').trim().toLowerCase();
      // Check role from backend
      const res = await fetch(`${BACKEND_URL}/api/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      console.log('google-login response:', data); // Debug: log backend response
      if (!data.success || !data.user) {
        setError('Login failed: user not found.');
        setUser(null);
        return;
      }
      if (!data.user.role || data.user.role.trim().toLowerCase() !== 'admin') {
        setError('Access denied: you are not an admin.');
        setUser(null);
        return;
      }
      setUser(decoded);
      setError('');
    } catch (err) {
      setError('Login failed: could not verify admin role.');
      setUser(null);
    }
  };

  const handleLogout = () => {
    setUser(null);
    googleLogout();
  };

  // Fetch orders from backend when user logs in
  useEffect(() => {
    if (user) {
      setLoading(true);
      setError("");
      // Only allow valid tab values
      const validTabs = ["attempted", "new", "dispatched"];
      const safeTab = validTabs.includes(activeTab) ? activeTab : "attempted";
      fetch(`${BACKEND_URL}/api/admin-orders?tab=${safeTab}`)
        .then(async (res) => {
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP ${res.status}: ${errorText}`);
          }
          return res.json();
        })
        .then(data => {
          if (data.success && data.orders) {
            setOrders(prev => ({ ...prev, [safeTab]: data.orders }));
          } else {
            setError(data.error || "Failed to load orders.");
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line
  }, [user, activeTab]);

  // Helper to refresh orders for all tabs
  const refreshOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const tabs = ["attempted", "new", "dispatched"];
      const results = await Promise.all(
        tabs.map(tab =>
          fetch(`${BACKEND_URL}/api/admin-orders?tab=${tab}`)
            .then(res => res.json())
            .then(data => data.success && data.orders ? data.orders : [])
        )
      );
      setOrders({ attempted: results[0], new: results[1], dispatched: results[2] });
    } catch (err) {
      setError("Failed to refresh orders");
    } finally {
      setLoading(false);
    }
  };

  // Save shipping code and dispatch order
  const handleSaveShippingCode = async (orderId) => {
    const code = shippingCodes[orderId]?.trim();
    if (!code) return setError("Shipping code required.");
    setLoading(true);
    setError("");
    try {
      const url = `${BACKEND_URL}/api/admin-update-shipping`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, shippingCode: code })
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        const text = await res.text();
        throw new Error(`Invalid JSON from backend: ${text}`);
      }
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      if (!data.success) throw new Error(data.error || "Failed to update order.");
      setShippingCodes(prev => ({ ...prev, [orderId]: "" })); // Clear input
      await refreshOrders();
      setActiveTab("dispatched");
      setScrollToId(orderId);
      setError("");
      // Removed alert("Shipping code saved and order dispatched!");
    } catch (err) {
      setError(err.message);
      // Debug log
      console.error("Shipping code save error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Edit shipping code in dispatched
  const handleEditShipping = (order) => {
    setEditShippingId(order._id);
    setEditShippingValue(order.shippingCode || "");
  };
  const handleSaveEditShipping = async (orderId) => {
    const code = editShippingValue.trim();
    if (!code) return setError("Shipping code required.");
    setLoading(true);
    setError("");
    try {
      const url = `${BACKEND_URL}/api/admin-update-shipping`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, shippingCode: code })
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        const text = await res.text();
        throw new Error(`Invalid JSON from backend: ${text}`);
      }
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      if (!data.success) throw new Error(data.error || "Failed to update shipping code.");
      setEditShippingId(null);
      setEditShippingValue("");
      await refreshOrders();
      setScrollToId(orderId);
      setError("");
      // Removed alert("Shipping code updated!");
    } catch (err) {
      setError(err.message);
      // Debug log
      console.error("Edit shipping code error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'dispatched' && scrollToId && dispatchedRefs.current[scrollToId]) {
      dispatchedRefs.current[scrollToId].scrollIntoView({ behavior: 'smooth', block: 'center' });
      setScrollToId(null);
    }
  }, [orders.dispatched, activeTab, scrollToId]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <GoogleLogin 
          onSuccess={handleLoginSuccess} 
          onError={() => setError('Login failed.')}
          scope="openid email profile"
        />
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto pt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div>
          <span className="mr-4">{user.email}</span>
          <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
        </div>
      </div>
      <div className="mb-4 flex gap-2">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded ${activeTab === tab.key ? 'bg-primary text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {loading ? (
          <div className="text-blue-600 font-semibold">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : orders[activeTab] && orders[activeTab].length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-3 py-2 border-b text-left">Order ID</th>
                  <th className="px-3 py-2 border-b text-left">Name</th>
                  <th className="px-3 py-2 border-b text-left">Email</th>
                  <th className="px-3 py-2 border-b text-left">Phone</th>
                  <th className="px-3 py-2 border-b text-left">Status</th>
                  <th className="px-3 py-2 border-b text-left">Total</th>
                  <th className="px-3 py-2 border-b text-left">Date</th>
                  {(activeTab === "new" || activeTab === "dispatched") && (
                    <th className="px-3 py-2 border-b text-left">Shipping Code</th>
                  )}
                  {activeTab === "new" && (
                    <th className="px-3 py-2 border-b text-left">Action</th>
                  )}
                  {activeTab === "dispatched" && (
                    <th className="px-3 py-2 border-b text-left">Edit</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {orders[activeTab].map(order => (
                  <tr
                    key={order._id}
                    className="hover:bg-blue-50"
                    ref={activeTab === 'dispatched' ? el => dispatchedRefs.current[order._id] = el : null}
                  >
                    <td className="px-3 py-2 border-b">{order._id}</td>
                    <td className="px-3 py-2 border-b">{order.name || '-'}</td>
                    <td className="px-3 py-2 border-b">{order.email || '-'}</td>
                    <td className="px-3 py-2 border-b">{order.phone || '-'}</td>
                    <td className="px-3 py-2 border-b">{order.status || '-'}</td>
                    <td className="px-3 py-2 border-b">₹{order.items ? order.items.reduce((sum, item) => sum + (item.numericPrice * item.quantity), 0) + (order.shippingFee || 0) : '-'}</td>
                    <td className="px-3 py-2 border-b">{order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}</td>
                    {activeTab === "new" && (
                      <>
                        <td className="px-3 py-2 border-b">
                          <input
                            type="text"
                            className="border px-2 py-1 rounded w-32"
                            value={shippingCodes[order._id] || ''}
                            onChange={e => setShippingCodes({ ...shippingCodes, [order._id]: e.target.value })}
                            placeholder="Enter code"
                          />
                        </td>
                        <td className="px-3 py-2 border-b">
                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded"
                            onClick={() => handleSaveShippingCode(order._id)}
                          >Save</button>
                        </td>
                      </>
                    )}
                    {activeTab === "dispatched" && (
                      <>
                        <td className="px-3 py-2 border-b">
                          {editShippingId === order._id ? (
                            <input
                              type="text"
                              className="border px-2 py-1 rounded w-32"
                              value={editShippingValue}
                              onChange={e => setEditShippingValue(e.target.value)}
                            />
                          ) : (
                            order.shippingCode || '-'
                          )}
                        </td>
                        <td className="px-3 py-2 border-b">
                          {editShippingId === order._id ? (
                            <button
                              className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                              onClick={() => handleSaveEditShipping(order._id)}
                            >Save</button>
                          ) : (
                            <button
                              className="bg-gray-300 text-gray-800 px-3 py-1 rounded"
                              onClick={() => handleEditShipping(order)}
                            >Edit</button>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-500">No orders found for <b>{TABS.find(t => t.key === activeTab).label}</b>.</div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
