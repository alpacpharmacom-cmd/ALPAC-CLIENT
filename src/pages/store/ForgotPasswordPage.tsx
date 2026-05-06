import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Container,
  Stack
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authAPI } from '../../api/auth.api';
import authBg from '../../assets/auth-bg.png';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MotionBox = motion.create(Box);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setIsSubmitted(true);
      toast.success('Reset link sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

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
            Reconnect With Your Wellness.
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
          px: { xs: 2, md: 8 },
          position: 'relative'
        }}
      >
        <Box sx={{ position: 'absolute', top: '10%', right: '10%', width: 250, height: 250, bgcolor: 'rgba(74,107,65,0.03)', borderRadius: '50%', filter: 'blur(50px)' }} />
        
        <Container maxWidth="xs" sx={{ py: { xs: 4, md: 8 }, position: 'relative', zIndex: 1 }}>
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: { xs: 3, md: 6 } }}>
              <Button
                component={Link}
                to="/login"
                startIcon={<ArrowBack />}
                sx={{ 
                  color: '#666', 
                  mb: 4, 
                  p: 0, 
                  '&:hover': { color: '#3d6b4f', bgcolor: 'transparent' },
                  textTransform: 'none',
                  fontSize: '0.9rem'
                }}
              >
                Back to Login
              </Button>
              <Typography
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: { xs: '2rem', md: '3.2rem' },
                  fontWeight: 600,
                  mb: 1.5,
                  color: '#1A1A1A',
                  letterSpacing: '-0.02em'
                }}
              >
                Forgot Password
              </Typography>
              <Typography sx={{ color: '#666', fontSize: '1rem', fontWeight: 400, opacity: 0.8 }}>
                {isSubmitted 
                  ? "Check your email for instructions to reset your password."
                  : "Enter your email address and we'll send you a link to reset your password."}
              </Typography>
            </Box>

            {!isSubmitted ? (
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </Box>
            ) : (
              <Stack spacing={2}>
                <Button
                  component={Link}
                  to="/login"
                  fullWidth
                  variant="outlined"
                  sx={{
                    borderColor: '#3d6b4f',
                    color: '#3d6b4f',
                    py: 2,
                    fontWeight: 600,
                    '&:hover': { bgcolor: 'rgba(61, 107, 79, 0.05)', borderColor: '#3d6b4f' }
                  }}
                >
                  Return to Sign In
                </Button>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    textAlign: 'center', 
                    color: '#999',
                    cursor: 'pointer',
                    '&:hover': { color: '#3d6b4f' }
                  }} 
                  onClick={() => setIsSubmitted(false)}
                >
                  Didn't receive an email? Try again
                </Typography>
              </Stack>
            )}
          </MotionBox>
        </Container>
      </Box>
    </Box>
  );
}
