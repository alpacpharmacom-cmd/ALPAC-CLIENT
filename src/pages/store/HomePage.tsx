import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid,
  Stack,
} from '@mui/material';
import { 
  East, 
  KeyboardArrowDown,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import { useAuthStore } from '../../stores/authStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useProductStore } from '../../stores/productStore';
import toast from 'react-hot-toast';
import ProductCard from '../../components/store/ProductCard';
import CardSkeleton from '../../components/skeletons/CardSkeleton';

export default function HomePage() {
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

  const handleToggleWishlist = React.useCallback(async (e: React.MouseEvent, productId: string) => {
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
  }, [isAuthenticated, toggleWishlistProduct, wishlistItems]);

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          bgcolor: 'primary.dark',
          color: 'white',
          overflow: 'hidden',
          mt: '-80px',
        }}
      >
        {/* Background Image with Motion */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        >
          <Box
            component="img"
            src="/images/hero/hero_banner_v3.png"
            alt="Alpac Skincare Rituals"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              filter: 'brightness(0.85) contrast(1.05)',
            }}
            loading="eager"
            decoding="async"
          />
        </motion.div>

        {/* Sophisticated Overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: {
              xs: 'linear-gradient(to bottom, rgba(26,46,31,0.6) 0%, rgba(26,46,31,0.8) 100%)',
              md: 'linear-gradient(90deg, rgba(26,46,31,0.85) 0%, rgba(26,46,31,0.4) 50%, transparent 100%)',
            },
            zIndex: 1,
          }}
        />

        {/* Content */}
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, px: { xs: 3, md: 8 } }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8, lg: 7 }}>
              <Box>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Typography
                    sx={{
                      color: 'secondary.light',
                      letterSpacing: '0.4em',
                      fontSize: { xs: '0.65rem', md: '0.85rem' },
                      fontWeight: 700,
                      mb: 2,
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box component="span" sx={{ width: 40, height: 1, bgcolor: 'secondary.light' }} />
                    Botanical Excellence
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '3.5rem', sm: '4.5rem', md: '6rem', lg: '7rem' },
                      lineHeight: { xs: 1.1, md: 1 },
                      mb: 3,
                      color: 'white',
                      textShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    }}
                  >
                    Reveal Your
                    <br />
                    <Box 
                      component="span" 
                      sx={{ 
                        color: 'secondary.main', 
                        fontStyle: 'italic',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: '15%',
                          left: 0,
                          width: '100%',
                          height: '4px',
                          bgcolor: 'secondary.main',
                          opacity: 0.3,
                          borderRadius: '2px',
                        }
                      }}
                    >
                      Natural
                    </Box> Glow
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                      maxWidth: 580,
                      mb: 5,
                      fontSize: { xs: '1rem', md: '1.25rem' },
                      lineHeight: 1.8,
                      fontWeight: 400,
                    }}
                  >
                    Experience the synergy of high-performance science and pure botanical extracts. 
                    Our formulations are meticulously crafted to nourish your skin's unique biological needs.
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    <Button
                      component={Link}
                      to="/shop"
                      variant="contained"
                      size="large"
                      color="secondary"
                      endIcon={<East />}
                      sx={{ 
                        px: 6, 
                        py: 2.5, 
                        color: 'white',
                        fontSize: '0.9rem',
                        boxShadow: '0 10px 30px rgba(184,149,106,0.4)',
                        '&:hover': {
                          boxShadow: '0 15px 40px rgba(184,149,106,0.6)',
                        }
                      }}
                    >
                      Explore Collection
                    </Button>
                    <Button
                      component={Link}
                      to="/about"
                      variant="outlined"
                      size="large"
                      sx={{ 
                        borderColor: 'rgba(255,255,255,0.3)', 
                        color: 'white', 
                        px: 6, 
                        py: 2.5,
                        fontSize: '0.9rem',
                        backdropFilter: 'blur(4px)',
                        '&:hover': { 
                          borderColor: 'white', 
                          bgcolor: 'rgba(255,255,255,0.1)',
                        }
                      }}
                    >
                      The Alpac Story
                    </Button>
                  </Stack>
                </motion.div>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: '0.65rem' }}>
            Scroll
          </Typography>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <KeyboardArrowDown sx={{ color: 'secondary.main', fontSize: '2rem' }} />
          </motion.div>
        </motion.div>

        {/* Decorative Light Leak */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '60%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(184,149,106,0.15) 0%, transparent 70%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
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
      <Box sx={{ 
        py: { xs: 8, md: 12 }, 
        bgcolor: '#1a2e1f', // Solid dark green fallback
        position: 'relative'
      }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6, xl: 10 } }}>
          <Grid container spacing={4} sx={{ minHeight: { md: 650 } }}>
            {/* Main Featured Card: Cosmetics */}
            <Grid component="div" size={{ xs: 12, md: 7 }}>
              <Link to="/shop?category=cosmetics" style={{ textDecoration: 'none', height: '100%', display: 'block' }}>
                 <Box
                   sx={{
                     height: '100%',
                     position: 'relative',
                     overflow: 'hidden',
                     borderRadius: '24px', // Reduced slightly for better mobile rendering
                     bgcolor: 'primary.main',
                     boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                     cursor: 'pointer',
                     willChange: 'transform',
                   }}
                 >
                  <Box
                    component="img"
                    src="/images/nature/botanical_cosmetics.png"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    loading="lazy"
                    decoding="async"
                  />
                   <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(26,46,31,0.9) 0%, transparent 60%)',
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
                </Box>
              </Link>
            </Grid>

            {/* Side Column */}
            <Grid component="div" size={{ xs: 12, md: 5 }}>
              <Stack spacing={4} sx={{ height: '100%' }}>
                {/* Secondary Card: Inner Beauty */}
                <Link to="/shop?category=nutrients" style={{ textDecoration: 'none', flex: 1, display: 'block' }}>
                   <Box
                    sx={{
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '24px',
                      bgcolor: '#4a6b41',
                      cursor: 'pointer',
                      willChange: 'transform',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Box
                      component="img"
                      src="/images/nature/misty_vitality.png"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      loading="lazy"
                      decoding="async"
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
                  </Box>
                </Link>

                {/* Third Card: Our Story */}
                <Link to="/about" style={{ textDecoration: 'none', flex: 1, display: 'block' }}>
                   <Box
                    sx={{
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '24px',
                      bgcolor: 'secondary.main',
                      cursor: 'pointer',
                      willChange: 'transform',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Box
                      component="img"
                      src="/images/nature/organic_story.png"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      loading="lazy"
                      decoding="async"
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
                  </Box>
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
