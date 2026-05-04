import { Link } from 'react-router-dom';
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
import { motion } from 'framer-motion';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import { useState } from 'react';

const MotionBox = motion.create(Box);

interface ProductCardProps {
  product: any;
  index: number;
  handleToggleWishlist: (e: React.MouseEvent, id: string) => void;
  isWishlisted: boolean;
  onAddToCart?: (id: string) => void;
  showAddToCart?: boolean;
}

export default function ProductCard({ 
  product, 
  index, 
  handleToggleWishlist, 
  isWishlisted,
  onAddToCart,
  showAddToCart = true
}: ProductCardProps) {
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

    setAddingToCart(true);
    try {
      await addToCart(product._id, 1);
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Card
        sx={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#f5f3ec',
          borderRadius: { xs: '20px', sm: '24px' },
          px: { xs: 0.8, sm: 2 },
          pt: { xs: 1, sm: 2 },
          pb: { xs: 1, sm: 1.5 },
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
          transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
          overflow: 'hidden',
          height: '100%',
          position: 'relative',
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.08)',
            borderColor: 'primary.main',
          },
          '&:hover .product-img': {
            transform: 'scale(1.1)',
          },
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
            borderRadius: { xs: '14px', sm: '18px' },
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
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
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
              bgcolor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(8px)',
              '&:hover': { bgcolor: 'white' },
              color: isWishlisted ? 'error.main' : 'text.primary',
              zIndex: 10,
              width: { xs: 28, sm: 38 },
              height: { xs: 28, sm: 38 },
            }}
          >
            {isWishlisted ? <Favorite sx={{ fontSize: { xs: 18, sm: 20 } }} /> : <FavoriteBorder sx={{ fontSize: { xs: 18, sm: 20 } }} />}
          </IconButton>
        </Box>

        <CardContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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
                transition: 'color 0.3s ease',
              }}
            >
              {product.name}
            </Typography>
            
            <Box sx={{ mt: 'auto', mb: 1.5 }}>
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
              disabled={product.stockStatus === 'Out of Stock' || addingToCart || isInCart}
              onClick={handleAddToCartInternal}
              startIcon={addingToCart || isInCart ? null : <ShoppingCart sx={{ fontSize: { xs: '0.75rem !important', sm: '0.9rem !important' } }} />}
              sx={{
                mt: 0.8,
                bgcolor: isInCart ? 'rgba(0,0,0,0.05)' : 'primary.main',
                color: isInCart ? 'text.secondary' : 'white',
                borderRadius: '10px',
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                fontWeight: 700,
                py: { xs: 0.8, sm: 1.2 },
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                '&:hover': { bgcolor: isInCart ? 'rgba(0,0,0,0.05)' : 'primary.dark' },
                '&:active': { transform: isInCart ? 'none' : 'scale(0.98)' },
                border: isInCart ? '1px solid rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {addingToCart ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                product.stockStatus === 'Out of Stock' ? 'Sold Out' : (isInCart ? 'In Cart' : 'Add to Cart')
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </MotionBox>
  );
}
