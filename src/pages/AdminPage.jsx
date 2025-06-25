import React, { useState, useEffect } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';

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

  // Google login success handler
  const handleLoginSuccess = async (credentialResponse) => {
    // Fetch user info from Google
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${credentialResponse.credential}` },
    });
    const profile = await res.json();
    if (ALLOWED_EMAILS.includes(profile.email)) {
      setUser(profile);
      setError('');
    } else {
      setError('Access denied: unauthorized email.');
      setUser(null);
    }
  };

  const handleLogout = () => {
    setUser(null);
    googleLogout();
  };

  // Placeholder: fetch orders from backend here
  useEffect(() => {
    if (user) {
      setLoading(true);
      // TODO: fetch orders from backend
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <GoogleLogin onSuccess={handleLoginSuccess} onError={() => setError('Login failed.')} />
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
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
        {/* TODO: Render orders table for the active tab */}
        <div className="text-gray-500">Order data for <b>{TABS.find(t => t.key === activeTab).label}</b> will appear here.</div>
      </div>
    </div>
  );
}

export default AdminPage;
