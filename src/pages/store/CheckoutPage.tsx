import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, TextField, Button, Divider, Card, Stack
} from '@mui/material';
import { LocalMall, ArrowForward, Lock, LocalOffer, AutoAwesome } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);
import toast from 'react-hot-toast';
import { ordersAPI } from '../../api/orders.api';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import DetailSkeleton from '../../components/skeletons/DetailSkeleton';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, totalPrice, fetchCart, resetCart, isLoading } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
  });
  const [isFirstOrder, setIsFirstOrder] = useState(false);

  useEffect(() => {
    fetchCart();
    checkFirstOrder();
  }, []);

  const checkFirstOrder = async () => {
    try {
      const { data } = await ordersAPI.getMyOrders();
      // data.data is the array of orders
      setIsFirstOrder(data.data.length === 0);
    } catch (error) {
      console.error('Failed to check order history:', error);
    }
  };

  const discountPrice = isFirstOrder ? Number((totalPrice * 0.1).toFixed(2)) : 0;
  const total = Number((totalPrice - discountPrice).toFixed(2));

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.state || !address.zipCode || !address.country) {
      toast.error('Please fill in all shipping fields');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

      const { data } = await ordersAPI.create({
        orderItems,
        shippingAddress: address,
      });

      resetCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${data.data._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <DetailSkeleton type="order" />;

  if (items.length === 0 && !loading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <MotionBox 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{ 
            py: { xs: 8, md: 12 }, 
            px: 4,
            bgcolor: 'white',
            borderRadius: '32px',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.05)',
            maxWidth: 800,
            mx: 'auto'
          }}
        >
          <LocalMall sx={{ fontSize: 64, color: 'primary.main', opacity: 0.15, mb: 3 }} />
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 700, fontFamily: '"Playfair Display", serif', color: 'primary.dark' }}>
            No Acquisitions Pending
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: 400, mx: 'auto', lineHeight: 1.8 }}>
            Your checkout flow requires selections. Return to the apothecary to discover new botanical remedies.
          </Typography>
          <Button
            onClick={() => navigate('/shop')}
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              px: 5, 
              py: 1.5,
              borderRadius: '50px',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              boxShadow: '0 8px 25px rgba(45,75,56,0.3)',
              '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)' },
              transition: 'all 0.3s ease'
            }}
          >
            Return to Shop
          </Button>
        </MotionBox>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'transparent' }}>
      <Box 
        sx={{ 
          bgcolor: 'primary.dark', 
          pt: { xs: 8, md: 12 }, 
          pb: { xs: 8, md: 12 }, 
          mb: 3,
          textAlign: 'center', 
          color: 'white', 
          position: 'relative', 
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(180deg, rgba(26,46,31,1) 0%, rgba(45,75,56,0.95) 100%)',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h1"
            sx={{ 
              fontWeight: 700, 
              fontSize: { xs: '2.5rem', md: '4rem' }, 
              fontFamily: '"Playfair Display", serif',
              letterSpacing: '-0.02em',
              mb: 2
            }}
          >
            Checkout Protocol
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.8, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
            Finalize your botanical selections
          </Typography>
        </Box>
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0, 
            background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)', 
            pointerEvents: 'none',
            opacity: 0.1
          }} 
        />
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={6}>
          {/* Shipping Address */}
          <Grid size={{ xs: 12, md: 7 }}>
            <MotionBox initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card sx={{ borderRadius: '32px', boxShadow: '0 40px 80px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                {isFirstOrder && (
                  <Box 
                    sx={{ 
                      bgcolor: 'secondary.main', 
                      color: 'white', 
                      px: 3, 
                      py: 2, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      backgroundImage: 'linear-gradient(45deg, rgba(184,149,106,1) 0%, rgba(202,186,166,1) 100%)',
                    }}
                  >
                    <AutoAwesome sx={{ fontSize: 24 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem' }}>
                        Botanical Welcome Gift
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, opacity: 0.9 }}>
                        Enjoy a 10% discount on your first acquisition as part of the Alpac collective.
                      </Typography>
                    </Box>
                  </Box>
                )}
                <Box sx={{ p: { xs: 3, md: 5 } }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      fontFamily: '"Playfair Display", serif',
                      color: 'primary.dark',
                      mb: 4,
                    }}
                  >
                    Delivery Destination
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="Street Address"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        required
                        slotProps={{ input: { sx: { borderRadius: '12px', bgcolor: '#fbfaf8' } } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="City"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        required
                        slotProps={{ input: { sx: { borderRadius: '12px', bgcolor: '#fbfaf8' } } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="State / Province"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        required
                        slotProps={{ input: { sx: { borderRadius: '12px', bgcolor: '#fbfaf8' } } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="ZIP / Postal Code"
                        value={address.zipCode}
                        onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                        required
                        slotProps={{ input: { sx: { borderRadius: '12px', bgcolor: '#fbfaf8' } } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Country"
                        value={address.country}
                        onChange={(e) => setAddress({ ...address, country: e.target.value })}
                        required
                        slotProps={{ input: { sx: { borderRadius: '12px', bgcolor: '#fbfaf8' } } }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </MotionBox>
          </Grid>

          {/* Order Summary */}
          <Grid size={{ xs: 12, md: 5 }}>
            <MotionBox initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Box
                sx={{
                  bgcolor: 'white',
                  p: 4,
                  pt: 5,
                  position: 'sticky',
                  top: 100,
                  borderRadius: '32px',
                  border: '2px rgba(45,75,56,0.15)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.04)',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    fontFamily: '"Playfair Display", serif',
                    color: 'primary.dark',
                    mb: 4,
                  }}
                >
                  Final Execution
                </Typography>

                <Stack spacing={2} sx={{ mb: 4 }}>
                  {items.map((item) => (
                    <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        {item.product.name} × {item.quantity}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Divider sx={{ my: 3, opacity: 0.5 }} />

                <Stack spacing={2} sx={{ mb: 4 }}>
                   <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Subtotal</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>${totalPrice.toFixed(2)}</Typography>
                  </Box>
                  {isFirstOrder && (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      bgcolor: 'rgba(61,107,79,0.05)', 
                      p: 2, 
                      mx: -2, 
                      borderRadius: '12px',
                      border: '1px dashed rgba(61,107,79,0.3)'
                    }}>
                      <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalOffer sx={{ fontSize: 16 }} /> First Order Reward
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 900, color: 'primary.main' }}>-${discountPrice.toFixed(2)}</Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Shipping & Handling</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                      Complimentary
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Archival Tax (0%)</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>$0.00</Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 3, opacity: 0.5 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mb: 4 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'text.secondary', mb: 0.5 }}>
                    Total Investment
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main', fontFamily: '"DM Sans", sans-serif' }}>
                    ${total.toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="medium"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  endIcon={!loading ? <Lock /> : undefined}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    py: 1.8,
                    borderRadius: '50px',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    boxShadow: '0 8px 25px rgba(45,75,56,0.25)',
                    '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)' },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? 'Authorizing...' : 'Authorize Transaction'}
                </Button>
              </Box>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
