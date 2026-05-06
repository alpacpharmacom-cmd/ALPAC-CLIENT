import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
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

// Store Pages (Lazy Loaded)
const HomePage = lazy(() => import('./pages/store/HomePage'));
const ShopPage = lazy(() => import('./pages/store/ShopPage'));
const ProductPage = lazy(() => import('./pages/store/ProductPage'));
const CartPage = lazy(() => import('./pages/store/CartPage'));
const CheckoutPage = lazy(() => import('./pages/store/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/store/LoginPage'));
const RegisterPage = lazy(() => import('./pages/store/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/store/ProfilePage'));
const OrdersPage = lazy(() => import('./pages/store/OrdersPage'));
const OrderDetailPage = lazy(() => import('./pages/store/OrderDetailPage'));
const AboutPage = lazy(() => import('./pages/store/AboutPage'));
const WishlistPage = lazy(() => import('./pages/store/WishlistPage'));
const ForgotPasswordPage = lazy(() => import('./pages/store/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/store/ResetPasswordPage'));

// Admin Pages (Lazy Loaded)
const AdminDashboard = lazy(() => import('./pages/admin/DashboardPage'));
const AdminProductsPage = lazy(() => import('./pages/admin/ProductsPage'));
const ProductFormPage = lazy(() => import('./pages/admin/ProductFormPage'));
const AdminProductDetailPage = lazy(() => import('./pages/admin/ProductDetailPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/OrdersPage'));
const AdminOrderDetailPage = lazy(() => import('./pages/admin/OrderDetailPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/UsersPage'));
const AdminUserDetailPage = lazy(() => import('./pages/admin/UserDetailPage'));

const PageLoader = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999,
      bgcolor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(8px)'
    }}
  >
    <CircularProgress color="primary" size={40} />
  </Box>
);

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
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
