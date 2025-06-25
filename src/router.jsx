import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
// Import other pages as needed

const AppRouter = () => (
  <Routes>
    <Route path="/admin" element={<AdminPage />} />
    {/* Add other routes here, e.g. <Route path="/" element={<HomePage />} /> */}
    <Route path="*" element={<div>404 Not Found</div>} />
  </Routes>
);

export default AppRouter;
