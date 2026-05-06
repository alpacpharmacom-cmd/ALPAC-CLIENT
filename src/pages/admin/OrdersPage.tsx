import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Typography, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment, MenuItem, Tooltip,
} from '@mui/material';
import { 
  CheckCircle, Cancel, Delete, Search, FilterList, Sort, Event, Download,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { ordersAPI } from '../../api/orders.api';
import { useAdminStore } from '../../stores/adminStore';
import TableSkeleton from '../../components/skeletons/TableSkeleton';
import { exportToCSV } from '../../utils/export';

const statusColors: Record<string, string> = {
  pending: '#f4a03c', // Vibrant Orange
  accepted: '#2D4B38', // Deep Alpac Green
  processing: '#5b7fa5', // Blueish
  shipped: '#6c5ce7', // Purple
  delivered: '#2D4B38', // Deep Alpac Green
  declined: '#aa392b', // Deep Red
  cancelled: '#7f8c8d', // Gray
};

const statusTabs = ['all', 'pending', 'accepted', 'processing', 'shipped', 'delivered', 'declined', 'cancelled'];

export default function AdminOrdersPage() {
  const { orders, fetchOrders, invalidateOrders, fetchedOrders } = useAdminStore();
  const [loading, setLoading] = useState(!fetchedOrders);
  const [actionDialog, setActionDialog] = useState<{ type: string; orderId: string } | null>(null);
  const [note, setNote] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // all, today, yesterday, 7days, month, specific
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, price-high, price-low

  const loadOrders = async () => {
    try {
      await fetchOrders();
    } catch {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filtered = orders
    .filter((order) => {
      const matchesSearch = 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      let matchesDate = true;
      const orderDate = new Date(order.createdAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dateFilter === 'today') {
        matchesDate = orderDate >= today;
      } else if (dateFilter === 'yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        matchesDate = orderDate >= yesterday && orderDate < today;
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

  const handleAccept = async () => {
    if (!actionDialog) return;
    try {
      await ordersAPI.accept(actionDialog.orderId, note);
      toast.success('Order accepted');
      invalidateOrders();
      await fetchOrders(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setActionDialog(null);
      setNote('');
    }
  };

  const handleDecline = async () => {
    if (!actionDialog) return;
    try {
      await ordersAPI.decline(actionDialog.orderId, note);
      toast.success('Order declined');
      invalidateOrders();
      await fetchOrders(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setActionDialog(null);
      setNote('');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await ordersAPI.delete(deleteId);
      invalidateOrders();
      await fetchOrders(true);
      toast.success('Order deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleteId(null);
    }
  };

  const handleExport = () => {
    const exportData = filtered.map(o => ({
      OrderID: o._id,
      CustomerName: o.user?.name || 'Unknown',
      CustomerEmail: o.user?.email || 'Unknown',
      Date: o.createdAt ? new Date(o.createdAt) : '',
      Status: o.status,
      Total: o.totalPrice?.toFixed(2),
      ItemsCount: o.orderItems?.length || 0,
      PaymentMethod: o.paymentMethod || 'cash on delivery'
    }));
    exportToCSV(exportData, 'Alpac_Orders');
    toast.success('Orders exported successfully');
  };


  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
           <Typography variant="h4" sx={{ fontWeight: 500 }}>
             Orders
           </Typography>
           <Typography variant="body2" color="text.secondary">
             {filtered.length === orders.length 
               ? `${orders.length} total orders` 
               : `Showing ${filtered.length} of ${orders.length} orders`}
           </Typography>
        </Box>
        <Tooltip title="Export current list to CSV">
           <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleExport}
              sx={{ bgcolor: '#4a90e2', '&:hover': { bgcolor: '#357abd' }, color: 'white', boxShadow: 'none' }}
           >
                Export
           </Button>
        </Tooltip>
      </Box>

      {/* Filter Bar */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 3, 
        flexWrap: 'wrap',
        p: 1.5,
        bgcolor: 'white',
        border: '1px solid rgba(0,0,0,0.06)',
        borderRadius: '24px',
        alignItems: 'center'
      }}>
        <TextField
          size="small"
          placeholder="Search by Order ID or Customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            flex: 1, 
            minWidth: 250,
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
                  <Search sx={{ color: 'text.secondary', opacity: 0.7, fontSize: '1.1rem' }} />
                </InputAdornment>
              ),
            }
          }}
        />

        <TextField
          select
          size="small"
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ 
            minWidth: 150,
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
                  <FilterList sx={{ color: 'text.secondary', opacity: 0.7, fontSize: '1.1rem' }} />
                </InputAdornment>
              ),
            },
            inputLabel: { shrink: true }
          }}
        >
          <MenuItem value="all">All Status</MenuItem>
          {statusTabs.filter(s => s !== 'all').map((status) => (
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
            minWidth: 150,
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
                  <Event sx={{ color: 'text.secondary', opacity: 0.7, fontSize: '1.1rem' }} />
                </InputAdornment>
              ),
            },
            inputLabel: { shrink: true }
          }}
        >
          <MenuItem value="all">All Time</MenuItem>
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="yesterday">Yesterday</MenuItem>
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
              minWidth: 150,
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
            minWidth: 150,
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
                  <Sort sx={{ color: 'text.secondary', opacity: 0.7, fontSize: '1.1rem' }} />
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

      {/* Orders Table */}
      {loading ? (
        <TableSkeleton 
          columns={[
            { flex: 1.5, align: 'left',   variant: 'text'    },  // Order ID
            { flex: 1.5, align: 'left',   variant: 'text'    },  // Customer name
            { flex: 1,   align: 'center', variant: 'text'    },  // Date
            { flex: 1.5, align: 'center', variant: 'chip'    },  // Status badge
            { flex: 1,   align: 'center', variant: 'text'    },  // Total
            { flex: 1,   align: 'right',  variant: 'actions' },  // Action buttons
          ]} 
        />
      ) : (
        <Box sx={{ 
          bgcolor: 'white', 
          border: '1px solid rgba(0,0,0,0.06)', 
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <Box sx={{ overflow: 'auto' }}>
            <Box sx={{ minWidth: 800 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', px: 3, py: 1.5, bgcolor: 'rgba(0,0,0,0.01)', borderBottom: '1px solid rgba(0,0,0,0.06)', minWidth: 900 }}>
              <Typography variant="caption"  sx={{ fontWeight: 800,  flex: 1.5, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem' }}>Order</Typography>
              <Typography variant="caption"  sx={{ fontWeight: 800,  flex: 1.5, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem', textAlign: 'left' }}>Customer</Typography>
              <Typography variant="caption"  sx={{ fontWeight: 800,  flex: 1, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem', textAlign: 'center' }}>Date</Typography>
              <Typography variant="caption"  sx={{ fontWeight: 800,  flex: 1.5, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem', textAlign: 'center' }}>Status</Typography>
              <Typography variant="caption"  sx={{ fontWeight: 800,  flex: 1, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem', textAlign: 'center' }}>Total</Typography>
              <Typography variant="caption"  sx={{ fontWeight: 800,  flex: 1, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem', textAlign: 'right' }}>Actions</Typography>
            </Box>

            {filtered.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">No orders found</Typography>
              </Box>
            ) : (
              filtered.map((order) => (
                <Box
                  key={order._id}
                  component={Link}
                  to={`/admin/orders/${order._id}`}
                  sx={{
                    display: 'flex',
                    px: 3,
                    py: 1.5,
                    borderBottom: '1px solid rgba(0,0,0,0.04)',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    '&:hover': { 
                      bgcolor: 'rgba(45, 75, 56, 0.02)',
                      '& .order-id': { color: 'primary.main' }
                    },
                  }}
                >
                  <Typography variant="body2" className="order-id" sx={{ fontWeight: 800,  flex: 1.5, transition: 'color 0.2s' }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </Typography>
                  <Typography variant="body2" sx={{ flex: 1.5, fontWeight: 500, textAlign: 'left' }}>
                    {order.user?.name || 'Unknown'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ flex: 1, fontWeight: 500, textAlign: 'center' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                  <Box sx={{ flex: 1.5, display: 'flex', justifyContent: 'center' }}>
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
                  <Typography variant="body2"  sx={{ fontWeight: 800,  flex: 1, color: 'primary.main', textAlign: 'center' }}>
                    ${order.totalPrice?.toFixed(2)}
                  </Typography>
                  <Box sx={{ flex: 1, display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                    {order.status === 'pending' && (
                      <>
                        <Tooltip title="Accept Order">
                          <Button
                            size="small"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActionDialog({ type: 'accept', orderId: order._id }); }}
                            sx={{ minWidth: 'auto', p: 0.8, color: '#2D4B38', borderRadius: '8px', '&:hover': { bgcolor: 'rgba(45, 75, 56, 0.1)' } }}
                          >
                            <CheckCircle fontSize="small" />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Decline Order">
                          <Button
                            size="small"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActionDialog({ type: 'decline', orderId: order._id }); }}
                            sx={{ minWidth: 'auto', p: 0.8, color: '#aa392b', borderRadius: '8px', '&:hover': { bgcolor: 'rgba(170, 57, 43, 0.1)' } }}
                          >
                            <Cancel fontSize="small" />
                          </Button>
                        </Tooltip>
                      </>
                    )}
                    <Tooltip title="Delete Order">
                      <Button
                        size="small"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeleteId(order._id); }}
                        sx={{ minWidth: 'auto', p: 0.8, color: '#aa392b', borderRadius: '8px', '&:hover': { bgcolor: 'rgba(170, 57, 43, 0.1)' } }}
                      >
                        <Delete fontSize="small" />
                      </Button>
                    </Tooltip>
                  </Box>
                </Box>
              ))
            )}
            </Box>
          </Box>
        </Box>
      )}

      {/* Accept/Decline Dialog */}
      <Dialog 
        open={!!actionDialog} 
        onClose={() => { setActionDialog(null); setNote(''); }} 
      >
        <DialogTitle>
          {actionDialog?.type === 'accept' ? 'Accept Order' : 'Decline Order'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {actionDialog?.type === 'accept'
              ? 'Accept this order and begin processing?'
              : 'Decline this order? Stock will be restored.'}
          </Typography>
          <TextField
            fullWidth
            label="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setActionDialog(null); setNote(''); }}>Cancel</Button>
          <Button
            onClick={actionDialog?.type === 'accept' ? handleAccept : handleDecline}
            variant="contained"
            sx={{
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            {actionDialog?.type === 'accept' ? 'Accept' : 'Decline'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
Base theme handles radius.
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          <Typography>Are you sure? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
