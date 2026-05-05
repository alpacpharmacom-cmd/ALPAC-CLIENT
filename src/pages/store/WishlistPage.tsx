import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, Button, Skeleton
} from '@mui/material';
import { Delete, ArrowBack, Favorite } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { useWishlistStore } from '../../stores/wishlistStore';
import CardSkeleton from '../../components/skeletons/CardSkeleton';
import ProductCard from '../../components/store/ProductCard';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion.create(Box);

export default function WishlistPage() {
  const { items, loading, initialized, fetchWishlist, toggleWishlistProduct, clearWishlist } = useWishlistStore();
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!initialized) {
      fetchWishlist();
    }
  }, [fetchWishlist, initialized]);

  const handleRemove = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    try {
      await toggleWishlistProduct(productId);
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleClear = async () => {
    try {
      await clearWishlist();
      toast.success('Wishlist cleared');
      setShowConfirm(false);
    } catch {
      toast.error('Failed to clear wishlist');
    }
  };


  if (loading && !initialized) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 8 }, px: { xs: 1.5, md: 6 } }}>
        <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
          <Skeleton variant="text" width={300} height={40} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width={200} height={20} sx={{ mx: 'auto' }} />
        </Box>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {[...Array(4)].map((_, i) => (
            <Grid size={{ xs: 6, md: 3 }} key={i}>
              <CardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'transparent' }}>
      <Box 
        sx={{ 
          bgcolor: 'primary.dark', 
          pt: { xs: 6, md: 12 }, 
          pb: { xs: 6, md: 12 }, 
          textAlign: 'center', 
          color: 'white', 
          position: 'relative', 
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(180deg, rgba(26,46,31,1) 0%, rgba(45,75,56,0.95) 100%)',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h1"
            sx={{ 
              fontWeight: 700, 
              fontSize: { xs: '2.5rem', md: '4rem' }, 
              fontFamily: '"Playfair Display", serif',
              letterSpacing: '-0.02em',
              mb: 1
            }}
          >
            My Wishlist
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.8, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
            Your Curated Collection of Excellence
          </Typography>
        </Box>
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0, 
            background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)', 
            pointerEvents: 'none',
            opacity: 0.1
          }} 
        />
      </Box>

      <Container maxWidth={false} sx={{ px: { xs: 1.5, md: 6, lg: 10 }, py: { xs: 4, md: 10 } }}>
        {items.length === 0 ? (
          <MotionBox 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ 
              textAlign: 'center', 
              py: 12, 
              px: 4,
              bgcolor: 'white',
              borderRadius: '32px',
              boxShadow: '0 40px 80px rgba(0,0,0,0.04)',
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            <Favorite sx={{ fontSize: 64, color: 'primary.main', opacity: 0.1, mb: 3 }} />
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, fontFamily: '"Playfair Display", serif', color: 'primary.dark' }}>
              Your Registry is Empty
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              Begin your journey by discovering botanical formulations and wellness selections to add to your personal curated collection.
            </Typography>
            <Button
              component={Link}
              to="/shop"
              variant="contained"
              size="large"
              startIcon={<ArrowBack />}
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'white',
                px: 5,
                py: 1.5,
                borderRadius: '50px',
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                boxShadow: '0 8px 25px rgba(45,75,56,0.25)',
                '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)' },
                transition: 'all 0.3s ease'
              }}
            >
              Discover Shop
            </Button>
          </MotionBox>
        ) : (
          <Box>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                gap: 2,
                mb: { xs: 4, md: 6 }
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: '"Playfair Display", serif', color: 'primary.dark' }}>
                Saved Selections <Typography component="span" sx={{ color: 'text.secondary', fontSize: '1rem', ml: 1 }}>({items.length})</Typography>
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => setShowConfirm(true)}
                size="small"
                sx={{ 
                  borderRadius: '50px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  px: 2,
                  py: 1,
                  borderColor: 'rgba(170,57,43,0.2)',
                  '&:hover': { bgcolor: 'rgba(170,57,43,0.05)', borderColor: 'error.main' }
                }}
              >
                Clear All
              </Button>
            </Box>

            <Grid container spacing={{ xs: 2, sm: 4, md: 5 }}>
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <Grid 
                    component={motion.div} 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    size={{ xs: 6, sm: 4, md: 3 }} 
                    key={item._id}
                  >
                    <ProductCard
                      product={item}
                      index={index}
                      handleToggleWishlist={handleRemove}
                      isWishlisted={true}
                    />
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          </Box>
        )}
      </Container>
      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleClear}
        title="Clear Wishlist"
        message="Are you sure you want to remove all items from your wishlist? This will permanently delete your curated collection."
        confirmText="Clear Everything"
        loading={loading}
      />
    </Box>
  );
}

