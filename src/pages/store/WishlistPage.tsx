import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, Button, Skeleton
} from '@mui/material';
import { Delete, ArrowBack } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { useWishlistStore } from '../../stores/wishlistStore';
import CardSkeleton from '../../components/skeletons/CardSkeleton';
import ProductCard from '../../components/store/ProductCard';

export default function WishlistPage() {
  const { items, loading, fetchWishlist, toggleWishlistProduct, clearWishlist } = useWishlistStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

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
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      try {
        await clearWishlist();
        toast.success('Wishlist cleared');
      } catch {
        toast.error('Failed to clear wishlist');
      }
    }
  };


  if (loading && items.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, md: 6 } }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Skeleton variant="text" width={300} height={40} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width={200} height={20} sx={{ mx: 'auto' }} />
        </Box>
        <Grid container spacing={4}>
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
    <Box>
      <Box 
        sx={{ 
          bgcolor: 'primary.dark', 
          pt: { xs: 8, md: 12 }, 
          pb: { xs: 8, md: 12 }, 
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
              mb: 2
            }}
          >
            My Wishlist
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.8, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
            A curated collection of desired Products
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

      <Container maxWidth={false} sx={{ px: { xs: 2.5, md: 6, lg: 10 }, py: { xs: 6, md: 10 } }}>
        {items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 300, color: 'text.secondary' }}>
              Your wishlist is currently empty.
            </Typography>
            <Button
              component={Link}
              to="/shop"
              variant="contained"
              size="large"
              startIcon={<ArrowBack />}
              sx={{ bgcolor: '#4a6741', '&:hover': { bgcolor: '#3a5331' } }}
            >
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <Box>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                gap: 2,
                mb: 4 
              }}
            >
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {items.length} item{items.length !== 1 ? 's' : ''} saved
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleClear}
                size="small"
                sx={{ borderRadius: '10px' }}
              >
                Clear Wishlist
              </Button>
            </Box>

            <Grid container spacing={{ xs: 2.5, sm: 4.5 }}>
              {items.map((item, index) => (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={item._id}>
                  <ProductCard
                    product={item}
                    index={index}
                    handleToggleWishlist={handleRemove}
                    isWishlisted={true}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}
