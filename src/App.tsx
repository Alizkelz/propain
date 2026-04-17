import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import './i18n';
import { useTranslation } from 'react-i18next';

// Layouts
import PublicLayout from './pages/PublicLayout';
import AdminLayout from './pages/admin/AdminLayout';

// Public Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ProductsAdmin from './pages/admin/ProductsAdmin';
import OrdersAdmin from './pages/admin/OrdersAdmin';
import ChatAdmin from './pages/admin/ChatAdmin';
import SettingsAdmin from './pages/admin/SettingsAdmin';

export default function App() {
  const { i18n } = useTranslation();
  const [isAdminReady, setIsAdminReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      // In this system, any logged in user is admin
      setIsAdmin(!!user);
      setIsAdminReady(true);
    });
    return unsub;
  }, []);

  if (!isAdminReady) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />

        {/* Admin Routes */}
        <Route element={isAdmin ? <AdminLayout /> : <Login />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductsAdmin />} />
          <Route path="/admin/orders" element={<OrdersAdmin />} />
          <Route path="/admin/chat" element={<ChatAdmin />} />
          <Route path="/admin/settings" element={<SettingsAdmin />} />
        </Route>
      </Routes>
    </Router>
  );
}
