import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Grid, MenuItem, LinearProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowBack, Save, CloudUpload } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { productsAPI } from '../../api/products.api';
import { useAdminStore } from '../../stores/adminStore';

const subcategoryMap: Record<string, { value: string; label: string }[]> = {
  cosmetics: [
    { value: 'skin care', label: 'Skin Care' },
    { value: 'hair care', label: 'Hair Care' },
    { value: 'intimate', label: 'Intimate' },
    { value: 'kids care', label: 'Kids Care' },
    { value: 'oral care', label: 'Oral Care' },
    { value: 'muscles & joints', label: 'Muscles & Joints' },
    { value: 'antiseptics', label: 'Antiseptics' },
    { value: 'anti scar', label: 'Anti Scar' },
  ],
  nutrients: [
    { value: 'vitamins', label: 'Vitamins' },
    { value: 'supplements', label: 'Supplements' },
    { value: 'wellness', label: 'Wellness' },
  ],
};

export default function ProductFormPage() {
  const { invalidateProducts } = useAdminStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    price: '',
    oldPrice: '',
    discountPercentage: '',
    description: '',
    image: '',
    category: '',
    subcategory: '',
    countInStock: '',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const { data: res } = await productsAPI.getAdminById(id!);
          const product = res.data;
          
          let discount = product.discountPercentage?.toString() || '';
          if (!discount && product.oldPrice && product.price) {
             discount = (((product.oldPrice - product.price) / product.oldPrice) * 100).toFixed(2);
          }

          setForm({
            name: product.name || '',
            price: product.price?.toString() || '',
            oldPrice: product.oldPrice?.toString() || '',
            discountPercentage: discount,
            description: product.description || '',
            image: product.image || '',
            category: product.category || '',
            subcategory: product.subcategory || '',
            countInStock: product.countInStock?.toString() || '',
          });
        } catch {
          toast.error('Product not found');
          navigate('/admin/products');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (field: string, value: string) => {
    if (field === 'category') {
      setForm({ ...form, category: value, subcategory: '' });
      return;
    }

    const newForm = { ...form, [field]: value };

    // Automatic price/discount calculation
    if (field === 'oldPrice' || field === 'discountPercentage') {
      const oldPriceRaw = field === 'oldPrice' ? value : form.oldPrice;
      const discountRaw = field === 'discountPercentage' ? value : form.discountPercentage;
      
      const oldPrice = parseFloat(oldPriceRaw);
      const discount = parseFloat(discountRaw) || 0;
      
      if (!isNaN(oldPrice)) {
        newForm.price = (oldPrice * (1 - discount / 100)).toFixed(2);
      }
    } else if (field === 'price') {
      const oldPrice = parseFloat(form.oldPrice);
      const price = parseFloat(value);
      
      if (!isNaN(oldPrice) && oldPrice > 0 && !isNaN(price)) {
        newForm.discountPercentage = (((oldPrice - price) / oldPrice) * 100).toFixed(0);
      }
    }

    setForm(newForm);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const { data: res } = await productsAPI.uploadImage(formData);
      setForm({ ...form, image: res.data.url });
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || form.price === '' || !form.description || !form.image || !form.category || !form.subcategory || form.countInStock === '') {
      toast.error('Please fill in all fields');
      return;
    }

    setSaving(true);
    try {
      const data = {
        name: form.name,
        price: Number(form.price),
        oldPrice: Number(form.oldPrice) || 0,
        discountPercentage: Number(form.discountPercentage) || 0,
        description: form.description,
        image: form.image,
        category: form.category,
        subcategory: form.subcategory,
        countInStock: Number(form.countInStock),
      };

      if (isEdit) {
        await productsAPI.update(id!, data);
        toast.success('Product updated!');
      } else {
        await productsAPI.create(data);
        toast.success('Product created!');
      }
      invalidateProducts();
      navigate('/admin/products');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };


  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Box sx={{ pb: 8, minHeight: '100vh', mt: -2, position: 'relative' }}>
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
      <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, mx: 'auto' }}>
        <Box>
          <Button
            onClick={() => navigate('/admin/products')}
            startIcon={<ArrowBack />}
            sx={{ mb: 1, color: 'text.secondary', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: 'transparent', color: 'primary.main' } }}
          >
            Inventory Management
          </Button>
          <Typography 
            variant="h3" 
            sx={{ 
                fontWeight: 800, 
                fontFamily: '"Playfair Display", serif',
                letterSpacing: '-0.01em',
                color: 'text.primary'
            }}
          >
            {isEdit ? 'Refine Product' : 'Curate New Product'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            onClick={() => navigate('/admin/products')}
            variant="outlined"
            sx={{ px: 4, py: 1, borderColor: 'rgba(0,0,0,0.1)', color: 'text.secondary', borderRadius: '12px', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em' }}
          >
            Discard
          </Button>
          <Button
            onClick={(e) => handleSubmit(e as any)}
            variant="contained"
            disabled={saving}
            startIcon={<Save />}
            sx={{ 
              bgcolor: 'primary.main', 
              px: 4,
              py: 1.2,
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(45, 75, 56, 0.2)',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            {saving ? 'Preserving...' : 'Save Product'}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box
            sx={{
              bgcolor: 'white',
              p: 5,
              borderRadius: '24px',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
              minHeight: 600,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, color: 'text.primary' }}>
              Primary Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Product Name"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fbfaf8' },
                    '& .MuiInputLabel-root': { 
                      fontSize: '0.85rem', 
                      fontWeight: 600,
                      '&.MuiInputLabel-shrink': { transform: 'translate(14px, -11px) scale(0.85)', bgcolor: 'white', px: 0.5 }
                    }
                  }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Original Price"
                  type="number"
                  value={form.oldPrice}
                  onChange={(e) => handleChange('oldPrice', e.target.value)}
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fbfaf8' },
                    '& .MuiInputLabel-root': { 
                      fontSize: '0.85rem', 
                      fontWeight: 600,
                      '&.MuiInputLabel-shrink': { transform: 'translate(14px, -11px) scale(0.85)', bgcolor: 'white', px: 0.5 }
                    }
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Discount %"
                  type="number"
                  value={form.discountPercentage}
                  onChange={(e) => handleChange('discountPercentage', e.target.value)}
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fbfaf8' },
                    '& .MuiInputLabel-root': { 
                      fontSize: '0.85rem', 
                      fontWeight: 600,
                      '&.MuiInputLabel-shrink': { transform: 'translate(14px, -11px) scale(0.85)', bgcolor: 'white', px: 0.5 }
                    }
                  }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Final Selling Price"
                  type="number"
                  value={form.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  required
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fbfaf8' },
                    '& .MuiInputLabel-root': { 
                      fontSize: '0.85rem', 
                      fontWeight: 600,
                      '&.MuiInputLabel-shrink': { transform: 'translate(14px, -11px) scale(0.85)', bgcolor: 'white', px: 0.5 }
                    }
                  }}
                />
              </Grid>
              
              <Grid size={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Inventory Allocation"
                  type="number"
                  value={form.countInStock}
                  onChange={(e) => handleChange('countInStock', e.target.value)}
                  required
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fbfaf8' },
                    '& .MuiInputLabel-root': { 
                      fontSize: '0.85rem', 
                      fontWeight: 600,
                      '&.MuiInputLabel-shrink': { transform: 'translate(14px, -11px) scale(0.85)', bgcolor: 'white', px: 0.5 }
                    }
                  }}
                />
              </Grid>

              <Grid size={6}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Category"
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  required
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fbfaf8' },
                    '& .MuiInputLabel-root': { 
                      fontSize: '0.85rem', 
                      fontWeight: 600,
                      '&.MuiInputLabel-shrink': { transform: 'translate(14px, -11px) scale(0.85)', bgcolor: 'white', px: 0.5 }
                    }
                  }}
                >
                  <MenuItem value="cosmetics">Cosmetics</MenuItem>
                  <MenuItem value="nutrients">Nutrients</MenuItem>
                </TextField>
              </Grid>

              <Grid size={6}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Subcategory"
                  value={form.subcategory}
                  onChange={(e) => handleChange('subcategory', e.target.value)}
                  required
                  variant="outlined"
                  disabled={!form.category}
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fbfaf8' },
                    '& .MuiInputLabel-root': { 
                      fontSize: '0.85rem', 
                      fontWeight: 600,
                      '&.MuiInputLabel-shrink': { transform: 'translate(14px, -11px) scale(0.85)', bgcolor: 'white', px: 0.5 }
                    }
                  }}
                >
                  {form.category && subcategoryMap[form.category]?.map((sub) => (
                    <MenuItem key={sub.value} value={sub.value}>{sub.label}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Product Description"
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  required
                  multiline
                  rows={6}
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: '#fbfaf8' },
                    '& .MuiInputLabel-root': { 
                      fontSize: '0.85rem', 
                      fontWeight: 600,
                      '&.MuiInputLabel-shrink': { transform: 'translate(14px, -11px) scale(0.85)', bgcolor: 'white', px: 0.5 }
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Box
            sx={{
              bgcolor: 'white',
              p: 5,
              borderRadius: '24px',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
              position: 'sticky',
              top: 24
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, color: 'text.primary' }}>
              Imagery & Visuals
            </Typography>

            <Box 
              sx={{ 
                width: '100%', 
                aspectRatio: '1/1', 
                bgcolor: '#fbfaf8', 
                border: '1px solid rgba(0,0,0,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 4,
                overflow: 'hidden',
                borderRadius: '20px'
              }}
            >
              {form.image ? (
                <Box
                  component="img"
                  src={form.image}
                  alt="Preview"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e: any) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Preview Asset</Typography>
              )}
            </Box>

            <TextField
              fullWidth
              size="small"
              label="Image URL"
              value={form.image}
              onChange={(e) => handleChange('image', e.target.value)}
              required
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ 
                mb: 4,
                '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fbfaf8' },
                '& .MuiInputLabel-root': { 
                  fontSize: '0.85rem', 
                  fontWeight: 600,
                  '&.MuiInputLabel-shrink': { transform: 'translate(14px, -11px) scale(0.85)', bgcolor: 'white', px: 0.5 }
                }
              }}
            />

            <Button
              fullWidth
              variant="outlined"
              component="label"
              disabled={uploading}
              startIcon={<CloudUpload />}
              sx={{
                py: 1.5,
                borderRadius: '12px',
                borderColor: 'rgba(0,0,0,0.1)',
                color: 'text.primary',
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': { bgcolor: '#fbfaf8', borderColor: 'primary.main' }
              }}
            >
              {uploading ? 'Uploading...' : 'Upload New Image'}
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
    </motion.div>
    </AnimatePresence>
  );
}
