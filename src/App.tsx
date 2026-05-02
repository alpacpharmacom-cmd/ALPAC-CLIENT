import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import theme from './theme';
import { useAuthStore } from './stores/authStore';
import { useCartStore } from './stores/cartStore';
import { useWishlistStore } from './stores/wishlistStore';

// Layouts
import StoreLayout from './components/layout/StoreLayout';
import AdminLayout from './components/layout/AdminLayout';

// Guards
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import ScrollToTop from './components/common/ScrollToTop';

// Store Pages
import HomePage from './pages/store/HomePage';
import ShopPage from './pages/store/ShopPage';
import ProductPage from './pages/store/ProductPage';
import CartPage from './pages/store/CartPage';
import CheckoutPage from './pages/store/CheckoutPage';
import LoginPage from './pages/store/LoginPage';
import RegisterPage from './pages/store/RegisterPage';
import ProfilePage from './pages/store/ProfilePage';
import OrdersPage from './pages/store/OrdersPage';
import OrderDetailPage from './pages/store/OrderDetailPage';
import AboutPage from './pages/store/AboutPage';
import WishlistPage from './pages/store/WishlistPage';
import ForgotPasswordPage from './pages/store/ForgotPasswordPage';
import ResetPasswordPage from './pages/store/ResetPasswordPage';

// Admin Pages
import AdminDashboard from './pages/admin/DashboardPage';
import AdminProductsPage from './pages/admin/ProductsPage';
import ProductFormPage from './pages/admin/ProductFormPage';
import AdminProductDetailPage from './pages/admin/ProductDetailPage';
import AdminOrdersPage from './pages/admin/OrdersPage';
import AdminOrderDetailPage from './pages/admin/OrderDetailPage';
import AdminUsersPage from './pages/admin/UsersPage';
import AdminUserDetailPage from './pages/admin/UserDetailPage';

function App() {
  const loadUser = useAuthStore((state) => state.loadUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const resetCart = useCartStore((state) => state.resetCart);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const resetWishlist = useWishlistStore((state) => state.resetWishlist);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    } else {
      resetCart();
      resetWishlist();
    }
  }, [isAuthenticated, fetchCart, fetchWishlist, resetCart, resetWishlist]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: '#1a1a1a',
            color: '#fff',
            fontSize: '0.85rem',
            fontFamily: '"DM Sans", sans-serif',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          },
        }}
      />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Storefront */}
          <Route element={<StoreLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            {/* Protected */}
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
          </Route>

          {/* Admin */}
          <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/products/new" element={<ProductFormPage />} />
            <Route path="/admin/products/:id" element={<AdminProductDetailPage />} />
            <Route path="/admin/products/:id/edit" element={<ProductFormPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/users/:id" element={<AdminUserDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
