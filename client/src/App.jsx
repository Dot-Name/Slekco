import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

import AdminLayout from './components/admin/AdminLayout';
import RequireAdmin from './components/admin/RequireAdmin';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import ProductForm from './pages/admin/ProductForm';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';
import AdminMessages from './pages/admin/Messages';

export default function App() {
  return (
    <Routes>
      {/* Storefront */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:slug" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order/:orderNumber" element={<OrderConfirmation />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="account" element={<Account />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin console — signed-in admins only */}
      <Route
        path="admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id" element={<ProductForm />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="messages" element={<AdminMessages />} />
      </Route>
    </Routes>
  );
}
