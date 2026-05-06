import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, Chip, Divider, Button, Stack, Card, Avatar,
} from '@mui/material';
import { ArrowBack, ReceiptLong,  } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { ordersAPI } from '../../api/orders.api';
import { useAuthStore } from '../../stores/authStore';
import { useOrderStore } from '../../stores/orderStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion.create(Box);

const statusColors: Record<string, string> = {
  pending: '#f4a03c', // Vibrant Orange
  accepted: '#2D4B38', // Deep Alpac Green
  processing: '#5b7fa5', // Blueish
  shipped: '#6c5ce7', // Purple
  delivered: '#2D4B38', // Deep Alpac Green
  declined: '#aa392b', // Deep Red
  cancelled: '#7f8c8d', // Gray
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuthStore();
  const { fetchedOrders, fetchMyOrders } = useOrderStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (isAdmin) {
          const { data } = await ordersAPI.getById(id!);
          setOrder(data.data);
        } else {
          if (!fetchedOrders) {
            await fetchMyOrders();
          }
          // Get fresh state from store after potential fetch
          const currentOrders = useOrderStore.getState().myOrders;
          const targetOrder = currentOrders.find((o: any) => o._id === id);
          if (!targetOrder) throw new Error('Order not found');
          setOrder(targetOrder);
        }
      } catch {
        toast.error('Order not found');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, isAdmin, fetchedOrders, fetchMyOrders]);

  const handleCancel = async () => {
    try {
      const { data } = await ordersAPI.cancel(id!);
      setOrder(data.data);
      if (!isAdmin) {
        fetchMyOrders(true); // Invalidate cache so OrdersPage shows updated status
      }
      toast.success('Order cancelled');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return (
    <Container sx={{ py: 15, textAlign: 'center' }}>
      <Typography variant="h3" sx={{ fontFamily: '"Playfair Display", serif', mb: 3 }}>Archive Record Not Found</Typography>
      <Button component={Link} to="/orders" variant="outlined" sx={{ borderRadius: '12px', px: 4 }}>
        Return to History
      </Button>
    </Container>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'transparent', pb: 10 }}>
      {/* Grand Archival Hero - Immersive botanical gradient */}
      <Box 
        sx={{ 
          bgcolor: 'primary.dark', 
          pt: { xs: 4, md: 12 }, 
          pb: { xs: 6, md: 15 }, 
          textAlign: 'center', 
          color: 'white', 
          position: 'relative', 
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(180deg, #1A2E1F 0%, #2D4B38 100%)',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="subtitle2" sx={{ opacity: 0.6, fontWeight: 800, letterSpacing: '0.4em', textTransform: 'uppercase', fontSize: '0.7rem', mb: 2 }}>
              Alpac Governance Collection
            </Typography>
            <Typography
              variant="h1"
              sx={{ 
                fontWeight: 800, 
                fontSize: { xs: '2rem', md: '4rem' }, 
                fontFamily: '"Playfair Display", serif',
                letterSpacing: '-0.02em',
                mb: 1
              }}
            >
              Order Archive
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.5, fontSize: '0.85rem', letterSpacing: '0.05em' }}>
              SECURE RECORD • {order._id.toUpperCase()}
            </Typography>
          </MotionBox>
        </Container>
        
        {/* Archival watermark effect */}
        <Box 
          sx={{ 
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '100%', height: '100%',
            opacity: 0.05, filter: 'grayscale(1)',
            backgroundImage: 'radial-gradient(circle at center, white 0%, transparent 70%)',
            pointerEvents: 'none'
          }} 
        />
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, position: 'relative', zIndex: 3 }}>
        {/* Action Layer */}
        <Stack spacing={3} sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Button
              component={Link}
              to="/orders"
              startIcon={<ArrowBack />}
              sx={{ 
                color: 'white', 
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontSize: '0.65rem',
                px: 3,
                py: 1.2,
                bgcolor: 'primary.main',
                borderRadius: '50px',
                boxShadow: '0 8px 24px rgba(45,75,56,0.25)',
                '&:hover': { bgcolor: 'primary.dark', transform: 'translateX(-4px)' },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Back to Orders
            </Button>
          </Box>
        </Stack>

        <AnimatePresence mode="wait">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Archival Card */}
            <Card sx={{ borderRadius: '32px', boxShadow: '0 60px 120px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)', overflow: 'hidden' }}>
              <Grid container>
                {/* Left Side: Acquisition Record */}
                <Grid size={{ xs: 12, md: 8 }} sx={{ p: { xs: 2.5, md: 6 } }}>
                  {/* High-Contrast Registry Stamp */}
                  <Box sx={{ mb: { xs: 4, md: 8 }, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', mb: 1 }}>
                        Reference
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.dark', fontFamily: '"DM Sans", sans-serif', letterSpacing: '-0.03em' }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', mb: 1 }}>
                        Date
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </Typography>
                      <Chip
                        label={`${order.status.toUpperCase()}`}
                        sx={{
                          bgcolor: statusColors[order.status] || '#5b7fa5', // Fallback to blueish if needed, but primarily uses the status color
                          color: 'white',
                          fontWeight: 900,
                          fontSize: '0.65rem',
                          letterSpacing: '0.1em',
                          px: 1,
                          borderRadius: '50px',
                          boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                          border: `1px solid rgba(255,255,255,0.2)`
                        }}
                      />
                    </Box>
                  </Box>

                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 4 }}>
                    <ReceiptLong sx={{ color: 'primary.main', opacity: 0.8, fontSize: '1.6rem' }} />
                    <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: '"Playfair Display", serif', color: 'primary.dark' }}>
                      Products
                    </Typography>
                  </Stack>                  <Stack spacing={3}>
                    {order.orderItems?.map((item: any, i: number) => (
                      <MotionBox
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: { xs: 1.5, md: 4 }, 
                          p: { xs: 1.5, md: 3 },
                          borderRadius: '24px', 
                          border: '1px solid rgba(0,0,0,0.03)',
                          bgcolor: 'white',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                          transition: 'all 0.3s ease',
                          '&:hover': { transform: 'scale(1.01)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderColor: 'primary.main' }
                        }}
                      >
                        <Avatar
                          src={item.image}
                          variant="rounded"
                          sx={{
                            width: { xs: 70, md: 100 },
                            height: { xs: 90, md: 130 },
                            borderRadius: '16px',
                            border: '1px solid rgba(0,0,0,0.06)',
                          }}
                        >
                          {item.name?.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1, py: 1, display: 'flex', flexDirection: 'column', height: '100%', minHeight: { md: 110 } }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 800, 
                              color: 'text.primary', 
                              mb: 1.5, 
                              lineHeight: 1.2,
                              fontFamily: '"DM Sans", sans-serif',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              fontSize: { xs: '1rem', md: '1.2rem' }
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Box sx={{ 
                            mt: 'auto', 
                            display: 'flex', 
                            flexDirection: { xs: 'column', md: 'row' }, 
                            justifyContent: 'space-between', 
                            alignItems: { xs: 'flex-start', md: 'flex-end' },
                            gap: { xs: 1.5, md: 0 }
                          }}>
                            <Box sx={{ px: { xs: 1.5, md: 1.5 }, py: 0.5, bgcolor: '#fbfaf8', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', display: 'inline-block' }}>
                              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                                <Box component="span" sx={{ color: 'primary.main', fontWeight: 900 }}>{item.quantity} UNIT{item.quantity > 1 ? 'S' : ''}</Box> &nbsp;×&nbsp; ${item.price?.toFixed(2)}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right', alignSelf: 'flex-end', pb: { md: 1 } }}>
                              {/* Show offer savings if totalItemPrice is less than full price */}
                              {item.totalItemPrice < item.price * item.quantity && (
                                <Typography variant="caption" sx={{ display: 'block', color: 'success.main', fontWeight: 800, mb: 0.5 }}>
                                  -{`$${(item.price * item.quantity - item.totalItemPrice).toFixed(2)}`} offer savings
                                </Typography>
                              )}
                              <Typography variant="h5" sx={{
                                fontWeight: 900,
                                color: 'primary.dark',
                                fontFamily: '"DM Sans", sans-serif',
                              }}>
                                ${item.totalItemPrice?.toFixed(2)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </MotionBox>
                    ))}
                  </Stack>

                  {order.adminNote && (
                    <MotionBox 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      sx={{ mt: 8, p: 4, bgcolor: '#fbfaf8', borderRadius: '32px', border: '1px solid rgba(45,75,56,0.1)' }}
                    >
                      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
                        <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'primary.main' }}>
                          Strategic Note
                        </Typography>
                      </Stack>
                      <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.8, fontSize: '1.1rem', fontStyle: 'italic' }}>
                        "{order.adminNote}"
                      </Typography>
                    </MotionBox>
                  )}
                </Grid>

                {/* Right Side: Sidebar Protocol Pane (ASIDE ASIDE) */}
                <Grid size={{ xs: 12, md: 4 }} sx={{ bgcolor: '#fbfaf8', borderLeft: { md: '1px solid rgba(0,0,0,0.06)' }, p: { xs: 2.5, md: 6 } }}>
                  <Stack spacing={{ xs: 4, md: 8 }}>
                    {/* Shipping Sanctuary Section */}
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'text.secondary', mb: 2, display: 'block' }}>
                        Delivery Destination
                      </Typography>
                      <Box sx={{ bgcolor: 'white', p: { xs: 2.5, md: 4 }, borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>

                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 2, fontSize: '0.95rem' }}>
                          {order.shippingAddress?.street}<br />
                          {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br />
                          {order.shippingAddress?.country}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Financial Protocol Section */}
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'text.secondary', mb: 2, display: 'block' }}>
                        Financial Summary
                      </Typography>
                      <Box sx={{ bgcolor: 'white', p: { xs: 2.5, md: 4 }, borderRadius: '24px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
                        <Stack spacing={2.5}>
                          {[
                            { label: 'Market Subtotal', value: order.itemsPrice },
                            { label: 'First Order Discount', value: -order.discountPrice, color: 'success.main', hide: !order.discountPrice },
                            { label: 'Excellence Shipping', value: order.shippingPrice },
                            { label: 'Archival Tax', value: order.taxPrice },
                          ].filter(row => !row.hide).map((row) => (
                            <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption" sx={{ color: row.color || 'text.secondary', fontWeight: 600, fontSize: '0.85rem' }}>{row.label}</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 800, color: row.color || 'text.primary' }}>
                                {row.value < 0 ? `-$${Math.abs(row.value).toFixed(2)}` : `$${row.value?.toFixed(2)}`}
                              </Typography>
                            </Box>
                          ))}
                          <Divider sx={{ my: 1, opacity: 0.5, borderStyle: 'dashed' }} />
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between', 
                            alignItems: 'flex-end',
                            gap: 1
                          }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 900, whiteSpace: 'nowrap' }}>
                              Total Investment
                            </Typography>
                            <Typography variant="h3" sx={{ 
                              fontWeight: 900, 
                              color: 'primary.main', 
                              fontFamily: '"DM Sans", sans-serif',
                              flex: '1 1 auto',
                              textAlign: 'right',
                              fontSize: { xs: '2rem', md: '2.5rem' }
                            }}>
                              ${order.totalPrice?.toFixed(2)}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Box>

                    {/* Control Hub */}
                    <Box sx={{ pt: 2 }}>
                      {order.status === 'pending' ? (
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={handleCancel}
                          sx={{
                            bgcolor: '#aa392b',
                            color: 'white',
                            boxShadow: '0 12px 30px rgba(170,57,43,0.2)',
                            borderRadius: '50px',
                            py: 2,
                            fontWeight: 900,
                            letterSpacing: '0.1em',
                            '&:hover': { bgcolor: '#8e2e23', transform: 'translateY(-2px)' },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          Cancel Order
                        </Button>
                      ) : (
                        <Box sx={{ 
                          p: { xs: 2.5, md: 4 }, 
                          bgcolor: 'white', 
                          borderRadius: '24px', 
                          border: '2px dashed rgba(45,75,56,0.1)',
                          textAlign: 'center'
                        }}>
                          <Typography variant="caption" sx={{ fontWeight: 900, color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                            Archive Finalized
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Card>
          </MotionBox>
        </AnimatePresence>
      </Container>
    </Box>
  );
}
