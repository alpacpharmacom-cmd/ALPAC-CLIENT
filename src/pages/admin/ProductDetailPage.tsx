import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box, Typography, Grid, Chip, Divider, Button, Rating,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton, LinearProgress
} from '@mui/material';
import { Avatar, Stack } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowBack, Edit, Delete } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { productsAPI } from '../../api/products.api';

/**
 * Premium Admin Product Detail Page
 * Standardized with ALPAC Eco-Luxury Design System
 */
export default function AdminProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productDeleteDialogOpen, setProductDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(false);

  // Fetch product data on mount
  const fetchProduct = async () => {
    try {
      if (!id) return;
      const { data: res } = await productsAPI.getAdminById(id);
      setProduct(res.data);
    } catch {
      toast.error('Product synchronization failed');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id, navigate]);

  // Command: Delete Entire Product
  const handleDeleteProduct = async () => {
    if (!id) return;
    setDeletingProduct(true);
    try {
      await productsAPI.delete(id);
      toast.success('Product archived successfully');
      navigate('/admin/products');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Archival failed');
    } finally {
      setDeletingProduct(false);
    }
  };

  // Command: Delete Specific Review
  const handleDeleteReview = async () => {
    if (!reviewToDelete || !id) return;
    setDeleting(true);
    try {
      await productsAPI.deleteReview(id, reviewToDelete);
      toast.success('Customer sentiment removed');
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
      fetchProduct();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Purge failed');
    } finally {
      setDeleting(false);
    }
  };

  if (!product) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Box sx={{ position: 'relative' }}>
          {loading && (
            <LinearProgress 
              sx={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                right: 0, 
                zIndex: 2000,
                height: 3,
                bgcolor: 'rgba(45, 75, 56, 0.1)',
                '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' }
              }} 
            />
          )}
      {/* Navigation & Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 5, flexWrap: 'wrap', gap: 2 }}>
        <Button 
          onClick={() => navigate('/admin/products')} 
          startIcon={<ArrowBack />} 
          sx={{ color: 'text.secondary', fontWeight: 700, '&:hover': { bgcolor: 'transparent', color: 'primary.main' } }}
        >
          Return to Inventory
        </Button>
        <Stack direction="row" spacing={2.5}>
          <Button
            component={Link}
            to={`/admin/products/${product._id}/edit`}
            startIcon={<Edit />}
            variant="contained"
            sx={{ 
                bgcolor: 'primary.main', 
                borderRadius: '12px', 
                fontWeight: 800, 
                px: 4,
                py: 1.2,
                boxShadow: '0 4px 20px rgba(45, 75, 56, 0.2)',
                '&:hover': { bgcolor: 'primary.dark' } 
            }}
          >
            Edit
          </Button>
          <Button
            onClick={() => setProductDeleteDialogOpen(true)}
            startIcon={<Delete />}
            variant="outlined"
            sx={{ 
                color: '#aa392b', 
                borderColor: 'rgba(170, 57, 43, 0.2)', 
                borderRadius: '12px', 
                fontWeight: 800,
                px: 3,
                '&:hover': { bgcolor: 'rgba(170, 57, 43, 0.04)', borderColor: '#aa392b' } 
            }}
          >
            Delete
          </Button>
        </Stack>
      </Box>

      {/* Product Primary Data Frame */}
      <Box sx={{ bgcolor: 'white', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '24px', p: { xs: 3, md: 5 }, boxShadow: '0 10px 40px rgba(0,0,0,0.03)', mb: 5 }}>
        <Grid container spacing={6}>
          {/* Visual Canvas */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                width: '100%',
                aspectRatio: '1/1.25',
                bgcolor: '#f9f9f9',
                borderRadius: '24px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              {product.image ? (
                <Box component="img" src={product.image} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Typography variant="overline" color="text.secondary">No Image Assets</Typography>
              )}
            </Box>
          </Grid>

          {/* Descriptive Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
                <Chip 
                  label={product.category} 
                  sx={{ 
                    borderRadius: '8px', 
                    bgcolor: 'rgba(45,75,56,0.08)', 
                    color: 'primary.main', 
                    fontWeight: 800, 
                    fontSize: '0.65rem', 
                    letterSpacing: '0.05em',
                    height: 24,
                    textTransform: 'uppercase'
                  }} 
                />
                <Chip 
                  label={product.subcategory} 
                  variant="outlined" 
                  sx={{ 
                    borderRadius: '8px', 
                    borderColor: 'rgba(184,149,106,0.3)', 
                    color: '#B8956A', 
                    fontWeight: 800, 
                    fontSize: '0.65rem', 
                    letterSpacing: '0.05em',
                    height: 24,
                    textTransform: 'uppercase'
                  }} 
                />
              </Stack>
              
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 900, 
                  mb: 1.5, 
                  fontFamily: '"Playfair Display", serif', 
                  color: '#1a1a1a',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em'
                }}
              >
                {product.name}
              </Typography>
              
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 4 }}>
                <Rating value={product.rating} readOnly precision={0.5} size="small" />
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.02em' }}>
                  ({product.numReviews} Global Reviews)
                </Typography>
              </Stack>

              <Box sx={{ mb: 5 }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 900, 
                    color: 'primary.main', 
                    display: 'flex', 
                    alignItems: 'baseline',
                    gap: 0.5
                  }}
                >
                  <Box component="span" sx={{ fontSize: '0.5em', fontWeight: 700, color: 'text.secondary', mb: 0.5 }}>$</Box>
                  {product.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>

              <Divider sx={{ mb: 5, borderStyle: 'dashed', opacity: 0.6 }} />

              <Box sx={{ mb: 6 }}>
                <Typography 
                  variant="overline" 
                  sx={{ 
                    fontWeight: 900, 
                    color: 'primary.main', 
                    display: 'block', 
                    mb: 1.5, 
                    letterSpacing: '0.2em',
                    fontSize: '0.7rem'
                  }}
                >
                  Architectural Narrative
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary', 
                    lineHeight: 2, 
                    fontSize: '1.05rem',
                    fontWeight: 500,
                    maxWidth: '850px'
                  }}
                >
                  {product.description}
                </Typography>
              </Box>

              <Box sx={{ mt: 'auto', pt: 4, borderTop: '1px solid', borderColor: 'rgba(0,0,0,0.04)' }}>
                <Grid container spacing={4}>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ p: 2.5, borderRadius: '16px', bgcolor: 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.03)' }}>
                      <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1, letterSpacing: '0.1em' }}>
                        Inventory Metrics
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: '#111' }}>
                         {product.countInStock} <Box component="span" sx={{ fontSize: '0.55em', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Units in Vault</Box>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ p: 2.5, borderRadius: '16px', bgcolor: 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.03)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1, letterSpacing: '0.1em' }}>
                        Supply Status
                      </Typography>
                      <Chip
                        label={product.countInStock > 0 ? (product.countInStock < 5 ? 'LOW QUANTITY' : 'ACTIVE INVENTORY') : 'ARCHIVED / OUT OF STOCK'}
                        sx={{
                          height: 32,
                          width: '100%',
                          maxWidth: 220,
                          bgcolor: product.countInStock > 0 ? (product.countInStock < 5 ? '#f4cc3c' : '#2D4B38') : '#aa392b',
                          color: 'white',
                          fontWeight: 900,
                          fontSize: '0.65rem',
                          borderRadius: '8px',
                          letterSpacing: '0.05em'
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Customer Sentiment Evidence */}
      <Box sx={{ bgcolor: 'white', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '24px', p: 5, boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
        <Typography variant="h5" sx={{ mb: 5, fontWeight: 800, fontFamily: '"Playfair Display", serif' }}>Customer Reviews</Typography>
        {product.reviews && product.reviews.length > 0 ? (
          <Stack spacing={4}>
            {product.reviews.map((review: any, index: number) => {
                const initial = review.name ? review.name.charAt(0).toUpperCase() : 'U';
                return (
                  <Box key={review._id || index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', gap: 3 }}>
                        <Avatar sx={{ width: 48, height: 48, bgcolor: 'rgba(45,75,56,0.1)', color: 'primary.main', fontWeight: 800 }}>
                          {initial}
                        </Avatar>
                        <Box>
                          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{review.name}</Typography>
                            <Rating value={review.rating} readOnly size="small" />
                          </Stack>
                          <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary', fontWeight: 700 }}>
                            {new Date(review.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, maxWidth: 600 }}>{review.comment}</Typography>
                        </Box>
                      </Box>
                      <IconButton 
                        onClick={() => { setReviewToDelete(review._id); setDeleteDialogOpen(true); }} 
                        sx={{ color: '#aa392b', '&:hover': { bgcolor: 'rgba(170,57,43,0.05)' } }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                    {index < product.reviews.length - 1 && <Divider sx={{ mt: 4 }} />}
                  </Box>
                );
            })}
          </Stack>
        ) : (
          <Box sx={{ py: 6, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.02)', borderRadius: '16px' }}>
            <Typography sx={{ color: 'text.secondary', fontWeight: 700 }}>No social proof recorded.</Typography>
          </Box>
        )}
      </Box>

      {/* Safe Interaction Overlays */}
      <Dialog 
        open={productDeleteDialogOpen} 
        onClose={() => setProductDeleteDialogOpen(false)} 
        slotProps={{ paper: { sx: { borderRadius: '24px', p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 900 }}>Archive Product?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: 700 }}>Permanent removal will purge {product.name} from the repository.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setProductDeleteDialogOpen(false)} sx={{ fontWeight: 700, color: 'text.secondary' }}>Cancel</Button>
          <Button onClick={handleDeleteProduct} disabled={deletingProduct} variant="contained" sx={{ bgcolor: '#aa392b', color: 'white', fontWeight: 900, borderRadius: '12px', px: 3 }}>
            {deletingProduct ? 'Archiving...' : 'Confirm Purge'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)} 
        slotProps={{ paper: { sx: { borderRadius: '24px', p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 900 }}>Remove Sentiment?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: 700 }}>Are you sure you want to remove this verified customer review?</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ fontWeight: 700, color: 'text.secondary' }}>Discard</Button>
          <Button onClick={handleDeleteReview} disabled={deleting} variant="contained" sx={{ bgcolor: '#aa392b', color: 'white', fontWeight: 900, borderRadius: '12px', px: 3 }}>
            {deleting ? 'Purging...' : 'Yes, Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </motion.div>
    </AnimatePresence>
  );
}
