import React, { useEffect, useState } from 'react';
import { BACKEND_URL } from '@/lib/config';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch orders for the logged-in user
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      let user = null;
      try {
        user = JSON.parse(localStorage.getItem('cresen_user'));
      } catch {}
      const email = user?.email;
      if (!email) {
        setError('You must be logged in to view your orders.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${BACKEND_URL}/api/get-orders?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          credentials: 'include', // assumes session or JWT cookie
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          setError('Failed to load orders.');
        }
      } catch (err) {
        setError('Failed to load orders.');
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  return (
    <div className="orders-page-container pt-24 sm:pt-20">
      <h2 className="orders-title">My Orders</h2>
      {loading && <p>Loading orders...</p>}
      {error && <p className="orders-error">{error}</p>}
      {!loading && !error && orders.length === 0 && <p>No paid orders found.</p>}
      {!loading && !error && orders.length > 0 && (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <img src="/thermalrolls.jpg" alt="Thermal Rolls" className="order-img" />
                <div className="order-header-details">
                  <div className="order-id"><b>Order ID:</b> {order._id}</div>
                  <div className="order-date"><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</div>
                  <div className="order-status"><b>Status:</b> {order.status === 'dispatched' ? 'Dispatched' : 'Preparing'}</div>
                  {order.status === 'dispatched' && order.shippingCode && (
                    <div><b>Shipping Code:</b> {order.shippingCode}</div>
                  )}
                </div>
              </div>
              <div className="order-details">
                <div><b>Name:</b> {order.name}</div>
                <div><b>Phone:</b> {order.phone}</div>
                <div><b>Address:</b> {order.shippingAddress?.address}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode}</div>
                <div><b>Items:</b>
                  <ul>
                    {order.items && order.items.map((item, idx) => (
                      <li key={idx}>{item.title} x {item.quantity} (₹{item.numericPrice})</li>
                    ))}
                  </ul>
                </div>
                <div><b>Shipping Fee:</b> ₹{order.shippingFee}</div>
                <div><b>Grand Total:</b> ₹{(order.items?.reduce((sum, item) => sum + (item.numericPrice * item.quantity), 0) + (order.shippingFee || 0))}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`
        .orders-page-container {
          padding: 2rem 1rem;
          max-width: 900px;
          margin: 0 auto;
          padding-top: 6.5rem;
        }
        .orders-title {
          font-size: 2.2rem;
          font-weight: 800;
          margin-bottom: 2rem;
          color: #0f172a;
          letter-spacing: -1px;
          text-align: center;
        }
        .orders-error {
          color: #dc2626;
          text-align: center;
        }
        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .order-card {
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          background: linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%);
          box-shadow: 0 4px 16px rgba(30,41,59,0.07);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .order-card:hover {
          box-shadow: 0 8px 32px rgba(30,41,59,0.13);
          transform: translateY(-2px) scale(1.01);
        }
        .order-header {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }
        .order-img {
          width: 90px;
          height: 90px;
          object-fit: cover;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: #f1f5f9;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .order-header-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .order-id, .order-date, .order-status {
          font-size: 1.02rem;
          color: #334155;
        }
        .order-status {
          font-weight: 600;
          color: #0ea5e9;
        }
        .order-status:before {
          content: '';
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 6px;
          background: #fbbf24;
        }
        .order-status:after {
          content: attr(data-status);
        }
        .order-details {
          margin-top: 0.5rem;
          background: #f1f5f9;
          border-radius: 10px;
          padding: 1rem 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .order-details div {
          font-size: 1.01rem;
          color: #475569;
        }
        .order-details ul {
          margin: 0.5rem 0 0 1.5rem;
        }
        .order-details li {
          font-size: 0.98rem;
        }
        @media (max-width: 600px) {
          .orders-page-container {
            padding: 1rem 0.2rem;
            padding-top: 5.5rem;
          }
          .orders-title {
            font-size: 1.4rem;
            margin-bottom: 1.2rem;
          }
          .order-card {
            padding: 1rem 0.5rem;
            border-radius: 12px;
          }
          .order-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.7rem;
          }
          .order-img {
            width: 70px;
            height: 70px;
            border-radius: 8px;
          }
          .order-header-details {
            gap: 0.2rem;
          }
          .order-details {
            padding: 0.7rem 0.7rem;
            border-radius: 7px;
          }
        }
      `}</style>
    </div>
  );
};

export default OrdersPage;
