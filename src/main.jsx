import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import '@/components/ui/button'; 
import '@/components/ui/toast';
import { Toaster } from '@/components/ui/toaster';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="693554057613-mit2vvteo8kknddq827dtv1vqre2kf26.apps.googleusercontent.com">
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);