import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent, Chip, Stack, Button
} from '@mui/material';
import {
  Inventory2, ShoppingCart, People, AttachMoney,
  TrendingUp, Warning, CalendarMonth,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from 'recharts';
import { useAdminStore } from '../../stores/adminStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Avatar } from '@mui/material';

const MotionCard = motion.create(Card);

const statusColors: Record<string, string> = {
  pending: '#f4a03c', // Vibrant Orange
  accepted: '#2D4B38', // Deep Alpac Green
  processing: '#5b7fa5', // Blueish
  shipped: '#6c5ce7', // Purple
  delivered: '#2D4B38', // Deep Alpac Green
  declined: '#aa392b', // Deep Red
  cancelled: '#7f8c8d', // Gray
};

const SectionFrame = ({ children, title, icon, subtitle }: any) => (
  <Box 
    sx={{ 
      bgcolor: 'white', 
      borderRadius: '24px', 
      p: 4, 
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 4px 25px rgba(0,0,0,0.03)',
      height: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>{title}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em' }}>{subtitle}</Typography>
      </Box>
      <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(45, 75, 56, 0.05)', color: 'primary.main' }}>
        {icon}
      </Box>
    </Box>
    {children}
  </Box>
);

export default function AdminDashboard() {
  const { stats, fetchStats, fetchedStats } = useAdminStore();
  const [loading, setLoading] = useState(!fetchedStats);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        await fetchStats();
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!stats) return null;

  const statCards = [
    { label: 'Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: <AttachMoney />, color: '#2D4B38', bg: 'rgba(45, 75, 56, 0.08)'},
    { label: 'Orders', value: stats.totalOrders, icon: <ShoppingCart />, color: '#5b7fa5', bg: 'rgba(91, 127, 165, 0.08)'},
    { label: 'Products', value: stats.totalProducts, icon: <Inventory2 />, color: '#B8956A', bg: 'rgba(184, 149, 106, 0.08)'},
    { label: 'Users', value: stats.totalUsers, icon: <People />, color: '#6c5ce7', bg: 'rgba(108, 92, 231, 0.08)'},
  ];

  return (
    <Box>
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, fontSize: '2.5rem', fontFamily: '"Playfair Display", serif' }}>
            {getGreeting()}, Admin
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
            Welcome back to the ALPAC control center.
            <Chip 
              size="small" 
              label="Live" 
              sx={{ 
                height: 20, 
                fontSize: '0.65rem', 
                fontWeight: 900, 
                bgcolor: 'primary.main', 
                color: 'white',
                '& .MuiChip-label': { px: 1 }
              }} 
            />
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', mb: 0 }}>
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </Typography>
        </Box>
      </Box>
            {/* Alerts - Boxed */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {stats.pendingOrdersCount > 0 && (
          <Grid size={{ xs: 12, md: stats.lowStockCount > 0 ? 6 : 12 }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              sx={{
                bgcolor: 'white',
                border: '1px solid rgba(244, 160, 60, 0.15)',
                borderLeft: '6px solid #f4a03c',
                borderRadius: '24px',
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 15px 45px rgba(244, 160, 60, 0.12)',
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 20px 50px rgba(244, 160, 60, 0.2)' }
              }}
            >
              <Stack direction="row" spacing={2.5} sx={{ alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    p: 1.8, 
                    borderRadius: '14px', 
                    bgcolor: 'rgba(244, 160, 60, 0.1)', 
                    color: '#f4a03c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'inset 0 2px 8px rgba(244, 160, 60, 0.1)'
                  }}
                >
                  <ShoppingCart />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#b47c30', fontSize: '1.2rem', lineHeight: 1.1, mb: 0.5 }}>
                    {stats.pendingOrdersCount} Pending Order{stats.pendingOrdersCount > 1 ? 's' : ''}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.01em' }}>
                    Requires immediate processing
                  </Typography>
                </Box>
              </Stack>
              <Button 
                component={Link} 
                to="/admin/orders" 
                variant="contained" 
                sx={{ 
                  bgcolor: '#f4a03c', 
                  borderRadius: '12px', 
                  px: 4, 
                  py: 1.2,
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  boxShadow: '0 10px 25px rgba(244, 160, 60, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': { bgcolor: '#d4801c', transform: 'translateY(-2px)', boxShadow: '0 15px 30px rgba(244, 160, 60, 0.4)' } 
                }}
              >
                Manage
              </Button>
            </Box>
          </Grid>
        )}

        {stats.lowStockCount > 0 && (
           <Grid size={{ xs: 12, md: stats.pendingOrdersCount > 0 ? 6 : 12 }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              sx={{
                bgcolor: 'white',
                border: '1px solid rgba(170, 57, 43, 0.1)',
                borderLeft: '6px solid #aa392b',
                borderRadius: '24px',
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 15px 45px rgba(170, 57, 43, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 20px 50px rgba(170, 57, 43, 0.18)' }
              }}
            >
              <Stack direction="row" spacing={2.5} sx={{ alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    p: 1.8, 
                    borderRadius: '14px', 
                    bgcolor: 'rgba(170, 57, 43, 0.1)', 
                    color: '#aa392b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'inset 0 2px 8px rgba(170, 57, 43, 0.05)'
                  }}
                >
                  <Warning />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#aa392b', fontSize: '1.2rem', lineHeight: 1.1, mb: 0.5 }}>
                    Low Stock Alert
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.01em' }}>
                    {stats.lowStockCount} items below inventory threshold
                  </Typography>
                </Box>
              </Stack>
              <Button 
                component={Link} 
                to="/admin/products" 
                variant="contained" 
                sx={{ 
                  bgcolor: '#aa392b', 
                  borderRadius: '12px', 
                  px: 4, 
                  py: 1.2,
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  boxShadow: '0 10px 25px rgba(170, 57, 43, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': { bgcolor: '#8e2f23', transform: 'translateY(-2px)', boxShadow: '0 15px 30px rgba(170, 57, 43, 0.4)' } 
                }}
              >
                Restock
              </Button>
            </Box>
           </Grid>
        )}
      </Grid>

      {/* Stat Cards - Enhanced Framing */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {statCards.map((card, index) => (
          <Grid size={{ xs: 6, md: 3 }} key={card.label}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              sx={{
                bgcolor: 'white',
                borderRadius: '24px',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  borderColor: card.color,
                  boxShadow: `0 20px 40px ${card.bg}`,
                }
              }}
            >
              <CardContent sx={{ p: 3.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '16px',
                      bgcolor: card.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: card.color,
                      fontSize: '1.5rem'
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: '2.2rem', mb: 0.5, color: 'text.primary', letterSpacing: '-0.02em' }}>
                  {card.value}
                </Typography>
                <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                  {card.label}
                </Typography>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      {/* Sales Charts - Boxed */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <SectionFrame 
            title="Sales Overview" 
            subtitle="DAILY PERFORMANCE (30 DAYS)" 
            icon={<TrendingUp />}
          >
            <Box sx={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.dailySales}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2D4B38" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#2D4B38" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                  <XAxis 
                    dataKey="_id" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#666', fontWeight: 600 }}
                    tickFormatter={(str) => {
                      const date = new Date(str);
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }}
                    minTickGap={40}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#666', fontWeight: 600 }}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip 
                    content={({ active, payload, label }: any) => {
                      if (active && payload && payload.length) {
                        return (
                          <Box sx={{ 
                            bgcolor: 'white', 
                            p: 2, 
                            borderRadius: '16px', 
                            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                            border: '1px solid rgba(0,0,0,0.04)'
                          }}>
                            <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>
                              {new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                              ${payload[0].value.toFixed(2)}
                            </Typography>
                          </Box>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#2D4B38" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </SectionFrame>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <SectionFrame 
            title="Monthly Growth" 
            subtitle="PERFORMANCE BY MONTH" 
            icon={<CalendarMonth />}
          >
            <Box sx={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlySummary}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                  <XAxis 
                    dataKey="_id" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#666', fontWeight: 600 }}
                    tickFormatter={(str) => {
                      const [year, month] = str.split('-');
                      return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short' });
                    }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: '1px solid rgba(0,0,0,0.06)', 
                      boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
                    }}
                  />
                  <Bar 
                    dataKey="sales" 
                    fill="#5b7fa5" 
                    radius={[8, 8, 8, 8]}
                    barSize={32}
                  >
                    {stats.monthlySummary.map((_entry: any, index: number) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === stats.monthlySummary.length - 1 ? '#2D4B38' : '#5b7fa5'} 
                        fillOpacity={0.9}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </SectionFrame>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Recent Orders - Boxed */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <SectionFrame title="Recent Activity" subtitle="LATEST CUSTOMER ORDERS" icon={<ShoppingCart />}>
            {stats.recentOrders.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>Waiting for the first order...</Typography>
              </Box>
            ) : (
              <Box sx={{ 
                overflow: 'auto',
                '&::-webkit-scrollbar': { display: 'none' },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none'
              }}>
                <Box sx={{ minWidth: 600 }}>
                  <Box sx={{ display: 'flex', px: 1, py: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: '12px', mb: 1 }}>
                    <Typography variant="overline" sx={{ flex: 1, px: 2, fontWeight: 800 }}>Order ID</Typography>
                    <Typography variant="overline" sx={{ flex: 1.5, px: 2, fontWeight: 800, textAlign: 'left' }}>Customer</Typography>
                    <Typography variant="overline" sx={{ flex: 1, fontWeight: 800, textAlign: 'center' }}>Status</Typography>
                    <Typography variant="overline" sx={{ flex: 1, textAlign: 'right', px: 2, fontWeight: 800 }}>Total</Typography>
                  </Box>
                  {stats.recentOrders.map((order: any) => (
                    <Box
                      key={order._id}
                      component={Link}
                      to={`/admin/orders/${order._id}`}
                      sx={{
                        display: 'flex',
                        px: 1,
                        py: 2.5,
                        borderRadius: '12px',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        border: '1px solid transparent',
                        '&:hover': { 
                          bgcolor: 'white', 
                          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                          borderColor: 'rgba(45, 75, 56, 0.1)',
                          zIndex: 2
                        },
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Box sx={{ flex: 1, px: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>#{order._id.slice(-8).toUpperCase()}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1.5, px: 2, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-start' }}>
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            fontSize: '0.75rem', 
                            fontWeight: 800, 
                            bgcolor: 'rgba(45, 75, 56, 0.1)', 
                            color: 'primary.main',
                            border: '1px solid rgba(45, 75, 56, 0.1)'
                          }}
                        >
                          {(order.user?.name || 'G')[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, textAlign: 'left' }}>
                            {order.user?.name || 'Guest User'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mt: -0.5, textAlign: 'left' }}>
                            Customer
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
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
                      <Typography variant="body2" sx={{ fontWeight: 800, flex: 1, textAlign: 'right', px: 2, color: 'primary.main' }}>
                        ${order.totalPrice?.toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </SectionFrame>
        </Grid>

        {/* Top Selling Products - Boxed */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <SectionFrame title="Top Sellers" subtitle="BEST PERFORMING PRODUCTS" icon={<Inventory2 />}>
            {stats.topSellingProducts.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>No sales data available yet.</Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {stats.topSellingProducts.map((product: any) => (
                  <Box
                    key={product._id}
                    component={Link}
                    to={`/admin/products/${product._id}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: '24px',
                      border: '1px solid rgba(0,0,0,0.04)',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      bgcolor: 'rgba(255,255,255,0.5)',
                      '&:hover': { 
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.04)',
                        borderColor: 'primary.main', 
                        bgcolor: 'white' 
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 54,
                        height: 68,
                        bgcolor: '#f5f4f0',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        mr: 2,
                        border: '1px solid rgba(0,0,0,0.06)',
                        flexShrink: 0
                      }}
                    >
                      {product.image ? (
                        <Box component="img" src={product.image} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.2)', fontWeight: 800 }}>VB</Typography>
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'text.primary' }}>
                        {product.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        {product.totalQty} units moved
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main', ml: 1 }}>
                      ${product.totalRevenue.toFixed(0)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </SectionFrame>
        </Grid>
      </Grid>
    </Box>
  );
}

