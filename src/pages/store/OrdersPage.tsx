import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Container, Typography, Chip, Button, Stack, Card, Avatar, Divider,
  TextField, MenuItem, InputAdornment, Grid
} from '@mui/material';
import { 
  ShoppingBag, Search, FilterList, Sort, Event, 
} from '@mui/icons-material';
import { ordersAPI } from '../../api/orders.api';
import StoreOrdersSkeleton from '../../components/skeletons/StoreOrdersSkeleton';
import { motion } from 'framer-motion';

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // all, today, 7days, month, specific
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, price-high, price-low

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await ordersAPI.getMyOrders();
        setOrders(data.data || []);
      } catch {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const summary = useMemo(() => {
    const counts: Record<string, number> = {
      pending: 0,
      accepted: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      declined: 0,
      cancelled: 0,
    };
    let totalSpend = 0;

    orders.forEach(order => {
      if (counts[order.status] !== undefined) {
        counts[order.status]++;
      }
      if (order.status !== 'cancelled' && order.status !== 'declined') {
        totalSpend += order.totalPrice || 0;
      }
    });

    return { counts, totalSpend, totalOrders: orders.length };
  }, [orders]);

  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      let matchesDate = true;
      const orderDate = new Date(order.createdAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dateFilter === 'today') {
        matchesDate = orderDate >= today;
      } else if (dateFilter === '7days') {
        const last7 = new Date(today);
        last7.setDate(last7.getDate() - 7);
        matchesDate = orderDate >= last7;
      } else if (dateFilter === 'month') {
        const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        matchesDate = orderDate >= firstOfMonth;
      } else if (dateFilter === 'specific') {
        const orderDateStr = orderDate.toISOString().split('T')[0];
        matchesDate = orderDateStr === customDate;
      }

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.totalPrice - b.totalPrice;
      if (sortBy === 'price-high') return b.totalPrice - a.totalPrice;
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

  if (loading) return <StoreOrdersSkeleton />;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'transparent' }}>
      {/* Premium Header Sanctuary - Color Matched to Shop */}
      <Box 
        sx={{ 
          bgcolor: 'primary.dark', 
          pt: { xs: 8, md: 12 }, 
          pb: { xs: 8, md: 12 }, 
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
            My Purchase History
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.8, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
            A curated record of your sanctuary acquisitions
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

      <Container maxWidth={false} sx={{ py: { xs: 4, md: 6 }, mt: { xs: -2, md: -4 }, position: 'relative', zIndex: 3, px: { xs: 2, md: 6 }, maxWidth: '1600px' }}>
        <Grid container spacing={5}>
          {/* Main Column */}
          <Grid size={{ xs: 12, md: 9 }}>
            {/* Ritual Control Bar */}
        {orders.length > 0 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2, 
              mb: 2,
              p: 1.5,
              bgcolor: 'white',
              borderRadius: '24px',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
              alignItems: { xs: 'stretch', md: 'center' },
              overflow: 'visible'
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: 'auto' }, flex: { md: 1 } }}>
              <TextField
                size="small"
                placeholder="Search Reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ 
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: '#fbfaf8',
                    height: 40,
                    fontSize: '0.875rem',
                    '& fieldset': { borderColor: 'rgba(0,0,0,0.06)' },
                  }
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mr: 0.5 }}>
                        <Search sx={{ color: 'primary.main', opacity: 0.5, fontSize: '1.1rem' }} />
                      </InputAdornment>
                    ),
                  }
                }}
              />
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => setShowFilters(!showFilters)}
                sx={{ display: { xs: 'flex', md: 'none' }, borderRadius: '12px', minWidth: 40, height: 40 }}
              >
                <FilterList />
              </Button>
            </Box>

            <Box sx={{ display: { xs: showFilters ? 'flex' : 'none', md: 'flex' }, gap: 2, flexWrap: 'wrap', width: { xs: '100%', md: 'auto' } }}>
              <TextField
                select
                size="small"
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ 
                  minWidth: 140,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: '#fbfaf8',
                    height: 40,
                    fontSize: '0.875rem',
                    '& fieldset': { borderColor: 'rgba(0,0,0,0.06)' },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    '&.MuiInputLabel-shrink': { transform: 'translate(14px, -10px) scale(0.85)', bgcolor: 'white', px: 0.5 }
                  }
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mr: 0.5 }}>
                        <FilterList sx={{ color: 'primary.main', opacity: 0.5, fontSize: '1.1rem' }} />
                      </InputAdornment>
                    ),
                  },
                  inputLabel: { shrink: true }
                }}
              >
                <MenuItem value="all">All Status</MenuItem>
                {Object.keys(statusColors).map((status) => (
                  <MenuItem key={status} value={status} sx={{ textTransform: 'capitalize' }}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                size="small"
                label="Time Range"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                sx={{ 
                  minWidth: 160,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: '#fbfaf8',
                    height: 40,
                    fontSize: '0.875rem',
                    '& fieldset': { borderColor: 'rgba(0,0,0,0.06)' },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    '&.MuiInputLabel-shrink': { transform: 'translate(14px, -10px) scale(0.85)', bgcolor: 'white', px: 0.5 }
                  }
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mr: 0.5 }}>
                        <Event sx={{ color: 'primary.main', opacity: 0.5, fontSize: '1.1rem' }} />
                      </InputAdornment>
                    ),
                  },
                  inputLabel: { shrink: true }
                }}
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="7days">Last 7 Days</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="specific">Specific Date</MenuItem>
              </TextField>

              {dateFilter === 'specific' && (
                <TextField
                  size="small"
                  type="date"
                  label="Pick Date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  sx={{ 
                    minWidth: 160,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      bgcolor: '#fbfaf8',
                      height: 40,
                      fontSize: '0.875rem',
                      '& fieldset': { borderColor: 'rgba(0,0,0,0.06)' },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      '&.MuiInputLabel-shrink': { transform: 'translate(14px, -10px) scale(0.85)', bgcolor: 'white', px: 0.5 }
                    }
                  }}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              )}

              <TextField
                select
                size="small"
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ 
                  minWidth: 160,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: '#fbfaf8',
                    height: 40,
                    fontSize: '0.875rem',
                    '& fieldset': { borderColor: 'rgba(0,0,0,0.06)' },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    '&.MuiInputLabel-shrink': { transform: 'translate(14px, -10px) scale(0.85)', bgcolor: 'white', px: 0.5 }
                  }
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mr: 0.5 }}>
                        <Sort sx={{ color: 'primary.main', opacity: 0.5, fontSize: '1.1rem' }} />
                      </InputAdornment>
                    ),
                  },
                  inputLabel: { shrink: true }
                }}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
              </TextField>
            </Box>
          </MotionBox>
        )}

        {filteredOrders.length === 0 ? (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ 
              textAlign: 'center', 
              py: 8, 
              bgcolor: 'white', 
              borderRadius: '32px', 
              border: '1px solid rgba(0,0,0,0.06)'
            }}
          >
            <ShoppingBag sx={{ fontSize: 60, color: 'primary.main', opacity: 0.1, mb: 3 }} />
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 700, fontFamily: '"Playfair Display", serif' }}>
              {orders.length > 0 ? "No Records Found" : "A Quiet Beginning"}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4, maxWidth: 400, mx: 'auto' }}>
              {orders.length > 0 
                ? "No acquisitions match your current filter criteria."
                : "Your order sanctuary is currently waiting for its first acquisition."}
            </Typography>
            {orders.length > 0 && (
              <Button 
                  onClick={() => { setSearchTerm(''); setStatusFilter('all'); setDateFilter('all'); }}
                  variant="outlined"
                  sx={{ px: 4, borderRadius: '12px', fontWeight: 800 }}
                >
                  Clear All Filters
              </Button>
            )}
          </MotionBox>
        ) : (
          <Stack spacing={3}>
            {filteredOrders.map((order, index) => (
              <MotionBox
                key={order._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card
                  component={Link}
                  to={`/orders/${order._id}`}
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    borderRadius: '24px',
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                    '&:hover': { 
                      borderColor: 'primary.main', 
                      boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
                      transform: 'translateY(-2px)'
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 2.5 } }}>
                    {/* TOP SECTION: Meta and Total */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      rowGap: 2.5,
                      columnGap: 2
                    }}>
                      <Stack direction="row" spacing={{ xs: 2, sm: 3 }} sx={{ alignItems: 'center', flexWrap: 'wrap', gap: { xs: 2, sm: 0 } }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', display: 'block' }}>
                            Reference
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary', whiteSpace: 'nowrap' }}>
                            #{order._id.slice(-8).toUpperCase()}
                          </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ height: 24, opacity: 0.5, display: { xs: 'none', sm: 'block' } }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', display: 'block' }}>
                            Date
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Total Pinned */}
                      <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                          Total Price
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.dark', fontFamily: '"DM Sans", sans-serif', fontSize: { xs: '1.75rem', sm: '1.5rem' } }}>
                          ${order.totalPrice?.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* MIDDLE SECTION: Product Thumbnails aligned with Status Badge */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between', 
                      alignItems: 'flex-end',
                      gap: 2 
                    }}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, flex: 1, minWidth: 200 }}>
                        {order.orderItems?.slice(0, 5).map((item: any, i: number) => (
                          <Avatar
                            key={i}
                            src={item.image}
                            variant="rounded"
                            sx={{
                              width: { xs: 48, md: 56 },
                              height: { xs: 60, md: 70 },
                              borderRadius: '12px',
                              border: '1px solid rgba(0,0,0,0.06)',
                              bgcolor: '#f5f4f0'
                            }}
                          >
                            {item.name?.charAt(0)}
                          </Avatar>
                        ))}
                        {order.orderItems?.length > 5 && (
                          <Avatar
                            variant="rounded"
                            sx={{
                              width: { xs: 48, md: 56 },
                              height: { xs: 60, md: 70 },
                              borderRadius: '12px',
                              bgcolor: 'rgba(45,75,56,0.05)',
                              color: 'primary.main',
                              fontSize: '0.75rem',
                              fontWeight: 800
                            }}
                          >
                            +{order.orderItems.length - 5}
                          </Avatar>
                        )}
                      </Box>

                      <Chip
                        label={order.status}
                        sx={{
                          bgcolor: statusColors[order.status],
                          color: 'white',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          fontSize: '0.7rem',
                          letterSpacing: '0.1em',
                          height: 32,
                          width: { xs: '100%', sm: 120 },
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                    </Box>
                  </Box>
                </Card>
              </MotionBox>
            ))}
          </Stack>
            )}
          </Grid>

          {/* Order Summary Sidebar */}
          <Grid size={{ xs: 12, md: 3 }}>
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              sx={{ 
                position: { md: 'sticky' }, 
                top: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: 3
              }}
            >
              <Card sx={{ 
                borderRadius: '12px', 
                border: '1px solid rgba(0,0,0,0.06)', 
                boxShadow: 'none',
                p: 0,
                overflow: 'hidden',
                bgcolor: 'white'
              }}>
                <Box sx={{ p: 2.5, pb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem' }}>
                    Order Summary
                  </Typography>
                </Box>
                
                <Divider sx={{ borderColor: 'rgba(0,0,0,0.05)' }} />

                <Box>
                  {/* Total Orders Row */}
                  <Box sx={{ 
                    px: 3, 
                    py: 2,
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                  }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>Total Orders</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary' }}>{summary.totalOrders}</Typography>
                  </Box>

                  {Object.entries({
                    pending: 'Pending',
                    accepted: 'Accepted',
                    processing: 'Processing',
                    shipped: 'Shipped',
                    delivered: 'Delivered',
                    declined: 'Declined',
                    cancelled: 'Cancelled'
                  }).map(([status, label]) => {
                    const count = summary.counts[status as keyof typeof summary.counts] || 0;
                    if (count === 0) return null;
                    
                    return (
                      <Box key={status}>
                        <Divider sx={{ borderColor: 'rgba(0,0,0,0.05)' }} />
                        <Box sx={{ 
                          px: 3, 
                          py: 2,
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                        }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                            {label}
                          </Typography>
                          <Typography variant="body1" sx={{ 
                            fontWeight: 700, 
                            color: status === 'cancelled' || status === 'declined' ? 'error.main' : 'text.primary'
                          }}>
                            {count}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}

                  {summary.totalOrders === 0 && (
                    <>
                      <Divider sx={{ borderColor: 'rgba(0,0,0,0.05)' }} />
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', fontSize: '0.9rem' }}>
                          No history recorded.
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </Card>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
