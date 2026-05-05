import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, IconButton, Divider, Grid, Card, Stack
} from '@mui/material';
import { Add, Remove, Delete, ArrowForward, ShoppingCart } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);
import toast from 'react-hot-toast';
import { useCartStore } from '../../stores/cartStore';
import DetailSkeleton from '../../components/skeletons/DetailSkeleton';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, isLoading, initialized, fetchCart, updateQuantity, removeItem, clearCart } = useCartStore();
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!initialized) {
      fetchCart();
    }
  }, [fetchCart, initialized]);

  const handleUpdateQuantity = async (productId: string, newQty: number) => {
    try {
      await updateQuantity(productId, newQty);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeItem(productId);
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success('Cart cleared');
      setShowConfirm(false);
    } catch {
      toast.error('Failed to clear cart');
    }
  };

  if (isLoading && !initialized) return <DetailSkeleton type="order" />;

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
            Your Cart
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.8, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
            Review your botanical acquisitions
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

      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 6 }, mt: { xs: -2.5, md: -6 }, position: 'relative', zIndex: 3 }}>
        {items.length === 0 ? (
          <MotionBox 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ 
              textAlign: 'center', 
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
            <ShoppingCart sx={{ fontSize: 64, color: 'primary.main', opacity: 0.15, mb: 3 }} />
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 700, fontFamily: '"Playfair Display", serif', color: 'primary.dark' }}>
              A Quiet Registry
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: 400, mx: 'auto', lineHeight: 1.8 }}>
              Your acquisition cart is currently empty. Begin adding botanical selections to orchestrate your new regimen.
            </Typography>
            <Button
              component={Link}
              to="/shop"
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
              Explore Apothecary
            </Button>
          </MotionBox>
        ) : (
          <Grid container spacing={{ xs: 2.5, lg: 6 }}>
            {/* Cart Ledger */}
            <Grid size={{ xs: 12, md: 8 }}>
              <MotionBox initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Card sx={{ borderRadius: '32px', boxShadow: '0 40px 80px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                  <Box sx={{ p: { xs: 2, md: 5 } }}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between', 
                        alignItems: { xs: 'flex-start', sm: 'center' }, 
                        mb: { xs: 2.5, md: 4 },
                        gap: 2
                      }}
                    >
                      <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: '"Playfair Display", serif', color: 'primary.dark' }}>
                        Selected Items <Typography component="span" sx={{ color: 'text.secondary', fontSize: '1rem', ml: 1 }}>({totalItems})</Typography>
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => setShowConfirm(true)}
                        sx={{
                          color: 'error.main',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          borderRadius: '50px',
                          border: '1px solid rgba(170,57,43,0.2)',
                          px: 2,
                          py: 0.8,
                          '&:hover': { bgcolor: 'rgba(170,57,43,0.05)' },
                        }}
                      >
                        Clear Items
                      </Button>
                    </Box>

                    <Stack spacing={0} divider={<Divider sx={{ opacity: 0.5 }} />}>
                      <AnimatePresence mode="popLayout">
                        {items.map((item) => (
                          <MotionBox
                            key={item._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            sx={{
                              display: 'flex',
                              gap: { xs: 1.5, md: 4 },
                              py: { xs: 2.5, md: 4 },
                              px: { xs: 0, md: 2 },
                              alignItems: 'center',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            {/* Image */}
                            <Box
                              component={Link}
                              to={`/products/${item.product._id}`}
                              sx={{
                                width: { xs: 75, md: 100 },
                                height: { xs: 95, md: 130 },
                                flexShrink: 0,
                                bgcolor: 'rgba(45,75,56,0.02)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                borderRadius: '16px',
                                border: '1px solid rgba(0,0,0,0.04)',
                              }}
                            >
                              {item.product.image ? (
                                <Box
                                  component="img"
                                  src={item.product.image}
                                  alt={item.product.name}
                                  sx={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover',
                                    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': { transform: 'scale(1.1)' }
                                  }}
                                />
                              ) : (
                                <Typography sx={{ color: 'rgba(0,0,0,0.1)', fontWeight: 900, fontSize: '1.5rem' }}>
                                  A
                                </Typography>
                              )}
                            </Box>

                            {/* Info */}
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                component={Link}
                                to={`/products/${item.product._id}`}
                                sx={{
                                  fontSize: { xs: '1rem', md: '1.25rem' },
                                  fontWeight: 800,
                                  textDecoration: 'none',
                                  color: 'primary.dark',
                                  '&:hover': { color: 'primary.main' },
                                  display: 'block',
                                  mb: 0.5
                                }}
                              >
                                {item.product.name}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block' }}>
                                ${item.product.price?.toFixed(2)} / unit
                              </Typography>

                              {/* Quantity controls */}
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: { xs: 2, md: 3 }, flexWrap: 'wrap' }}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    border: '1px solid rgba(0,0,0,0.08)',
                                    borderRadius: '50px',
                                    bgcolor: 'white',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                                  }}
                                >
                                  <IconButton
                                    onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    sx={{ p: 1 }}
                                  >
                                    <Remove fontSize="small" sx={{ opacity: item.quantity <= 1 ? 0.3 : 0.8 }} />
                                  </IconButton>
                                  <Typography sx={{ px: 2, fontSize: '0.9rem', fontWeight: 800, minWidth: 20, textAlign: 'center' }}>
                                    {item.quantity}
                                  </Typography>
                                  <IconButton
                                    onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                                    sx={{ p: 1 }}
                                  >
                                    <Add fontSize="small" sx={{ color: 'primary.main' }} />
                                  </IconButton>
                                </Box>
                                <Button
                                  size="small"
                                  onClick={() => handleRemoveItem(item.product._id)}
                                  startIcon={<Delete />}
                                  color="error"
                                  sx={{ 
                                    fontWeight: 700, 
                                    letterSpacing: '0.05em', 
                                    textTransform: 'none',
                                    borderRadius: '50px',
                                    px: 2,
                                    py: 0.8,
                                    bgcolor: 'rgba(170,57,43,0.04)',
                                    '&:hover': { bgcolor: 'rgba(170,57,43,0.08)' }
                                  }}
                                >
                                  Remove
                                </Button>
                              </Box>
                            </Box>

                            {/* Line total */}
                            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 0.5 }}>
                                Total
                              </Typography>
                              <Typography
                                sx={{
                                  fontWeight: 900,
                                  fontSize: '1.25rem',
                                  color: 'primary.dark',
                                  fontFamily: '"DM Sans", sans-serif'
                                }}
                              >
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </Typography>
                            </Box>
                          </MotionBox>
                        ))}
                      </AnimatePresence>
                    </Stack>

                  </Box>
                </Card>
              </MotionBox>
            </Grid>

            {/* Order Summary */}
            <Grid size={{ xs: 12, md: 4 }}>
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
                    Financial Ledger
                  </Typography>

                  <Stack spacing={2} sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Subtotal</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>${totalPrice.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Shipping & Handling</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                        $0.00
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Archival Tax (0%)</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>$0.00</Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 3, opacity: 0.5}} />

                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mb: 4 }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main', fontFamily: '"DM Sans", sans-serif' }}>
                      ${totalPrice.toFixed(2)}
                    </Typography>
                  </Box>


                  <Button
                    fullWidth
                    variant="contained"
                    size="medium"
                    onClick={() => navigate('/checkout')}
                    endIcon={<ArrowForward />}
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
                    Proceed to Checkout
                  </Button>

                  <Button
                    component={Link}
                    to="/shop"
                    fullWidth
                    sx={{
                      mt: 2,
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                    }}
                  >
                    Return to Shop
                  </Button>
                </Box>
              </MotionBox>
            </Grid>
          </Grid>
        )}
      </Container>
      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleClearCart}
        title="Clear Cart"
        message="Are you sure you want to remove all items from your cart? This action cannot be undone."
        confirmText="Clear Everything"
        loading={isLoading}
      />
    </Box>
  );
}

