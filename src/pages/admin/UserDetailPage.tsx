import { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import {
  Box, Typography, Grid, TextField, Button, Avatar, Stack, Divider, Chip
} from '@mui/material';
import { ArrowBack, Save, Person, Email, Phone, LocationOn, CalendarToday, Fingerprint } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { usersAPI } from '../../api/users.api';
import { useAdminStore } from '../../stores/adminStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminUserDetailPage() {
  const { invalidateUsers } = useAdminStore();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: res } = await usersAPI.getById(id!);
        const userData = res.data;
        setUser(userData);
        setForm({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: {
            street: userData.address?.street || '',
            city: userData.address?.city || '',
            state: userData.address?.state || '',
            zipCode: userData.address?.zipCode || '',
            country: userData.address?.country || '',
          },
        });
      } catch {
        toast.error('User not found');
        navigate('/admin/users');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const key = field.split('.')[1];
      setForm({ ...form, address: { ...form.address, [key]: value } });
    } else {
      setForm({ ...form, [field]: value });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await usersAPI.update(id!, form);
      invalidateUsers();
      toast.success('Profile preferences preserved');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return null;

  return (
    <Box sx={{ pb: 8, position: 'relative' }}>
      <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 3 }}>
        <Box>
          <Button 
            onClick={() => navigate('/admin/users')} 
            startIcon={<ArrowBack />} 
            sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 600, '&:hover': { bgcolor: 'transparent', color: 'primary.main' } }}
          >
            Back to User Matrix
          </Button>
          <Typography 
            variant="h3" 
            sx={{ 
                fontWeight: 800, 
                fontFamily: '"Playfair Display", serif',
                letterSpacing: '-0.01em',
                color: 'text.primary'
            }}
          >
            Account Identity
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
            <Button 
                onClick={() => navigate('/admin/users')} 
                variant="outlined" 
                sx={{ px: 4, borderRadius: '12px', borderColor: 'rgba(0,0,0,0.1)', color: 'text.secondary', fontWeight: 700 }}
            >
                Discard
            </Button>
            <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                disabled={saving}
                sx={{ 
                    bgcolor: 'primary.main', 
                    px: 4,
                    borderRadius: '12px',
                    fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(45, 75, 56, 0.2)',
                    '&:hover': { bgcolor: 'primary.dark' }
                }}
            >
                {saving ? 'Preserving...' : 'Save Profile'}
            </Button>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column: Avatar & Quick Info */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box 
            sx={{ 
              bgcolor: 'white', 
              border: '1px solid rgba(0,0,0,0.06)', 
              borderRadius: '24px', 
              p: 5, 
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(0,0,0,0.03)'
            }}
          >
            <Avatar 
              sx={{ 
                width: 120, 
                height: 120, 
                bgcolor: 'rgba(184, 149, 106, 0.1)', 
                color: '#B8956A',
                fontSize: '3rem',
                fontWeight: 800,
                mx: 'auto',
                mb: 3,
                border: '2px solid rgba(184, 149, 106, 0.2)'
              }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{user.name}</Typography>
            <Chip 
              label={user.isAdmin ? 'System Admin' : 'Customer Account'} 
              size="small"
              sx={{ 
                height: 24, 
                px: 1,
                fontWeight: 800, 
                fontSize: '0.65rem',
                bgcolor: user.isAdmin ? 'primary.main' : 'rgba(0,0,0,0.05)',
                color: user.isAdmin ? 'white' : 'text.secondary',
                mb: 4,
                textTransform: 'uppercase'
              }}
            />
            
            <Divider sx={{ mb: 4 }} />
            
            <Stack spacing={2.5} sx={{ textAlign: 'left' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'rgba(0,0,0,0.03)', color: 'text.secondary' }}>
                  <Email fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Email</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.email}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'rgba(0,0,0,0.03)', color: 'text.secondary' }}>
                  <Phone fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Contact</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.phone || 'Not provided'}</Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
          
          {/* System Stamp */}
          <Box sx={{ mt: 3, p: 4, bgcolor: 'rgba(45, 75, 56, 0.05)', borderRadius: '24px', border: '1px solid rgba(45, 75, 56, 0.1)' }}>
            <Stack spacing={2.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CalendarToday sx={{ fontSize: '1rem', color: 'primary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Member Since: {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Fingerprint sx={{ fontSize: '1rem', color: 'primary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', fontFamily: 'monospace', fontSize: '0.65rem', opacity: 0.6 }}>
                  UID: {user._id}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Grid>

        {/* Right Column: Edit Form */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box 
            sx={{ 
                bgcolor: 'white', 
                border: '1px solid rgba(0,0,0,0.06)', 
                borderRadius: '24px',
                p: 5,
                boxShadow: '0 10px 40px rgba(0,0,0,0.03)'
            }}
          >
            <Box sx={{ mb:  5}}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
                  <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'rgba(184, 149, 106, 0.05)', color: '#B8956A' }}>
                    <Person fontSize="small" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>Primary Identity</Typography>
                </Stack>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField 
                            fullWidth 
                            label="Legal Name" 
                            value={form.name} 
                            onChange={(e) => handleChange('name', e.target.value)} 
                            variant="outlined"
                            size="small"
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={{ 
                                '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fbfaf8' },
                                '& .MuiInputLabel-root': { 
                                  fontSize: '0.85rem', 
                                  fontWeight: 600,
                                  '&.MuiInputLabel-shrink': { transform: 'translate(14px, -11px) scale(0.85)', bgcolor: 'white', px: 0.5 }
                                }
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField 
                            fullWidth 
                            label="Email Communications" 
                            value={form.email} 
                            onChange={(e) => handleChange('email', e.target.value)} 
                            variant="outlined"
                            size="small"
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={{ 
                                '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fbfaf8' },
                                '& .MuiInputLabel-root': { 
                                  fontSize: '0.85rem', 
                                  fontWeight: 600,
                                  '&.MuiInputLabel-shrink': { transform: 'translate(14px, -11px) scale(0.85)', bgcolor: 'white', px: 0.5 }
                                }
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField 
                            fullWidth 
                            label="Mobile Contact" 
                            value={form.phone} 
                            onChange={(e) => handleChange('phone', e.target.value)} 
                            variant="outlined"
                            size="small"
                            sx={{ 
                                '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fbfaf8' },
                                '& .MuiInputLabel-root': { fontSize: '0.85rem', fontWeight: 600 }
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
                  <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'rgba(184, 149, 106, 0.05)', color: '#B8956A' }}>
                    <LocationOn fontSize="small" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>Geographic Residence</Typography>
                </Stack>
                <Grid container spacing={3}>
                    <Grid size={12}>
                        <TextField 
                            fullWidth 
                            label="Residential Street / Suite" 
                            value={form.address.street} 
                            onChange={(e) => handleChange('address.street', e.target.value)} 
                            variant="outlined"
                            size="small"
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={{ 
                                '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fbfaf8' },
                                '& .MuiInputLabel-root': { 
                                  fontSize: '0.85rem', 
                                  fontWeight: 600,
                                  '&.MuiInputLabel-shrink': { transform: 'translate(14px, -11px) scale(0.85)', bgcolor: 'white', px: 0.5 }
                                }
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField 
                            fullWidth 
                            label="City" 
                            value={form.address.city} 
                            onChange={(e) => handleChange('address.city', e.target.value)} 
                            variant="outlined"
                            size="small"
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={{ 
                                '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fbfaf8' },
                                '& .MuiInputLabel-root': { 
                                  fontSize: '0.85rem', 
                                  fontWeight: 600,
                                  '&.MuiInputLabel-shrink': { transform: 'translate(14px, -11px) scale(0.85)', bgcolor: 'white', px: 0.5 }
                                }
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField 
                            fullWidth 
                            label="State / Province" 
                            value={form.address.state} 
                            onChange={(e) => handleChange('address.state', e.target.value)} 
                            variant="outlined"
                            size="small"
                            sx={{ 
                                '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fbfaf8' },
                                '& .MuiInputLabel-root': { fontSize: '0.85rem', fontWeight: 600 }
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField 
                            fullWidth 
                            label="Postal Code" 
                            value={form.address.zipCode} 
                            onChange={(e) => handleChange('address.zipCode', e.target.value)} 
                            variant="outlined"
                            size="small"
                            sx={{ 
                                '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fbfaf8' },
                                '& .MuiInputLabel-root': { fontSize: '0.85rem', fontWeight: 600 }
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField 
                            fullWidth 
                            label="Country" 
                            value={form.address.country} 
                            onChange={(e) => handleChange('address.country', e.target.value)} 
                            variant="outlined"
                            size="small"
                            sx={{ 
                                '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fbfaf8' },
                                '& .MuiInputLabel-root': { fontSize: '0.85rem', fontWeight: 600 }
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
