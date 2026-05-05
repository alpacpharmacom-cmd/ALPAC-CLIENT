import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, Button, Rating, Divider,
  TextField, Breadcrumbs, Chip, IconButton, Link as MuiLink, Stack, CircularProgress,
  Accordion, AccordionSummary, AccordionDetails, LinearProgress
} from '@mui/material';
import { 
  Add, Remove, ShoppingCart, FavoriteBorder, Favorite, 
  ExpandMore, LocalShipping, VerifiedUser, Yard, AssignmentReturn,
  Star
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { productsAPI } from '../../api/products.api';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useProductStore } from '../../stores/productStore';
import DetailSkeleton from '../../components/skeletons/DetailSkeleton';
import ProductCard from '../../components/store/ProductCard';
import AmbientBackground from '../../components/common/AmbientBackground';

const MotionBox = motion.create(Box);

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
  const { fetchAllProducts } = useProductStore();
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  
  const isWishlisted = product ? wishlistItems.some((item) => item._id === product._id) : false;

  const fetchProduct = async (force = false) => {
    try {
      setLoading(!force);
      const data = await fetchProductById(id!, force);
      setProduct(data);
      return data;
    } catch {
      toast.error('Product not found');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        const data = await fetchProduct(false);
        if (data) {
          await fetchAllProducts();
          const related = useProductStore.getState().allProducts
            .filter((p: any) => p.category === data.category && p._id !== data._id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      }
    };
    loadData();
  }, [id]);

  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    if (isInCart) {
      navigate('/cart');
      return;
    }

    setAddingToCart(true);
    try {
      console.log('Adding to cart:', { productId: product._id, quantity });
      await addToCart(product._id, quantity);
      toast.success('Added to cart!');
    } catch (error: any) {
      console.error('Add to Cart Error:', error);
      const message = error.response?.data?.message || error.message || 'Failed to add to cart';
      toast.error(message);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async (e?: React.MouseEvent, productId?: string) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!isAuthenticated) {
      toast.error('Please login to use wishlist');
      return;
    }
    const targetId = productId || product._id;
    const isTargetWishlisted = wishlistItems.some((item) => item._id === targetId);
    
    try {
      await toggleWishlistProduct(targetId);
      if (isTargetWishlisted) {
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
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 5 } }}>
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
          bgcolor: 'rgba(255, 255, 255, 0.7)', 
          backdropFilter: 'blur(20px)',
          borderRadius: '40px', 
          p: { xs: 2, md: 8 }, 
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 20px 80px rgba(0,0,0,0.04)',
          mb: { xs: 4, md: 8 },
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Subtle Accent Gradient */}
          <Box sx={{ 
            position: 'absolute', 
            top: -200, 
            right: -200, 
            width: 400, 
            height: 400, 
            borderRadius: '50%', 
            bgcolor: 'rgba(45,75,56,0.03)',
            filter: 'blur(60px)',
            zIndex: 0
          }} />
          <Grid container spacing={{ xs: 3, md: 10 }} sx={{ position: 'relative', zIndex: 1 }}>
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
                    fontSize: { xs: '2rem', md: '3.2rem' },
                    mb: { xs: 1.5, md: 3 },
                    color: 'text.primary'
                  }}
                >
                  {product.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: { xs: 2, md: 4 } }}>
                  <Rating value={product.rating} readOnly precision={0.5} size="small" />
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    {product.numReviews} Trusted Reviews
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: { xs: 2, md: 4 } }}>
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
                    mb: { xs: 2.5, md: 5 },
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
                    sx={{ mb: { xs: 3, md: 6 }, alignItems: { xs: 'stretch', sm: 'center' } }}
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
                        disabled={addingToCart}
                        onClick={handleAddToCart}
                        startIcon={addingToCart || isInCart ? null : <ShoppingCart />}
                        sx={{
                          flex: 1,
                          height: { xs: 56, sm: 64 },
                          borderRadius: '16px',
                          fontSize: { xs: '0.9rem', sm: '1.05rem' },
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          boxShadow: isInCart ? 'none' : '0 10px 30px rgba(45,75,56,0.15)',
                          whiteSpace: 'nowrap',
                          bgcolor: isInCart ? 'rgba(45,75,56,0.1)' : 'primary.main',
                          color: isInCart ? 'primary.main' : 'white',
                          border: isInCart ? '1px solid rgba(45,75,56,0.2)' : 'none',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': { 
                            bgcolor: isInCart ? 'rgba(45,75,56,0.15)' : 'primary.dark',
                            boxShadow: isInCart ? 'none' : '0 15px 40px rgba(45,75,56,0.25)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        {addingToCart ? <CircularProgress size={24} color="inherit" /> : (isInCart ? 'View in Cart' : 'Add to Cart')}
                      </Button>

                      <IconButton
                        onClick={(e) => handleToggleWishlist(e)}
                        sx={{
                          border: '2px solid',
                          borderColor: 'rgba(0,0,0,0.05)',
                          borderRadius: '16px',
                          width: { xs: 56, sm: 64 },
                          height: { xs: 56, sm: 64 },
                          color: isWishlisted ? 'error.main' : 'text.primary',
                          bgcolor: 'white',
                          transition: 'all 0.3s ease',
                          '&:hover': { 
                            bgcolor: isWishlisted ? 'rgba(211,47,47,0.04)' : '#f8f7f4',
                            transform: 'scale(1.05)',
                            borderColor: isWishlisted ? 'error.main' : 'rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        {isWishlisted ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                    </Stack>
                  </Stack>
                )}
                {/* Benefits Section */}
                <Grid container spacing={2} sx={{ mt: 2, mb: 4 }}>
                  {[
                    { icon: <LocalShipping sx={{ fontSize: 20 }} />, text: 'Free Delivery' },
                    { icon: <VerifiedUser sx={{ fontSize: 20 }} />, text: '2 Year Warranty' },
                    { icon: <Yard sx={{ fontSize: 20 }} />, text: 'Eco-Friendly' },
                    { icon: <AssignmentReturn sx={{ fontSize: 20 }} />, text: '30-Day Returns' },
                  ].map((benefit, idx) => (
                    <Grid size={{ xs: 6, sm: 3 }} key={idx}>
                      <Stack direction="column" spacing={1} sx={{ alignItems: 'center', textAlign: 'center' }}>
                        <Box sx={{ 
                          p: 1.5, 
                          borderRadius: '12px', 
                          bgcolor: 'rgba(45,75,56,0.05)', 
                          color: 'primary.main',
                          display: 'flex'
                        }}>
                          {benefit.icon}
                        </Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {benefit.text}
                        </Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>

                {/* Product Details Accordion */}
                <Box sx={{ mt: 4 }}>
                  {[
                    { title: 'Product Details', content: product.description },
                    { title: 'Sustainability', content: 'Our commitment to the environment means using 100% recyclable packaging and ethically sourced ingredients.' },
                    { title: 'Shipping & Returns', content: 'Free standard shipping on all orders over $100. Returns accepted within 30 days of purchase.' },
                  ].map((item, idx) => (
                    <Accordion 
                      key={idx}
                      elevation={0}
                      sx={{ 
                        bgcolor: 'transparent',
                        '&:before': { display: 'none' },
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                        '&.Mui-expanded': { mb: 0 }
                      }}
                    >
                      <AccordionSummary 
                        expandIcon={<ExpandMore />}
                        sx={{ px: 0, py: 1 }}
                      >
                        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.title}</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ px: 0, pb: 2 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                          {item.content}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </MotionBox>
            </Grid>
          </Grid>
        </Box>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <Box sx={{ mb: { xs: 8, md: 16 } }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-end', mb: 6 }}>
              <Box>
                <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.2em' }}>
                  Complete the set
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 600, mt: 1 }}>Related Products</Typography>
              </Box>
              <Button 
                component={Link} 
                to="/shop" 
                color="primary" 
                sx={{ fontWeight: 700, textTransform: 'none' }}
              >
                View All Collection
              </Button>
            </Stack>
            <Grid container spacing={3}>
              {relatedProducts.map((p, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={p._id}>
                  <ProductCard 
                    product={p} 
                    index={index}
                    isWishlisted={wishlistItems.some(item => item._id === p._id)}
                    handleToggleWishlist={(e) => handleToggleWishlist(e, p._id)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Reviews Section - Boxed Container */}
        <Box sx={{ 
          mt: { xs: 6, md: 16 }, 
          bgcolor: 'rgba(244, 242, 238, 0.4)', 
          borderRadius: { xs: '32px', md: '40px' }, 
          p: { xs: 2, md: 8 },
          border: '1px solid rgba(0,0,0,0.04)'
        }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 600,
              mb: 6,
              textAlign: 'center',
              fontSize: { xs: '1.8rem', md: '3rem' }
            }}
          >
            Customer Reviews
          </Typography>

          {/* Rating Summary */}
          <Box sx={{ maxWidth: 900, mx: 'auto', mb: 10 }}>
            <Grid container spacing={6} sx={{ alignItems: 'center' }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center', p: 4, bgcolor: 'white', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <Typography variant="h1" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                    {product.rating?.toFixed(1) || '0.0'}
                  </Typography>
                  <Rating value={product.rating} readOnly precision={0.5} sx={{ mb: 1 }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Based on {product.numReviews} reviews
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={1.5}>
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = product.reviews?.filter((r: any) => Math.round(r.rating) === star).length || 0;
                    const percent = product.numReviews > 0 ? (count / product.numReviews) * 100 : 0;
                    return (
                      <Stack key={star} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ minWidth: 60, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {star} <Star sx={{ fontSize: 16, color: '#faaf00' }} />
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={percent} 
                          sx={{ 
                            flex: 1, 
                            height: 8, 
                            borderRadius: 4, 
                            bgcolor: 'rgba(0,0,0,0.04)',
                            '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: 'primary.main' }
                          }} 
                        />
                        <Typography variant="body2" sx={{ minWidth: 40, color: 'text.secondary', fontWeight: 600, textAlign: 'right' }}>
                          {count}
                        </Typography>
                      </Stack>
                    );
                  })}
                </Stack>
              </Grid>
            </Grid>
          </Box>

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
                      p: { xs: 1.5, md: 4 }, // Minimized padding for maximum width
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
      <AmbientBackground />
    </Box>
  );
}
