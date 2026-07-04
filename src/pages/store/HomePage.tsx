import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid,
  Stack,
  IconButton,
} from '@mui/material';
import { 
  East, 
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    pcImage: '/images/hero/hero-1-pc.jpg',
    mobileImage: '/images/hero/hero-1-pc.jpg',

    btn1Text: 'Shop Now',
    btn1Link: '/shop',
    btn2Text: 'Our Story',
    btn2Link: '/about',
  },
  {
    pcImage: '/images/hero/hero-2-pc.jpg',
    mobileImage: '/images/hero/hero-2-pc.jpg',

    btn1Text: 'Shop Now',
    btn1Link: '/shop',
    btn2Text: 'Our Story',
    btn2Link: '/about',
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
  }),
  center: {
    x: 0,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
  }),
};

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

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handleSelectSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Hero Section */}
      <Box
        sx={{
          height: { xs: 'auto', md: '100vh' },
          aspectRatio: { xs: '2/1', md: 'auto' },
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          bgcolor: 'primary.main',
          color: 'white',
          overflow: 'hidden',
          mt: { xs: '0px', md: '-80px' }, // Pull up to overlap with transparent navbar on desktop only
        }}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
            }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <Box
              component="img"
              src={SLIDES[currentSlide].pcImage}
              alt="Alpac Hero"
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 20%',
                zIndex: 0,
              }}
              loading="eager"
              decoding="async"
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: {
                  xs: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 20%, rgba(0,0,0,0.55) 100%), rgba(0,0,0,0.2)',
                  md: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 30%, rgba(0,0,0,0.45) 100%), rgba(0,0,0,0.15)',
                },
                zIndex: 1,
              }}
            />

            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, px: { xs: 3, md: 6, lg: 8 }, height: '100%' }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: { xs: 'auto', md: '80%' },
                  bottom: { xs: '8px', md: 'auto' },
                  left: { xs: 'auto', md: '50%' },
                  right: { xs: '16px', md: 'auto' },
                  transform: { xs: 'none', md: 'translate(-50%, -50%)' },
                  width: { xs: 'auto', md: '100%' },
                  textAlign: { xs: 'right', md: 'center' },
                  display: 'flex',
                  justifyContent: { xs: 'flex-end', md: 'center' },
                }}
              >
                <Box
                  sx={{
                    background: {
                      xs: 'none',
                      md: 'radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 70%)',
                    },
                    px: { xs: 2, md: 8 },
                    py: { xs: 1, md: 6 },
                    width: 'fit-content',
                  }}
                >
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'row',
                      justifyContent: { xs: 'flex-end', md: 'center' }, 
                      alignItems: 'center',
                      gap: { xs: 1.5, sm: 3 }, 
                      width: 'fit-content',
                      mx: { xs: 0, md: 'auto' },
                    }}
                  >
                    <Button
                      component={Link}
                      to={SLIDES[currentSlide].btn1Link}
                      variant="contained"
                      size="large"
                      color="secondary"
                      sx={{ 
                        px: { xs: 2.5, sm: 5 }, 
                        py: { xs: 1, sm: 1.8 }, 
                        color: 'white', 
                        fontWeight: 600, 
                        fontSize: { xs: '0.8rem', sm: '1.1rem' }, 
                        borderRadius: 2,
                        boxShadow: '0px 4px 15px rgba(0,0,0,0.3)',
                        width: 'auto',
                      }}
                    >
                      {SLIDES[currentSlide].btn1Text}
                    </Button>
                    <Button
                      component={Link}
                      to={SLIDES[currentSlide].btn2Link}
                      variant="outlined"
                      size="large"
                      sx={{ 
                        display: { xs: 'none', md: 'inline-flex' },
                        px: { xs: 2.5, sm: 5 }, 
                        py: { xs: 1, sm: 1.8 }, 
                        color: 'white', 
                        borderColor: 'white',
                        borderWidth: '2px',
                        fontWeight: 600, 
                        fontSize: { xs: '0.8rem', sm: '1.1rem' }, 
                        borderRadius: 2,
                        boxShadow: '0px 4px 15px rgba(0,0,0,0.2)',
                        width: 'auto',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.1)',
                          borderColor: 'white',
                          borderWidth: '2px',
                        }
                      }}
                    >
                      {SLIDES[currentSlide].btn2Text}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Container>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <IconButton
          onClick={handlePrevSlide}
          sx={{
            position: 'absolute',
            left: { xs: 8, md: 24 },
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.3)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
            zIndex: 3,
            display: { xs: 'none', sm: 'inline-flex' },
          }}
        >
          <ChevronLeft sx={{ fontSize: { xs: 30, md: 40 } }} />
        </IconButton>

        <IconButton
          onClick={handleNextSlide}
          sx={{
            position: 'absolute',
            right: { xs: 8, md: 24 },
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.3)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
            zIndex: 3,
            display: { xs: 'none', sm: 'inline-flex' },
          }}
        >
          <ChevronRight sx={{ fontSize: { xs: 30, md: 40 } }} />
        </IconButton>

        {/* Slide Indicators */}
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 10, md: 24 },
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: { xs: 1, md: 1.5 },
            zIndex: 3,
          }}
        >
          {SLIDES.map((_, index) => (
            <Box
              key={index}
              onClick={() => handleSelectSlide(index)}
              sx={{
                width: { xs: 6, md: 10 },
                height: { xs: 6, md: 10 },
                borderRadius: '50%',
                bgcolor: currentSlide === index ? 'secondary.main' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: currentSlide === index ? 'secondary.main' : 'rgba(255,255,255,0.8)',
                  transform: 'scale(1.2)',
                },
              }}
            />
          ))}
        </Box>
      </Box>


      {/* New Arrivals Section - Boxed */}
      <Box sx={{ pt: { xs: 2, md: 12 }, pb: { xs: 8, md: 12 } }}>
        <Container maxWidth={false} disableGutters>
          <Box sx={{ 
            bgcolor: 'rgba(244, 242, 238, 0)', 
            pt: { xs: 0, md: 10 },
            pb: { xs: 6, md: 10 },
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
