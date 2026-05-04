import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  useTheme,
  useMediaQuery,
  Grid,
  Stack,
} from '@mui/material';
import { 
  East, 
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import { useAuthStore } from '../../stores/authStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useProductStore } from '../../stores/productStore';
import toast from 'react-hot-toast';
import ProductCard from '../../components/store/ProductCard';
import CardSkeleton from '../../components/skeletons/CardSkeleton';

const MotionBox = motion.create(Box);
motion.create(Typography);

export default function HomePage() {
  const theme = useTheme();
  useMediaQuery(theme.breakpoints.down('sm'));
  useMediaQuery(theme.breakpoints.down('md'));

  const { newArrivals, topRated, fetchedHome, fetchHomeData } = useProductStore();
  const [loading, setLoading] = useState(!fetchedHome);

  const { isAuthenticated } = useAuthStore();
  const wishlistItems = useWishlistStore(state => state.items);
  const toggleWishlistProduct = useWishlistStore(state => state.toggleWishlistProduct);

  useEffect(() => {
    const fetchData = async () => {
      if (!fetchedHome) {
        setLoading(true);
        try {
          await fetchHomeData();
        } catch (error) {
          console.error('Failed to fetch home page data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [fetchedHome, fetchHomeData]);

  const handleToggleWishlist = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to use wishlist');
      return;
    }
    try {
      await toggleWishlistProduct(productId);
      const isWishlisted = wishlistItems.some(item => item._id === productId);
      if (isWishlisted) {
        toast.success('Removed from wishlist');
      } else {
        toast.success('Added to wishlist!');
      }
    } catch {
      toast.error('Failed to update wishlist');
    }
  };





  return (
    <Box sx={{ position: 'relative' }}>
      {/* Hero Section */}
      <Box
        sx={{
          height: '100vh', // Full viewport height
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          bgcolor: 'primary.main',
          color: 'white',
          overflow: 'hidden',
          mt: '-80px', // Pull up to overlap with transparent navbar
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/images/hero/hero_banner.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%', // Slightly higher focus to show products better
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(45,75,56,0.7) 0%, rgba(45,75,56,0.2) 100%)',
            }
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <MotionBox
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: 'opacity, transform' }}
              >
                <Typography
                  sx={{
                    color: 'secondary.main',
                    letterSpacing: '0.4em',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    mb: 3,
                    textTransform: 'uppercase',
                  }}
                >
                  Essential Skincare Rituals
                </Typography>
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '3.2rem', md: '5rem', lg: '5.8rem' },
                    lineHeight: 1,
                    mb: 4,
                    color: 'white',
                  }}
                >
                  Reveal Your
                  <br />
                  <Box component="span" sx={{ color: 'secondary.main', fontStyle: 'italic' }}>Natural</Box> Glow
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.85)',
                    maxWidth: 520,
                    mb: 6,
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                  }}
                >
                  Discover the harmony of science and nature. Our premium botanical
                  formulations are designed to nourish, protect, and illuminate
                  your skin from within.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                  <Button
                    component={Link}
                    to="/shop"
                    variant="contained"
                    size="large"
                    color="secondary"
                    endIcon={<East />}
                    sx={{ px: 5, py: 2, color: 'white' }}
                  >
                    Explore Shop
                  </Button>
                  <Button
                    component={Link}
                    to="/about"
                    variant="outlined"
                    size="large"
                    sx={{ 
                      borderColor: 'rgba(255,255,255,0.4)', 
                      color: 'white', 
                      px: 5, 
                      py: 2,
                      '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' }
                    }}
                  >
                    Our Philosophy
                  </Button>
                </Stack>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>


      {/* New Arrivals Section - Boxed */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth={false} disableGutters>
          <Box sx={{ 
            bgcolor: 'rgba(244, 242, 238, 0)', 
            py: { xs: 6, md: 10 },
            px: { xs: 2, md: 4, lg: 6 },
          }}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={{ xs: 2, sm: 0 }}
              sx={{ 
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'flex-end' }, 
                mb: { xs: 4, md: 6 } // Reduced margin bottom
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: 'secondary.main',
                    letterSpacing: '0.3em',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    mb: 1.5,
                    textTransform: 'uppercase',
                  }}
                >
                  Just Landed
                </Typography>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '2.4rem', sm: '3rem', md: '3.75rem' } // Scaled h2 for mobile
                  }}
                >
                  New Arrivals
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/shop"
                endIcon={<East />}
                sx={{ 
                  color: '#111', 
                  fontWeight: 600, 
                  px: 0, 
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  '&:hover': { bgcolor: 'transparent', color: 'primary.main' } 
                }}
              >
                View Collection
              </Button>
            </Stack>

            <Grid container spacing={{ xs: 2.5, sm: 4 }}>
              {loading 
                ? [...Array(4)].map((_, i) => (
                    <Grid size={{ xs: 6, sm: 6, md: 3 }} key={i}>
                      <CardSkeleton />
                    </Grid>
                  ))
                : newArrivals.map((product, index) => (
                    <Grid component="div" size={{ xs: 6, sm: 6, md: 3 }} key={product._id}>
                      <ProductCard 
                        product={product} 
                        index={index} 
                        handleToggleWishlist={handleToggleWishlist}
                        isWishlisted={wishlistItems.some(item => item._id === product._id)}
                      />
                    </Grid>
                  ))
              }
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Featured Banner / Category Grid */}
      <Box sx={{ py: 12, bgcolor: 'primary.dark', backgroundImage: 'linear-gradient(180deg, rgba(26,46,31,1) 0%, rgba(45,75,56,0.95) 100%)' }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6, xl: 10 } }}>
          <Grid container spacing={4} sx={{ minHeight: { md: 650 } }}>
            {/* Main Featured Card: Cosmetics */}
            <Grid component="div" size={{ xs: 12, md: 7 }}>
              <Link to="/shop?category=cosmetics" style={{ textDecoration: 'none', height: '100%', display: 'block' }}>
                <MotionBox
                  whileHover="hover"
                  initial="initial"
                  sx={{
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '32px',
                    bgcolor: 'primary.main',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    cursor: 'pointer',
                  }}
                >
                  <MotionBox
                    variants={{
                      initial: { scale: 1 },
                      hover: { scale: 1.1 }
                    }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: 'url(/images/nature/botanical_cosmetics.png)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(26,46,31,0.95) 0%, rgba(26,46,31,0.3) 50%, transparent 100%)',
                      zIndex: 1,
                    }}
                  />
                  
                  <Box sx={{ position: 'relative', zIndex: 2, p: { xs: 6, md: 8 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <Typography
                      sx={{
                        color: 'secondary.main',
                        letterSpacing: '0.4em',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        mb: 2,
                        textTransform: 'uppercase',
                      }}
                    >
                      Botanical Daily Care
                    </Typography>
                    <Typography variant="h2" sx={{ mb: 3, fontWeight: 600, color: 'white' }}>Artisan Cosmetics</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, maxWidth: 400, fontSize: '1.1rem', lineHeight: 1.7 }}>
                      Gentle cleansers, potent serums, and nourishing moisturizers crafted for Every Skin Type.
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      sx={{ 
                        alignSelf: 'flex-start', 
                        px: 5, 
                        py: 1.5,
                        color: 'white',
                        boxShadow: '0 10px 30px rgba(184,149,106,0.3)'
                      }}
                    >
                      Explore The Lab
                    </Button>
                  </Box>
                </MotionBox>
              </Link>
            </Grid>

            {/* Side Column */}
            <Grid component="div" size={{ xs: 12, md: 5 }}>
              <Stack spacing={4} sx={{ height: '100%' }}>
                {/* Secondary Card: Inner Beauty */}
                <Link to="/shop?category=nutrients" style={{ textDecoration: 'none', flex: 1, display: 'block' }}>
                  <MotionBox
                    whileHover="hover"
                    initial="initial"
                    sx={{
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '32px',
                      bgcolor: '#4a6b41',
                      cursor: 'pointer',
                    }}
                  >
                    <MotionBox
                      variants={{
                        initial: { scale: 1 },
                        hover: { scale: 1.1 }
                      }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'url(/images/nature/misty_vitality.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(26,46,31,0.9) 0%, transparent 80%)',
                        zIndex: 1,
                      }}
                    />
                    <Box sx={{ position: 'relative', zIndex: 2, p: 5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                      <Typography variant="h3" sx={{ mb: 2, fontWeight: 600, color: 'white', fontSize: '2.2rem' }}>Inner Beauty</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 3, fontSize: '0.95rem' }}>Premium supplements for natural vitality from within.</Typography>
                      <Button variant="text" sx={{ color: 'secondary.main', p: 0, fontWeight: 700, letterSpacing: '0.1em' }} endIcon={<East />}>Discover More</Button>
                    </Box>
                  </MotionBox>
                </Link>

                {/* Third Card: Our Story */}
                <Link to="/about" style={{ textDecoration: 'none', flex: 1, display: 'block' }}>
                  <MotionBox
                    whileHover="hover"
                    initial="initial"
                    sx={{
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '32px',
                      bgcolor: 'secondary.main',
                      cursor: 'pointer',
                    }}
                  >
                    <MotionBox
                      variants={{
                        initial: { scale: 1 },
                        hover: { scale: 1.1 }
                      }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'url(/images/nature/organic_story.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(150,114,78,0.9) 0%, transparent 80%)',
                        zIndex: 1,
                      }}
                    />
                    <Box sx={{ position: 'relative', zIndex: 2, p: 5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                      <Typography variant="h3" sx={{ mb: 2, fontWeight: 600, color: 'white', fontSize: '2.2rem' }}>Our Story</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.9)', mb: 3, fontSize: '0.95rem' }}>Learn about our commitment to pure, ethical skincare.</Typography>
                      <Button variant="text" sx={{ color: 'white', p: 0, fontWeight: 700, letterSpacing: '0.1em', opacity: 0.9 }} endIcon={<East />}>Read Full Story</Button>
                    </Box>
                  </MotionBox>
                </Link>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Top Rated Section - Boxed */}
      <Box sx={{ py: { xs: 10, md: 16 } }}>
        <Container maxWidth={false} disableGutters>
          <Box sx={{ 
            bgcolor: 'rgba(244, 242, 238, 0.0)', 
            py: { xs: 8, md: 12 },
            px: { xs: 2, md: 4, lg: 6 }, // Reduced horizontal padding
          }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
              <Typography
                sx={{
                  color: 'secondary.main',
                  letterSpacing: '0.4em',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  mb: 2,
                  textTransform: 'uppercase',
                }}
              >
                Beloved by Many
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 600 }}>Top Rated Favorites</Typography>
            </Box>

            <Grid container spacing={{ xs: 2.5, sm: 4 }}>
              {loading
                ? [...Array(4)].map((_, i) => (
                    <Grid size={{ xs: 6, sm: 6, md: 3 }} key={i}>
                      <CardSkeleton />
                    </Grid>
                  ))
                : topRated.map((product, index) => (
                    <Grid component="div" size={{ xs: 6, sm: 6, md: 3 }} key={product._id}>
                      <ProductCard 
                        product={product} 
                        index={index} 
                        handleToggleWishlist={handleToggleWishlist}
                        isWishlisted={wishlistItems.some(item => item._id === product._id)}
                      />
                    </Grid>
                  ))
              }
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 10 }}>
              <Button
                component={Link}
                to="/shop"
                variant="outlined"
                size="large"
                sx={{ 
                  borderColor: '#111', 
                  color: '#111', 
                  px: 8, 
                  py: 2,
                  borderRadius: '16px',
                  '&:hover': { borderColor: 'primary.main', color: 'primary.main', bgcolor: 'transparent' }
                }}
              >
                See All Products
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
