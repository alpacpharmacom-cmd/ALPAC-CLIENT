import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, Button, Rating, Divider,
  TextField, Breadcrumbs, Chip, IconButton, Link as MuiLink, Stack
} from '@mui/material';
import { Add, Remove, ShoppingBag, FavoriteBorder, Favorite } from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { productsAPI } from '../../api/products.api';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useProductStore } from '../../stores/productStore';
import DetailSkeleton from '../../components/skeletons/DetailSkeleton';

const MotionBox = motion.create(Box);

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore();
  const { items: cartItems, addToCart } = useCartStore();
  const { fetchProductById } = useProductStore();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const isInCart = product ? cartItems.some(item => item.product._id === product._id) : false;
  const [reviewRating, setReviewRating] = useState<number | null>(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const { items: wishlistItems, toggleWishlistProduct } = useWishlistStore();
  
  const isWishlisted = product ? wishlistItems.some((item) => item._id === product._id) : false;

  const fetchProduct = async (force = false) => {
    try {
      setLoading(!force);
      const data = await fetchProductById(id!, force);
      setProduct(data);
    } catch {
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await addToCart(product._id, quantity);
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to use wishlist');
      return;
    }
    try {
      await toggleWishlistProduct(product._id);
      if (isWishlisted) {
        toast.success('Removed from wishlist');
      } else {
        toast.success('Added to wishlist!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewRating || !reviewComment.trim()) {
      toast.error('Please provide a rating and comment');
      return;
    }
    setSubmittingReview(true);
    try {
      await productsAPI.createReview(id!, { rating: reviewRating, comment: reviewComment });
      toast.success('Review submitted!');
      setReviewComment('');
      setReviewRating(5);
      fetchProduct(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };



  if (loading) return <DetailSkeleton type="product" />;
  if (!product) return (
    <Container sx={{ py: 10, textAlign: 'center' }}>
      <Typography variant="h3" sx={{ }}>Product not found</Typography>
    </Container>
  );

  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 4 }}>
          <MuiLink component={Link} to="/" color="text.secondary" sx={{ textDecoration: 'none', fontSize: '0.85rem', '&:hover': { color: 'primary.main' } }}>
            Home
          </MuiLink>
          <MuiLink component={Link} to="/shop" color="text.secondary" sx={{ textDecoration: 'none', fontSize: '0.85rem', '&:hover': { color: 'primary.main' } }}>
            Shop
          </MuiLink>
          <Typography color="text.primary" sx={{ fontSize: '0.85rem' }}>
            {product.name}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ 
          bgcolor: 'white', 
          borderRadius: '32px', 
          p: { xs: 4, md: 8 }, 
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 12px 60px rgba(0,0,0,0.03)',
          mb: 8
        }}>
          <Grid container spacing={{ xs: 6, md: 10 }}>
            {/* Product Image */}
            <Grid size={{ xs: 12, md: 6 }}>
              <MotionBox
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Box
                  sx={{
                    bgcolor: '#f5f4f0',
                    aspectRatio: '4/5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.02)'
                  }}
                >
                  {product.stockStatus === 'Out of Stock' && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 24,
                        left: 24,
                        bgcolor: 'text.primary',
                        color: 'white',
                        px: 2,
                        py: 0.7,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        borderRadius: '6px',
                        zIndex: 10,
                      }}
                    >
                      Sold Out
                    </Box>
                  )}
                  {product.image ? (
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.name}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Typography
                      sx={{
                        fontSize: '5rem',
                        color: 'rgba(0,0,0,0.08)',
                      }}
                    >
                      VB
                    </Typography>
                  )}
                </Box>
              </MotionBox>
            </Grid>

            {/* Product Info */}
            <Grid size={{ xs: 12, md: 6 }}>
              <MotionBox
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip
                    label={product.category}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(45,75,56,0.06)',
                      color: 'primary.main',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontSize: '0.65rem',
                    }}
                  />
                  {product.subcategory && (
                    <Chip
                      label={product.subcategory}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: 'rgba(184,149,106,0.3)',
                        color: '#B8956A',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        textTransform: 'capitalize',
                        fontSize: '0.65rem',
                      }}
                    />
                  )}
                </Stack>

                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '2.5rem', md: '3.2rem' },
                    mb: 3,
                    color: 'text.primary'
                  }}
                >
                  {product.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  <Rating value={product.rating} readOnly precision={0.5} size="small" />
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    {product.numReviews} Trusted Reviews
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 4 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 700,
                      fontSize: '2rem',
                      color: 'primary.main',
                    }}
                  >
                    ${product.price?.toFixed(2)}
                  </Typography>
                  {product.oldPrice > product.price && (
                    <Typography
                      sx={{
                        fontSize: '1.4rem',
                        color: 'text.secondary',
                        textDecoration: 'line-through',
                        opacity: 0.5,
                        fontWeight: 500
                      }}
                    >
                      ${product.oldPrice.toFixed(2)}
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ mb: 4 }} />

                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.8,
                    mb: 5,
                    fontSize: '1.1rem'
                  }}
                >
                  {product.description}
                </Typography>

                {/* Stock status */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      width: 10, 
                      height: 10, 
                      borderRadius: '50%', 
                      bgcolor: product.stockStatus === 'In Stock' ? 'primary.main' : 'error.main' 
                    }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {product.stockStatus === 'In Stock' ? 'Currently In Stock' : 'Temporarily Unavailable'}
                    </Typography>
                  </Box>
                </Box>

                {/* Quantity and Actions */}
                {product.stockStatus === 'In Stock' && (
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={{ xs: 2, sm: 3 }} 
                    sx={{ mb: 6, alignItems: { xs: 'stretch', sm: 'center' } }}
                  >
                    {!isInCart && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          bgcolor: '#f8f7f4',
                          borderRadius: '16px',
                          border: '1px solid rgba(0,0,0,0.05)',
                          p: 0.5,
                          width: { xs: '100%', sm: 'auto' }
                        }}
                      >
                        <IconButton onClick={() => setQuantity(Math.max(1, quantity - 1))} sx={{ p: { xs: 1, sm: 1.5 } }}>
                          <Remove />
                        </IconButton>
                        <Typography sx={{ fontWeight: 700, minWidth: 40, textAlign: 'center', fontSize: { xs: '1.1rem', sm: '1.2rem' } }}>
                          {quantity}
                        </Typography>
                        <IconButton onClick={() => setQuantity(quantity + 1)} sx={{ p: { xs: 1, sm: 1.5 } }}>
                          <Add />
                        </IconButton>
                      </Box>
                    )}
                    
                    <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleAddToCart}
                        disabled={isInCart}
                        startIcon={isInCart ? null : <ShoppingBag />}
                        sx={{
                          flex: 1,
                          height: { xs: 56, sm: 64 },
                          borderRadius: '16px',
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          fontWeight: 700,
                          boxShadow: isInCart ? 'none' : '0 10px 30px rgba(45,75,56,0.15)',
                          whiteSpace: 'nowrap',
                          bgcolor: isInCart ? 'rgba(0,0,0,0.05)' : 'primary.main',
                          color: isInCart ? 'text.secondary' : 'white',
                          border: isInCart ? '1px solid rgba(0,0,0,0.1)' : 'none',
                          '&:hover': { bgcolor: isInCart ? 'rgba(0,0,0,0.05)' : 'primary.dark' }
                        }}
                      >
                        {isInCart ? 'In Cart' : 'Add to Cart'}
                      </Button>

                      <IconButton
                        onClick={handleToggleWishlist}
                        sx={{
                          border: '2px solid',
                          borderColor: 'rgba(0,0,0,0.05)',
                          borderRadius: '16px',
                          width: { xs: 56, sm: 64 },
                          height: { xs: 56, sm: 64 },
                          color: isWishlisted ? 'error.main' : 'text.primary',
                          bgcolor: 'white',
                          '&:hover': { bgcolor: '#f8f7f4' }
                        }}
                      >
                        {isWishlisted ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                    </Stack>
                  </Stack>
                )}
              </MotionBox>
            </Grid>
          </Grid>
        </Box>

        {/* Reviews Section - Boxed Container */}
        <Box sx={{ 
          mt: { xs: 10, md: 16 }, 
          bgcolor: 'rgba(244, 242, 238, 0.4)', 
          borderRadius: { xs: '32px', md: '40px' }, 
          p: { xs: 1, md: 8 },
          border: '1px solid rgba(0,0,0,0.04)'
        }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 600,
              mb: 8,
              textAlign: 'center',
              fontSize: { xs: '1.8rem', md: '3rem' }
            }}
          >
            Customer Reviews ({product.numReviews})
          </Typography>

          {/* Submit Review - Glassmorphic Box */}
          {isAuthenticated && (
            <Box
              sx={{
                maxWidth: 1000, // Significantly wider
                mx: 'auto',
                mb: 10,
                p: { xs: 3, md: 6 }, // More efficient spacing
                bgcolor: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(12px)',
                borderRadius: '24px',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.03)'
              }}
            >
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                Share Your Ritual
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>How was your experience?</Typography>
                <Rating
                  value={reviewRating}
                  onChange={(_, value) => setReviewRating(value)}
                  size="large"
                />
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="We value your feedback on our botanical formulations..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                sx={{ mb: 3 }}
              />
              <Button
                variant="contained"
                onClick={handleSubmitReview}
                disabled={submittingReview}
                size="large"
                fullWidth
                sx={{
                  height: 56,
                  borderRadius: '12px'
                }}
              >
                {submittingReview ? 'Publishing...' : 'Publish Review'}
              </Button>
            </Box>
          )}

          {/* Review list */}
          <Box sx={{ maxWidth: 1150, mx: 'auto' }}>
            {product.reviews?.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Be the first to share your experience.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {product.reviews?.map((review: any, index: number) => (
                  <Box 
                    key={review._id || index} 
                    sx={{ 
                      p: { xs: 2, md: 4 }, // Minimized padding for maximum width
                      bgcolor: 'white',
                      borderRadius: '20px',
                      border: '1px solid rgba(0,0,0,0.06)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                    }}
                  >
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between', 
                        alignItems: { xs: 'flex-start', sm: 'flex-start' }, 
                        gap: 1.5,
                        mb: 2 
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                          {review.name}
                        </Typography>
                        <Rating value={review.rating} readOnly size="small" sx={{ mt: 0.5 }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, fontSize: '0.95rem' }}>
                      {review.comment}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
