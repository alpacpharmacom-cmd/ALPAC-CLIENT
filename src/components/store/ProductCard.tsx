import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardMedia, 
  CardContent, 
  Rating, 
  IconButton,
  Button,
  CircularProgress
} from '@mui/material';
import { Favorite, FavoriteBorder, ShoppingCart } from '@mui/icons-material';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import { useState, memo } from 'react';

interface ProductCardProps {
  product: any;
  index: number;
  handleToggleWishlist: (e: React.MouseEvent, id: string) => void;
  isWishlisted: boolean;
  onAddToCart?: (id: string) => void;
  showAddToCart?: boolean;
}

const ProductCard = memo(({ 
  product, 
  handleToggleWishlist, 
  isWishlisted,
  onAddToCart,
  showAddToCart = true
}: ProductCardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items: cartItems, addToCart } = useCartStore();
  const [addingToCart, setAddingToCart] = useState(false);

  const isInCart = cartItems.some(item => item.product._id === product._id);

  const handleAddToCartInternal = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onAddToCart) {
      onAddToCart(product._id);
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      return;
    }

    if (isInCart) {
      navigate('/cart');
      return;
    }

    setAddingToCart(true);
    try {
      console.log('Adding to cart:', { productId: product._id, quantity: 1 });
      await addToCart(product._id, 1);
      toast.success('Added to cart!');
    } catch (error: any) {
      console.error('Add to Cart Error:', error);
      const message = error.response?.data?.message || error.message || 'Failed to add to cart';
      toast.error(message);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <Box>
      <Card
        sx={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#f5f3ec',
          borderRadius: { xs: '20px', sm: '24px' },
          px: 0,
          pt: { xs: 1, sm: 2 },
          pb: 0,
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          overflow: 'hidden',
          height: '100%',
          position: 'relative',
          '&:hover .product-name': {
            color: 'primary.main',
          },
        }}
      >
        <Box
          component={Link}
          to={`/products/${product._id}`}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            bgcolor: '#f8f7f4',
            aspectRatio: '0.85',
            borderRadius: { xs: '16px', sm: '20px' },
            mx: { xs: 1, sm: 2 },
            mb: { xs: 1, sm: 1.5 },
            display: 'block',
            textDecoration: 'none'
          }}
        >
          {/* Badge: Sale or Out of Stock */}
          {product.stockStatus === 'Out of Stock' ? (
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                bgcolor: 'rgba(17,17,17,0.9)',
                color: 'white',
                px: 1.5,
                py: 0.5,
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                zIndex: 5,
                borderRadius: '4px',
              }}
            >
              Sold Out
            </Box>
          ) : product.oldPrice > product.price && (
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                bgcolor: '#c0392b',
                color: 'white',
                px: 1.5,
                py: 0.5,
                fontSize: '0.65rem',
                fontWeight: 700,
                zIndex: 5,
                borderRadius: '4px',
              }}
            >
              SALE
            </Box>
          )}

          {product.image ? (
            <CardMedia
              component="img"
              image={product.image}
              alt={product.name}
              className="product-img"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h4" sx={{ color: 'rgba(0,0,0,0.1)', fontWeight: 300 }}>ALPAC</Typography>
            </Box>
          )}

          {/* Wishlist Button */}
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleToggleWishlist(e, product._id);
            }}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: 'rgba(255,255,255,0.95)',
              backdropFilter: { xs: 'none', sm: 'blur(8px)' },
              color: isWishlisted ? 'error.main' : 'text.primary',
              zIndex: 10,
              width: { xs: 32, sm: 38 },
              height: { xs: 32, sm: 38 },
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              '&:hover': {
                 color: 'error.main'
              }
            }}
          >
            {isWishlisted ? <Favorite sx={{ fontSize: { xs: 18, sm: 20 } }} /> : <FavoriteBorder sx={{ fontSize: { xs: 18, sm: 20 } }} />}
          </IconButton>
        </Box>

        <CardContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', px: { xs: 1, sm: 2 } }}>
          {/* Linkable Text Area */}
          <Box 
            component={Link} 
            to={`/products/${product._id}`} 
            sx={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flexGrow: 1 }}
          >
            <Typography
              sx={{
                color: 'secondary.main',
                letterSpacing: '0.15rem',
                textTransform: 'uppercase',
                fontWeight: 800,
                fontSize: { xs: '0.6rem', sm: '0.75rem' },
                mb: 0.5,
                opacity: 0.9,
              }}
            >
              {product.subcategory || product.category}
            </Typography>
            <Typography
              className="product-name"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '0.8rem', sm: '1.05rem' },
                mb: 0.5,
                lineHeight: 1.2,
                color: 'primary.dark',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: { xs: '1.92rem', sm: '2.5rem' },
              }}
            >
              {product.name}
            </Typography>
            
            <Box sx={{ mt: 1.5, mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.4, sm: 0.8 }, mb: 0.5 }}>
                <Rating
                  value={product.rating}
                  readOnly
                  size="small"
                  precision={0.5}
                  sx={{ color: '#4a6741', fontSize: { xs: '0.65rem', sm: '0.9rem' } }}
                />
                <Typography sx={{ color: 'text.secondary', fontSize: '0.6rem', fontWeight: 600 }}>
                  ({product.numReviews})
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
                <Typography
                  sx={{ fontWeight: 800, color: 'primary.main', fontSize: { xs: '0.95rem', sm: '1.25rem' } }}
                >
                  ${product.price?.toFixed(2)}
                </Typography>
                {product.oldPrice > product.price && (
                  <Typography
                    sx={{ 
                      fontWeight: 500, 
                      color: 'text.secondary', 
                      fontSize: { xs: '0.75rem', sm: '0.95rem' },
                      textDecoration: 'line-through',
                      opacity: 0.6
                    }}
                  >
                    ${product.oldPrice.toFixed(2)}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          {showAddToCart && (
            <Button
              variant="contained"
              fullWidth
              size="small"
              disabled={product.stockStatus === 'Out of Stock' || addingToCart}
              onClick={handleAddToCartInternal}
              startIcon={addingToCart || isInCart ? null : <ShoppingCart sx={{ fontSize: { xs: '0.75rem !important', sm: '0.9rem !important' } }} />}
              sx={{
                mt: 'auto',
                mb: {xs: -2, sm: -1.5},
                bgcolor: isInCart ? 'rgba(45,75,56,0.1)' : 'primary.main',
                color: isInCart ? 'primary.main' : 'white',
                borderRadius: 0,
                borderBottomLeftRadius: { xs: '16px', sm: '20px' },
                borderBottomRightRadius: { xs: '16px', sm: '20px' },
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                fontWeight: 800,
                py: { xs: 1.2, sm: 1.6 },
                whiteSpace: 'nowrap',
                boxShadow: 'none',
                '&:hover': { 
                  bgcolor: isInCart ? 'rgba(45,75,56,0.15)' : 'primary.dark',
                  boxShadow: 'none',
                },
                '&.Mui-disabled': {
                  bgcolor: product.stockStatus === 'Out of Stock' ? 'rgba(0,0,0,0.1)' : (isInCart ? 'rgba(45,75,56,0.1)' : 'primary.main'),
                  color: product.stockStatus === 'Out of Stock' ? 'text.disabled' : (isInCart ? 'primary.main' : 'white'),
                  opacity: product.stockStatus === 'Out of Stock' ? 0.6 : 1,
                },
                borderTop: '1px solid rgba(0,0,0,0.03)',
                mx: 0,
                width: '100%',
              }}
            >
              {addingToCart ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                product.stockStatus === 'Out of Stock' ? 'Sold Out' : (isInCart ? 'View in Cart' : 'Add to Cart')
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;
