import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, TextField, Button, Divider, Card, Stack,
  FormControlLabel, Checkbox, Tooltip
} from '@mui/material';
import { LocalMall, ArrowForward, Lock, LocalOffer, AutoAwesome, Save } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);
import toast from 'react-hot-toast';
import { ordersAPI } from '../../api/orders.api';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();
  const { items, totalPrice, fetchCart, resetCart, isLoading } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(true);
  // Stable key for this checkout session — prevents duplicate orders on slow connections / retries
  const idempotencyKey = useRef(crypto.randomUUID());

  const [shippingInfo, setShippingInfo] = useState({
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
  });
  const [isFirstOrder, setIsFirstOrder] = useState(false);

  // Re-sync from user profile whenever the user object loads/changes
  useEffect(() => {
    if (user) {
      setShippingInfo({
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || '',
      });
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
    checkFirstOrder();
  }, []);

  const checkFirstOrder = async () => {
    try {
      const { data } = await ordersAPI.getMyOrders();
      setIsFirstOrder(data.data.length === 0);
    } catch (error) {
      console.error('Failed to check order history:', error);
    }
  };

  const discountPrice = isFirstOrder ? Number((totalPrice * 0.1).toFixed(2)) : 0;
  const total = Number((totalPrice - discountPrice).toFixed(2));

  const handlePlaceOrder = async () => {
    if (!shippingInfo.phone) {
      toast.error('Please provide a contact phone number');
      return;
    }
    if (!shippingInfo.street || !shippingInfo.city || !shippingInfo.state || !shippingInfo.zipCode || !shippingInfo.country) {
      toast.error('Please fill in all shipping fields');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      // 1. Save address + phone back to the user's profile if opted in
      if (saveToProfile) {
        await updateProfile({
          phone: shippingInfo.phone,
          address: {
            street: shippingInfo.street,
            city: shippingInfo.city,
            state: shippingInfo.state,
            zipCode: shippingInfo.zipCode,
            country: shippingInfo.country,
          },
        });
      }

      // 2. Place the order
      const orderItems = items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

      const { data } = await ordersAPI.create({
        orderItems,
        shippingAddress: {
          street: shippingInfo.street,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
        },
        idempotencyKey: idempotencyKey.current,
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

  const fieldSx = { borderRadius: '12px', bgcolor: '#fbfaf8' };

  if (isLoading) return <LoadingSpinner />;

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
          pt: { xs: 4, md: 12 },
          pb: { xs: 4, md: 12 },
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
              fontSize: { xs: '2rem', md: '4rem' },
              fontFamily: '"Playfair Display", serif',
              letterSpacing: '-0.02em',
              mb: 1
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

      <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 6 } }}>
        <Grid container spacing={{ xs: 3, md: 6 }}>
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
                <Box sx={{ p: { xs: 2.5, md: 5 } }}>
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
                    Billing Details
                  </Typography>

                  <Grid container spacing={3}>
                    {/* Phone Number — full width, top of form */}
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="Contact Phone Number"
                        placeholder="+1 (555) 000-0000"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        required
                        type="tel"
                        slotProps={{ input: { sx: fieldSx } }}
                      />
                    </Grid>

                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="Street Address"
                        value={shippingInfo.street}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, street: e.target.value })}
                        required
                        slotProps={{ input: { sx: fieldSx } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="City"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        required
                        slotProps={{ input: { sx: fieldSx } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="State / Province"
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                        required
                        slotProps={{ input: { sx: fieldSx } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="ZIP / Postal Code"
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                        required
                        slotProps={{ input: { sx: fieldSx } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Country"
                        value={shippingInfo.country}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                        required
                        slotProps={{ input: { sx: fieldSx } }}
                      />
                    </Grid>

                    {/* Save to profile toggle */}
                    <Grid size={12}>
                      <Tooltip title="Your address and phone will be updated in your profile for future checkouts">
                        <FormControlLabel
                          control={
                            <Checkbox
                              id="save-address-to-profile"
                              checked={saveToProfile}
                              onChange={(e) => setSaveToProfile(e.target.checked)}
                              sx={{
                                color: 'primary.main',
                                '&.Mui-checked': { color: 'primary.main' },
                              }}
                              icon={<Save sx={{ fontSize: 20, opacity: 0.4 }} />}
                              checkedIcon={<Save sx={{ fontSize: 20 }} />}
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.85rem' }}>
                              Save shipping details to my profile
                            </Typography>
                          }
                        />
                      </Tooltip>
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
                  p: { xs: 2.5, md: 4 },
                  pt: { xs: 3, md: 5 },
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
                  Order Summary
                </Typography>

                <Stack spacing={2} sx={{ mb: 4 }}>
                  {items.map((item) => {
                    const { price, offer } = item.product;
                    const qty = item.quantity;
                    let lineTotal = price * qty;
                    if (offer && offer.isActive && offer.buy > 0 && offer.get > 0) {
                      const { buy, get } = offer;
                      const bundles = Math.floor(qty / (buy + get));
                      const remainder = qty % (buy + get);
                      const paidQty = (bundles * buy) + Math.min(remainder, buy);
                      lineTotal = price * paidQty;
                    }
                    return (
                      <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          {item.product.name} × {qty}
                        </Typography>
                        <Box sx={{ textAlign: 'right' }}>
                          {lineTotal < price * qty && (
                            <Typography variant="caption" sx={{ display: 'block', color: 'success.main', fontWeight: 800 }}>
                              −${(price * qty - lineTotal).toFixed(2)} saved
                            </Typography>
                          )}
                          <Typography variant="body2" sx={{ fontWeight: 800 }}>
                            ${lineTotal.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>

                <Divider sx={{ my: 3, opacity: 0.5 }} />

                <Stack spacing={2} sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Subtotal</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      ${items.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)}
                    </Typography>
                  </Box>
                  {(() => {
                    const subtotalFull = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
                    const offerSavings = subtotalFull - totalPrice;
                    if (offerSavings > 0.001) {
                      return (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#27ae60' }}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>Offer Savings</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 900 }}>−${offerSavings.toFixed(2)}</Typography>
                        </Box>
                      );
                    }
                    return null;
                  })()}
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
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Shipping &amp; Handling</Typography>
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
                    Total Price
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
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              </Box>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
