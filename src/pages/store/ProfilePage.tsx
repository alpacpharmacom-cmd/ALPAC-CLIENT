import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, TextField, Button, Grid, Avatar,
  IconButton, InputAdornment, Card, Stack, Divider
} from '@mui/material';
import { 
 Visibility, VisibilityOff, Security, 
  LocalShipping, AccountCircle
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import { Link } from 'react-router-dom';
import { authAPI } from '../../api/auth.api';
import DetailSkeleton from '../../components/skeletons/DetailSkeleton';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || '',
        },
      });
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const key = field.split('.')[1];
      setForm(prev => ({ ...prev, address: { ...prev.address, [key]: value } }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
      };
      await updateProfile(data);
      toast.success('Profile information updated');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.oldPassword || !form.newPassword) {
      toast.error('Current and new passwords are required');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (form.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await updateProfile({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword
      });
      toast.success('Password updated successfully');
      setForm(prev => ({ ...prev, oldPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    }
  };

  const handleForgotPassword = async () => {
    if (!user?.email) return;
    setIsResetting(true);
    try {
      await authAPI.forgotPassword(user.email);
      toast.success('Reset link sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsResetting(false);
    }
  };

  if (isLoading && !user) return <DetailSkeleton type="order" />;
  if (!user) return null;

  const labelStyle = {
    '& .MuiInputLabel-root': { color: 'text.primary', fontWeight: 600, fontSize: '0.9rem' },
    '& .MuiOutlinedInput-root': {
      borderRadius: '16px',
      bgcolor: 'rgba(0,0,0,0.02)',
      '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
      '&.Mui-focused fieldset': { borderWidth: '2px' }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'transparent', pt: { xs: 4, md: 12 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 }, pb: { xs: 6, md: 12 }, position: 'relative', zIndex: 2 }}>
        {/* Simple Welcome Section */}
        <Box sx={{ mb: { xs: 2, md: 4 }, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography
            variant="h1"
            sx={{ 
              fontWeight: 700, 
              fontSize: { xs: '1.8rem', md: '3.5rem' }, 
              color: 'primary.dark',
              fontFamily: '"Playfair Display", serif',
              letterSpacing: '-0.02em'
            }}
          >
            Welcome, {user.name.split(' ')[0]}
          </Typography>
        </Box>

        {/* Dashboard Status Bar */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{ mb: { xs: 3, md: 6 } }}
        >
          <Card 
            sx={{ 
              p: { xs: 2, md: 4 }, 
              borderRadius: '24px', 
              bgcolor: 'primary.dark',
              color: 'white',
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: { xs: 2, md: 4 },
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Avatar
              sx={{
                width: { xs: 80, md: 100 },
                height: { xs: 80, md: 100 },
                bgcolor: '#F3F4F1',
                color: 'primary.dark',
                fontSize: '2.5rem',
                fontWeight: 700,
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                border: '4px solid rgba(255,255,255,0.2)'
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>

            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.5rem', md: '2.2rem' } }}>
                {user.name}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ justifyContent: { xs: 'center', md: 'flex-start' }, alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    bgcolor: '#4B6A8E',
                    px: 2, py: 0.5, 
                    borderRadius: '50px',
                    display: 'flex', alignItems: 'center', gap: 1
                  }}
                >
                  <Security sx={{ color: 'white', fontSize: 14 }} />
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {user.isAdmin ? 'Admin Curator' : 'Standard Member'}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.7, display: { xs: 'none', sm: 'block' } }}>
                  {user.email}
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ textAlign: { xs: 'center', md: 'right' }, width: { xs: '100%', md: 'auto' } }}>
              <Button 
                component={Link} 
                to="/orders" 
                variant="contained" 
                sx={{ 
                  width: { xs: '100%', md: 'auto' },
                  bgcolor: '#B8956A',
                  color: 'white',
                  borderRadius: '16px',
                  px: {xs: 1, md: 4}, 
                  py: {xs: 1, md: 1.5},
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  letterSpacing: '0.1em',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                  '&:hover': { bgcolor: '#A6845B', transform: 'translateY(-2px)' },
                  transition: 'all 0.3s ease'
                }}
              >
                View My History (Orders)
              </Button>
            </Box>
          </Card>
        </MotionBox>

        <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
          <Stack spacing={{ xs: 2.5, md: 4 }}>
            {/* Account Essentials Card */}
            <Card sx={{ p: { xs: 2, md: 5 }, borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: { xs: 2.5, md: 4 } }}>
                <AccountCircle sx={{ color: 'primary.main', opacity: 0.6 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>Personal Identity</Typography>
              </Box>
              <Grid container spacing={2.5}>
                <Grid component="div" size={{ xs: 12, sm: 6 }}>
                  <TextField 
                    fullWidth label="Full Name" 
                    value={form.name} onChange={(e) => handleChange('name', e.target.value)} 
                    sx={labelStyle}
                  />
                </Grid>
                <Grid component="div" size={{ xs: 12, sm: 6 }}>
                  <TextField 
                    fullWidth label="Email Address" 
                    value={form.email} onChange={(e) => handleChange('email', e.target.value)} 
                    sx={labelStyle}
                  />
                </Grid>
                <Grid component="div" size={12}>
                  <TextField 
                    fullWidth label="Contact Number" 
                    value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} 
                    sx={labelStyle}
                  />
                </Grid>
              </Grid>
            </Card>

            {/* Shipping & Delivery Card */}
            <Card sx={{ p: { xs: 2, md: 5 }, borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: { xs: 2.5, md: 4 } }}>
                <LocalShipping sx={{ color: 'primary.main', opacity: 0.6 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>Shipping & Delivery</Typography>
              </Box>
              <Grid container spacing={2.5}>
                <Grid component="div" size={12}>
                  <TextField 
                    fullWidth label="Street Address" 
                    value={form.address.street} onChange={(e) => handleChange('address.street', e.target.value)} 
                    sx={labelStyle}
                  />
                </Grid>
                <Grid component="div" size={{ xs: 12, sm: 6 }}>
                  <TextField 
                    fullWidth label="City" 
                    value={form.address.city} onChange={(e) => handleChange('address.city', e.target.value)} 
                    sx={labelStyle}
                  />
                </Grid>
                <Grid component="div" size={{ xs: 12, sm: 6 }}>
                  <TextField 
                    fullWidth label="State / Region" 
                    value={form.address.state} onChange={(e) => handleChange('address.state', e.target.value)} 
                    sx={labelStyle}
                  />
                </Grid>
                <Grid component="div" size={{ xs: 12, sm: 6 }}>
                  <TextField 
                    fullWidth label="ZIP Code" 
                    value={form.address.zipCode} onChange={(e) => handleChange('address.zipCode', e.target.value)} 
                    sx={labelStyle}
                  />
                </Grid>
                <Grid component="div" size={{ xs: 12, sm: 6 }}>
                  <TextField 
                    fullWidth label="Country" 
                    value={form.address.country} onChange={(e) => handleChange('address.country', e.target.value)} 
                    sx={labelStyle}
                  />
                </Grid>
              </Grid>
            </Card>

            {/* Security Card - Independent Form */}
            <Card sx={{ p: { xs: 2, md: 5 }, borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
              <form onSubmit={handleUpdatePassword}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: { xs: 2, md: 3 } }}>
                  <Security sx={{ color: 'primary.main', opacity: 0.6 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>Secure Access</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: { xs: 2, md: 4 }, color: 'text.secondary', fontSize: '0.85rem' }}>
                  Reset your password by providing your current one for verification.
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid component="div" size={12}>
                    <TextField 
                      fullWidth label="Current Password" type={showOldPassword ? 'text' : 'password'}
                      value={form.oldPassword} onChange={(e) => handleChange('oldPassword', e.target.value)} 
                      sx={labelStyle}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end" size="small">
                                {showOldPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }
                      }}
                    />
                  </Grid>
                  <Grid component="div" size={{ xs: 12, sm: 6 }}>
                    <TextField 
                      fullWidth label="New Password" type={showNewPassword ? 'text' : 'password'}
                      value={form.newPassword} onChange={(e) => handleChange('newPassword', e.target.value)} 
                      sx={labelStyle}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end" size="small">
                                {showNewPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }
                      }}
                    />
                  </Grid>
                  <Grid component="div" size={{ xs: 12, sm: 6 }}>
                    <TextField 
                      fullWidth label="Confirm New Password" type={showConfirmPassword ? 'text' : 'password'}
                      value={form.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} 
                      sx={labelStyle}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                                {showConfirmPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }
                      }}
                    />
                  </Grid>
                  <Grid component="div" size={12}>
                    <Button
                      type="submit"
                      variant="outlined"
                      disabled={isLoading}
                      fullWidth
                      sx={{ 
                        mt: 2, py: 1.5, 
                        borderRadius: '12px',
                        fontWeight: 700,
                        borderWidth: '2px',
                        '&:hover': { borderWidth: '2px' }
                      }}
                    >
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </Grid>
                </Grid>
              </form>

              <Divider sx={{ my: { xs: 2.5, md: 4 }, opacity: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  OR
                </Typography>
              </Divider>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  Forgot your current password? We can send a secure reset link to your email.
                </Typography>
                <Button
                  onClick={handleForgotPassword}
                  disabled={isResetting}
                  variant="text"
                  sx={{ 
                    fontWeight: 700, 
                    color: 'primary.main',
                    textDecoration: 'underline',
                    '&:hover': { textDecoration: 'underline', bgcolor: 'transparent', color: 'primary.dark' }
                  }}
                >
                  {isResetting ? 'Sending Link...' : 'Send Password Reset Email'}
                </Button>
              </Box>
            </Card>

            {/* Global Save Button - For Identity & Shipping */}
            <Box sx={{ mt: { xs: 1, md: 2 }, pb: { xs: 2, md: 4 } }}>
              <Button
                onClick={handleUpdateProfile}
                variant="contained"
                disabled={isLoading}
                fullWidth
                sx={{ 
                  height: { xs: 52, md: 64 },
                  bgcolor: 'primary.main', 
                  color: 'white',
                  textTransform: 'uppercase',
                  fontWeight: 800,
                  letterSpacing: '0.2em',
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(45,75,56,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    bgcolor: 'primary.dark', 
                    boxShadow: '0 15px 40px rgba(45,75,56,0.3)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {isLoading ? 'Synchronizing...' : 'Save Profile Changes'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
