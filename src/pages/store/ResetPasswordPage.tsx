import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Container,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, LockReset } from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authAPI } from '../../api/auth.api';
import authBg from '../../assets/auth-bg.png';
import FormSkeleton from '../../components/skeletons/FormSkeleton';

const MotionBox = motion.create(Box);

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.resetPassword(token!, password);
      toast.success('Password reset successfully! You can now sign in.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <FormSkeleton fields={2} titleWidth="60%" hasFooter={false} />;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'white' }}>
      {/* Left Side: Brand Image (Desktop) */}
      <Box 
        sx={{ 
          flex: 1, 
          display: { xs: 'none', lg: 'block' },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          component="img"
          src={authBg}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.95)'
          }}
        />
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            bgcolor: 'rgba(61, 107, 79, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            px: 10
          }}
        >
          <Typography 
            variant="h2" 
            sx={{ 
              color: 'white', 
              fontWeight: 700, 
              fontFamily: '"Playfair Display", serif',
              maxWidth: 500,
              mb: 2,
              textShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            Securing Your Wellness Journey.
          </Typography>
        </Box>
      </Box>

      {/* Right Side: Form */}
      <Box 
        sx={{ 
          flex: { xs: 1, lg: 0.8 }, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: '#FCFAF7',
          px: { xs: 2.5, md: 8 },
          position: 'relative'
        }}
      >
        <Box sx={{ position: 'absolute', bottom: '15%', left: '5%', width: 300, height: 300, bgcolor: 'rgba(184,149,106,0.04)', borderRadius: '50%', filter: 'blur(60px)' }} />
        
        <Container maxWidth="xs" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <LockReset sx={{ color: '#3d6b4f', fontSize: 32 }} />
                <Typography sx={{ color: '#3d6b4f', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                  Secure Reset
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: { xs: '2.4rem', md: '3.2rem' },
                  fontWeight: 600,
                  mb: 1.5,
                  color: '#1A1A1A',
                  letterSpacing: '-0.02em'
                }}
              >
                New Password
              </Typography>
              <Typography sx={{ color: '#666', fontSize: '1rem', fontWeight: 400, opacity: 0.8 }}>
                Choose a strong password to protect your account.
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#999', mr: -1 }}
                        >
                          {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                }}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'transparent',
                    '& fieldset': { borderColor: 'rgba(0,0,0,0.1)', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottomWidth: '1.5px' },
                    '&:hover fieldset': { borderColor: '#3d6b4f' },
                    '&.Mui-focused fieldset': { borderColor: '#3d6b4f', borderBottomWidth: '2px' },
                    transition: 'all 0.3s ease'
                  },
                  '& .MuiInputLabel-root': { fontSize: '0.9rem', color: '#999' },
                  '& .Mui-focused .MuiInputLabel-root': { color: '#3d6b4f' }
                }}
              />

              <TextField
                fullWidth
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                variant="outlined"
                sx={{ 
                  mb: 5,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'transparent',
                    '& fieldset': { borderColor: 'rgba(0,0,0,0.1)', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottomWidth: '1.5px' },
                    '&:hover fieldset': { borderColor: '#3d6b4f' },
                    '&.Mui-focused fieldset': { borderColor: '#3d6b4f', borderBottomWidth: '2px' },
                    transition: 'all 0.3s ease'
                  },
                  '& .MuiInputLabel-root': { fontSize: '0.9rem', color: '#999' },
                  '& .Mui-focused .MuiInputLabel-root': { color: '#3d6b4f' }
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  bgcolor: '#3d6b4f',
                  color: 'white',
                  py: 2.2,
                  mb: 4,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  boxShadow: 'none',
                  '&:hover': { 
                    bgcolor: '#111',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
                  },
                  transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
                }}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>

              <Typography sx={{ textAlign: 'center' }}>
                <Link 
                  to="/login" 
                  style={{ 
                    color: '#666', 
                    fontSize: '0.9rem', 
                    textDecoration: 'none',
                    fontWeight: 500
                  }}
                >
                  Cancel and return to Sign In
                </Link>
              </Typography>
            </Box>
          </MotionBox>
        </Container>
      </Box>
    </Box>
  );
}
