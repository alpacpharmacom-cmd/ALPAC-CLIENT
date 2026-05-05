import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Typography, IconButton, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, InputAdornment, MenuItem, Tooltip
} from '@mui/material';
import { Delete, Search, Sort, Download } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { usersAPI } from '../../api/users.api';
import { useAdminStore } from '../../stores/adminStore';
import TableSkeleton from '../../components/skeletons/TableSkeleton';
import { exportToCSV } from '../../utils/export';

export default function AdminUsersPage() {
  const { users, fetchUsers, invalidateUsers, fetchedUsers } = useAdminStore();
  const [loading, setLoading] = useState(!fetchedUsers);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, name-asc, name-desc

  const loadUsers = async () => {
    try {
      await fetchUsers();
    } catch {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await usersAPI.delete(deleteId);
      invalidateUsers();
      await fetchUsers(true);
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setDeleteId(null);
    }
  };

  const filteredUsers = users
    .filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

  const handleExport = () => {
    const exportData = filteredUsers.map(u => ({
      ID: u._id,
      Name: u.name,
      Email: u.email,
      JoinedDate: u.createdAt ? new Date(u.createdAt) : ''
    }));
    exportToCSV(exportData, 'Alpac_Users');
    toast.success('Users exported successfully');
  };


  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
           <Typography variant="h4" sx={{ fontWeight: 500 }}>
             Users
           </Typography>
           <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
             {filteredUsers.length === users.length 
               ? `${users.length} total users` 
               : `Showing ${filteredUsers.length} of ${users.length} users`}
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
          placeholder="Search by name or email..."
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
          <MenuItem value="name-asc">Name: A to Z</MenuItem>
          <MenuItem value="name-desc">Name: Z to A</MenuItem>
        </TextField>
      </Box>

      {loading ? (
        <TableSkeleton 
          columns={[
            { flex: 3, align: 'left', variant: 'circular' },
            { flex: 2.5, align: 'left', variant: 'text' },
            { flex: 1.5, align: 'center', variant: 'text' },
            { flex: 1, align: 'right', variant: 'circular' },
          ]} 
        />
      ) : (
        <Box sx={{ 
          bgcolor: 'white', 
          border: '1px solid rgba(0,0,0,0.06)', 
          borderRadius: '24px', 
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.03)'
        }}>
          <Box sx={{ overflow: 'auto' }}>
            <Box sx={{ minWidth: 800 }}>
              <Box sx={{ display: 'flex', px: 3, py: 1.5, bgcolor: 'rgba(45, 75, 56, 0.02)', borderBottom: '1px solid rgba(0,0,0,0.06)', minWidth: 900 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, flex: 3, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.65rem' }}>Full Identity</Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, flex: 2.5, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.65rem' }}>Digital Address</Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, flex: 1.5, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.65rem', textAlign: 'center' }}>Member Since</Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, flex: 1, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.65rem', textAlign: 'right' }}>Actions</Typography>
              </Box>

              {filteredUsers.map((user) => (
                <Box
                  key={user._id}
                  component={Link}
                  to={`/admin/users/${user._id}`}
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
                      '& .user-name': { color: 'primary.main' }
                    },
                  }}
                >
                  <Box sx={{ flex: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: 38, 
                        height: 38, 
                        fontSize: '0.9rem', 
                        fontWeight: 800, 
                        bgcolor: 'rgba(184, 149, 106, 0.1)', 
                        color: '#B8956A' 
                      }}
                    >
                      {user.name[0].toUpperCase()}
                    </Avatar>
                    <Typography variant="body2" className="user-name" sx={{ fontWeight: 800, transition: 'color 0.2s' }}>{user.name}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ flex: 2.5, fontWeight: 600, color: 'text.secondary' }}>
                    {user.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ flex: 1.5, fontWeight: 600, textAlign: 'center' }}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}
                  </Typography>
                  <Box sx={{ flex: 1, display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                    <Tooltip title="Delete User">
                      <IconButton
                        size="small"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeleteId(user._id); }}
                        sx={{ color: '#aa392b', borderRadius: '8px', '&:hover': { bgcolor: 'rgba(170, 57, 43, 0.1)' } }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Delete User?</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontWeight: 500 }}>Are you sure you want to permanently delete this account? Access will be revoked immediately.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ color: 'text.secondary', fontWeight: 700 }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" sx={{ bgcolor: '#aa392b', borderRadius: '10px', px: 3, fontWeight: 800 }}>Delete Account</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
