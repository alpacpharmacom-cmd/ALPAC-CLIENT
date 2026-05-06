import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Divider, 
  InputAdornment, 
  IconButton,
  Container,
  Card
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  LockOpen
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MotionBox = motion.create(Box);
const MotionForm = motion.create('form');

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, ease: 'easeOut' }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.165, 0.84, 0.44, 1] } }
};

const inputStyles = {
  mb: 3,
  '& .MuiOutlinedInput-root': {
    bgcolor: '#f5f7f5',
    borderRadius: '16px',
    transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
    fontFamily: '"DM Sans", sans-serif',
    '& fieldset': { 
      border: 'none',
    },
    '&:hover': { 
      bgcolor: '#f0f2f0',
    },
    '&.Mui-focused': { 
      bgcolor: '#ffffff',
      boxShadow: '0 0 0 4px rgba(45,75,56,0.12)',
    }
  },
  '& .MuiInputBase-input': {
    py: 1.8,
    px: 3,
  }
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Box sx={{ minHeight: 'calc(100vh - 68px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', bgcolor: 'transparent', position: 'relative', overflow: 'hidden', pt: { xs: 2, md: 6 }, pb: 8 }}>
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, maxWidth: { sm: 500, md: 560 } }}>
        <MotionBox
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Card 
            sx={{ 
              borderRadius: '35px', 
              boxShadow: '0 40px 100px rgba(0,0,0,0.08)', 
              border: '1px solid rgba(0,0,0,0.03)', 
              overflow: 'visible',
              bgcolor: 'white',
              px: { xs: 2, md: 5 },
              pt: { xs: 4, md: 6 },
              pb: { xs: 4, md: 6 }
            }}
          >
            <MotionForm 
              onSubmit={handleSubmit}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <MotionBox variants={itemVariants} sx={{ textAlign: 'center', mb: { xs: 3, md: 5 } }}>
                <Typography
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: { xs: '1.8rem', md: '2.5rem' },
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: '#1A1A1A',
                    mb: 1
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.95rem', fontWeight: 500 }}>
                  Access your botanical wellness portal
                </Typography>
              </MotionBox>

              <MotionBox variants={itemVariants}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: '#1A1A1A', ml: 0.5, letterSpacing: '0.05em', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={inputStyles}
                />
              </MotionBox>

              <MotionBox variants={itemVariants}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: '#1A1A1A', ml: 0.5, letterSpacing: '0.05em', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  Password
                </Typography>
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end" sx={{ mr: 1 }}>
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'text.secondary' }}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                  sx={{ ...inputStyles, mb: 1 }}
                />
              </MotionBox>

              <MotionBox variants={itemVariants} sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4, mt: 1 }}>
                <Typography
                  component={Link}
                  to="/forgot-password"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    fontWeight: 600,
                    position: 'relative',
                    '&::after': {
                      content: '""', position: 'absolute', bottom: -2, left: 0, width: '100%', height: '1px', 
                      bgcolor: 'primary.main', transform: 'scaleX(0)', transition: 'transform 0.3s ease', transformOrigin: 'right'
                    },
                    '&:hover': { color: 'primary.main' },
                    '&:hover::after': { transform: 'scaleX(1)', transformOrigin: 'left' }
                  }}
                >
                  Forgot Password?
                </Typography>
              </MotionBox>

              <MotionBox variants={itemVariants}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  endIcon={!isLoading ? <LockOpen /> : undefined}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    py: 2,
                    fontSize: '0.9rem',
                    borderRadius: '50px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: { xs: '0.05em', md: '0.1em' },
                    boxShadow: '0 8px 30px rgba(45,75,56,0.25)',
                    '@media (hover: hover)': {
                      '&:hover': { 
                        bgcolor: '#111',
                        transform: 'translateY(-2px)'
                      }
                    },
                    '&:active': {
                      transform: 'scale(0.98)',
                      boxShadow: '0 4px 15px rgba(45,75,56,0.2)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
                  }}
                >
                  {isLoading ? 'Authenticating...' : 'Sign In'}
                </Button>
              </MotionBox>

              <MotionBox variants={itemVariants}>
                <Divider sx={{ my: 4, opacity: 1 }}>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', fontWeight: 500}}>
                    or
                  </Typography>
                </Divider>
              </MotionBox>

              <MotionBox variants={itemVariants} sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: 'gray', fontSize: '0.9rem', fontWeight: 500, mb: 1.5 }}>
                  New to ALPAC?
                </Typography>
                <Button
                  component={Link}
                  to="/register"
                  fullWidth
                  variant="outlined"
                  sx={{
                    py: 1.8,
                    borderRadius: '50px',
                    color: '#1A1A1A',
                    borderColor: 'rgba(0,0,0,0.1)',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    '&:hover': { 
                      bgcolor: '#f5f7f5',
                      borderColor: 'rgba(0,0,0,0.2)'
                    },
                    '&:active': { transform: 'scale(0.98)' },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Create Account
                </Button>
              </MotionBox>
            </MotionForm>
          </Card>
        </MotionBox>
      </Container>
    </Box>
  );
}

