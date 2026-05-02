import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box, Typography, Grid, Chip, Divider, Button, TextField,
  MenuItem, Select, FormControl, InputLabel, Avatar, Stack, LinearProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowBack, ShoppingBag, LocalShipping, Person, Payment } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { ordersAPI } from '../../api/orders.api';

const statusColors: Record<string, string> = {
  pending: '#d4a03c',
  accepted: '#4a6741',
  processing: '#5b7fa5',
  shipped: '#6c5ce7',
  delivered: '#27ae60',
  declined: '#c0392b',
  cancelled: '#7f8c8d',
};

const allStatuses = ['pending', 'accepted', 'processing', 'shipped', 'delivered', 'declined', 'cancelled'];

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await ordersAPI.getById(id!);
        setOrder(data.data);
        setNewStatus(data.data.status);
      } catch {
        toast.error('Order not found');
        navigate('/admin/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    try {
      const { data } = await ordersAPI.updateStatus(id!, newStatus);
      setOrder(data.data);
      toast.success('Status updated');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleAccept = async () => {
    try {
      const { data } = await ordersAPI.accept(id!, note);
      setOrder(data.data);
      setNote('');
      toast.success('Order accepted');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDecline = async () => {
    try {
      const { data } = await ordersAPI.decline(id!, note);
      setOrder(data.data);
      setNote('');
      toast.success('Order declined');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (!order) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Box sx={{ position: 'relative' }}>
          {loading && (
            <LinearProgress 
              sx={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                right: 0, 
                zIndex: 2000,
                height: 3,
                bgcolor: 'rgba(45, 75, 56, 0.1)',
                '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' }
              }} 
            />
          )}

          <Button onClick={() => navigate('/admin/orders')} startIcon={<ArrowBack />} sx={{ mb: 3, color: 'text.secondary', fontWeight: 600 }}>
        Back to Orders
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5, flexWrap: 'wrap', gap: 3 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: '"Playfair Display", serif', color: 'text.primary', mb: 1 }}>
            Order #{order._id.slice(-8).toUpperCase()}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </Typography>
            <Chip 
              label={order.isPaid ? 'Paid' : 'Unpaid'} 
              size="small"
              sx={{ 
                height: 22, 
                fontSize: '0.65rem', 
                fontWeight: 900, 
                bgcolor: order.isPaid ? 'rgba(45, 75, 56, 0.1)' : 'rgba(170, 57, 43, 0.1)', 
                color: order.isPaid ? '#27ae60' : '#aa392b',
                textTransform: 'uppercase'
              }} 
            />
          </Stack>
        </Box>
        <Chip
          label={order.status}
          sx={{
            height: 32,
            width: 140,
            display: 'flex',
            justifyContent: 'center',
            bgcolor: statusColors[order.status],
            color: 'white',
            fontWeight: 800,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            '& .MuiChip-label': { px: 1, width: '100%', textAlign: 'center' }
          }}
        />
      </Box>

      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Order Items */}
          <Box sx={{ bgcolor: 'white', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '24px', p: 4, mb: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
              <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'rgba(45, 75, 56, 0.05)', color: 'primary.main' }}>
                <ShoppingBag fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Order Items</Typography>
            </Stack>
            {order.orderItems?.map((item: any, i: number) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2.5, borderBottom: i < order.orderItems.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ width: 60, height: 75, bgcolor: '#f5f4f0', flexShrink: 0, borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
                    {item.image ? (
                      <Box component="img" src={item.image} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography sx={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.2)', fontWeight: 800 }}>VB</Typography>
                      </Box>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5 }}>{item.name}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      ${item.price?.toFixed(2)} <Box component="span" sx={{ color: 'rgba(0,0,0,0.2)', mx: 1 }}>|</Box> Qty: {item.quantity}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Customer & Shipping Info */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ bgcolor: 'white', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '24px', p: 4, height: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
                  <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'rgba(108, 92, 231, 0.05)', color: '#6c5ce7' }}>
                    <Person fontSize="small" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>Customer</Typography>
                </Stack>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      bgcolor: 'rgba(45, 75, 56, 0.1)', 
                      color: 'primary.main',
                      fontWeight: 800,
                      fontSize: '1.2rem'
                    }}
                  >
                    {(order.user?.name || 'G')[0].toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{order.user?.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{order.user?.email}</Typography>
                  </Box>
                </Box>
                <Button component={Link} to={`/admin/users/${order.user?._id}`} variant="outlined" size="small" sx={{ borderRadius: '12px', color: 'text.secondary', borderColor: 'rgba(0,0,0,0.1)' }}>View Profile</Button>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ bgcolor: 'white', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '24px', p: 4, height: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
                  <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'rgba(184, 149, 106, 0.05)', color: '#B8956A' }}>
                    <LocalShipping fontSize="small" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>Shipping Address</Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, lineHeight: 1.8 }}>
                  <strong>{order.user?.name}</strong><br />
                  {order.shippingAddress?.street}<br />
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br />
                  {order.shippingAddress?.country}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Payment Summary */}
          <Box sx={{ bgcolor: 'white', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '24px', p: 4, mb: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
              <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'rgba(45, 75, 56, 0.05)', color: 'primary.main' }}>
                <Payment fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Payment Summary</Typography>
            </Stack>
            {[
              { label: 'Subtotal', value: order.itemsPrice },
              { label: 'First Order Discount', value: -order.discountPrice, color: 'success.main', hide: !order.discountPrice },
              { label: 'Shipping', value: order.shippingPrice },
              { label: 'Estimated Tax', value: order.taxPrice },
            ].filter(row => !row.hide).map((row) => (
              <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" sx={{ color: row.color || 'text.secondary', fontWeight: 600 }}>{row.label}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: row.color || 'text.primary' }}>
                  {row.value < 0 ? `-$${Math.abs(row.value).toFixed(2)}` : `$${row.value?.toFixed(2)}`}
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Total Amount</Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main' }}>${order.totalPrice?.toFixed(2)}</Typography>
            </Box>
          </Box>

          {/* Management Console */}
          <Box sx={{ bgcolor: 'white', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '24px', p: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Management Console</Typography>
            
            {order.status === 'pending' && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', display: 'block', mb: 1.5 }}>Quick Approval</Typography>
                <TextField
                  fullWidth
                  placeholder="Add a note for the customer..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  multiline
                  rows={2}
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': { borderRadius: '12px' }
                  }}
                />
                <Stack direction="row" spacing={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleAccept}
                    sx={{ bgcolor: '#2D4B38', borderRadius: '12px', py: 1.2, fontWeight: 800, '&:hover': { bgcolor: '#22382a' } }}
                  >
                    Accept
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleDecline}
                    sx={{ color: '#aa392b', borderColor: '#aa392b', borderRadius: '12px', py: 1.2, fontWeight: 800, '&:hover': { bgcolor: 'rgba(170, 57, 43, 0.05)', borderColor: '#aa392b' } }}
                  >
                    Decline
                  </Button>
                </Stack>
                <Divider sx={{ my: 3 }} />
              </Box>
            )}

            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', display: 'block', mb: 1.5 }}>Manual Override</Typography>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Target Status</InputLabel>
              <Select 
                value={newStatus} 
                onChange={(e) => setNewStatus(e.target.value)} 
                label="Target Status"
                sx={{ borderRadius: '12px' }}
              >
                {allStatuses.map((s) => (
                  <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize', fontWeight: 600 }}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              fullWidth
              variant="contained"
              onClick={handleStatusUpdate}
              disabled={newStatus === order.status}
              sx={{
                bgcolor: '#5b7fa5',
                borderRadius: '12px',
                py: 1.2,
                fontWeight: 800,
                boxShadow: '0 4px 12px rgba(91, 127, 165, 0.2)',
                '&:hover': { bgcolor: '#4a6785' },
              }}
            >
              Update Workflow
            </Button>
          </Box>

          {order.adminNote && (
            <Box sx={{ bgcolor: '#f5f0e8', borderRadius: '24px', p: 3, mt: 3, border: '1px solid rgba(0,0,0,0.05)' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', display: 'block', mb: 1 }}>Admin Note History</Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.primary' }}>"{order.adminNote}"</Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
    </motion.div>
    </AnimatePresence>
  );
}
