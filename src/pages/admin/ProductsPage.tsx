import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, InputAdornment, MenuItem, Tooltip,
} from '@mui/material';
import { Add, Edit, Delete, Search, FilterList, Sort, Download } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { productsAPI } from '../../api/products.api';
import TableSkeleton from '../../components/skeletons/TableSkeleton';
import { exportToCSV } from '../../utils/export';

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

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All'); // All, In Stock, Out of Stock, Low Stock
  const [subcategoryFilter, setSubcategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // newest, price-low, price-high

  const fetchProducts = async () => {
    try {
      const { data: res } = await productsAPI.getAdminAll();
      setProducts(res.data);
    } catch {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await productsAPI.delete(deleteId);
      setProducts(products.filter((p) => p._id !== deleteId));
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeleteId(null);
    }
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
      const matchesSubcategory = subcategoryFilter === 'All' || product.subcategory === subcategoryFilter;
      
      let matchesStock = true;
      if (stockFilter === 'In Stock') matchesStock = product.countInStock > 0;
      else if (stockFilter === 'Out of Stock') matchesStock = product.countInStock === 0;
      else if (stockFilter === 'Low Stock') matchesStock = product.countInStock > 0 && product.countInStock < 5;

      return matchesSearch && matchesCategory && matchesSubcategory && matchesStock;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

  const handleExport = () => {
    const exportData = filteredProducts.map(p => ({
      ID: p._id,
      Name: p.name,
      Category: p.category,
      Subcategory: p.subcategory,
      Price: p.price,
      Stock: p.countInStock,
      Status: p.countInStock === 0 ? 'Out of Stock' : p.countInStock < 5 ? 'Low Stock' : 'In Stock',
      Rating: p.rating,
      Reviews: p.numReviews,
      DateAdded: p.createdAt ? new Date(p.createdAt) : ''
    }));
    exportToCSV(exportData, 'Alpac_Products');
    toast.success('Products exported successfully');
  };


  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 500 }}>
            Products
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredProducts.length === products.length 
              ? `${products.length} products total` 
              : `Showing ${filteredProducts.length} of ${products.length} products`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Export current list to CSV">
             <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleExport}
                sx={{ bgcolor: '#4a90e2', '&:hover': { bgcolor: '#357abd' }, color: 'white', boxShadow: 'none' }}
             >
                Export
             </Button>
          </Tooltip>
          <Button
            component={Link}
            to="/admin/products/new"
            variant="contained"
            startIcon={<Add />}
            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            Add Product
          </Button>
        </Box>
      </Box>

      {/* Filter Bar */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 3, 
        flexWrap: 'wrap',
        p: 1.5,
        bgcolor: 'white',
        border: '1px solid rgba(0,0,0,0.06)',
        borderRadius: '24px',
        alignItems: 'center'
      }}>
        <TextField
          size="small"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            flex: 1, 
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              bgcolor: '#fbfaf8',
              height: 40,
              fontSize: '0.875rem',
              '& fieldset': { borderColor: 'rgba(0,0,0,0.06)' },
            }
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0.5 }}>
                  <Search sx={{ color: 'text.secondary', opacity: 0.7, fontSize: '1.1rem' }} />
                </InputAdornment>
              ),
            }
          }}
        />

        <TextField
          select
          size="small"
          label="Category"
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setSubcategoryFilter('All'); }}
          sx={{ 
            minWidth: 150,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              bgcolor: '#fbfaf8',
              height: 40,
              fontSize: '0.875rem',
              '& fieldset': { borderColor: 'rgba(0,0,0,0.06)' },
            },
            '& .MuiInputLabel-root': {
              fontSize: '0.8rem',
              fontWeight: 700,
              '&.MuiInputLabel-shrink': { transform: 'translate(14px, -10px) scale(0.85)', bgcolor: 'white', px: 0.5 }
            }
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0.5 }}>
                  <FilterList sx={{ color: 'text.secondary', opacity: 0.7, fontSize: '1.1rem' }} />
                </InputAdornment>
              ),
            },
            inputLabel: { shrink: true }
          }}
        >
          <MenuItem value="All">All Categories</MenuItem>
          <MenuItem value="cosmetics">Cosmetics</MenuItem>
          <MenuItem value="nutrients">Nutrients</MenuItem>
        </TextField>

        {categoryFilter !== 'All' && subcategoryMap[categoryFilter] && (
          <TextField
            select
            size="small"
            label="Subcategory"
            value={subcategoryFilter}
            onChange={(e) => setSubcategoryFilter(e.target.value)}
            sx={{ 
              minWidth: 160,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: '#fbfaf8',
                height: 40,
                fontSize: '0.875rem',
                '& fieldset': { borderColor: 'rgba(0,0,0,0.06)' },
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.8rem',
                fontWeight: 700,
                '&.MuiInputLabel-shrink': { transform: 'translate(14px, -10px) scale(0.85)', bgcolor: 'white', px: 0.5 }
              }
            }}
            slotProps={{ inputLabel: { shrink: true } }}
          >
            <MenuItem value="All">All Subcategories</MenuItem>
            {subcategoryMap[categoryFilter].map((sub) => (
              <MenuItem key={sub.value} value={sub.value}>{sub.label}</MenuItem>
            ))}
          </TextField>
        )}

        <TextField
          select
          size="small"
          label="Stock Status"
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          sx={{ 
            minWidth: 150,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              bgcolor: '#fbfaf8',
              height: 40,
              fontSize: '0.875rem',
              '& fieldset': { borderColor: 'rgba(0,0,0,0.06)' },
            },
            '& .MuiInputLabel-root': {
              fontSize: '0.8rem',
              fontWeight: 700,
              '&.MuiInputLabel-shrink': { transform: 'translate(14px, -10px) scale(0.85)', bgcolor: 'white', px: 0.5 }
            }
          }}
          slotProps={{ inputLabel: { shrink: true } }}
        >
          <MenuItem value="All">All Stock</MenuItem>
          <MenuItem value="In Stock">In Stock</MenuItem>
          <MenuItem value="Out of Stock">Out of Stock</MenuItem>
          <MenuItem value="Low Stock">Low Stock (&lt; 5)</MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          label="Sort By"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          sx={{ 
            minWidth: 150,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              bgcolor: '#fbfaf8',
              height: 40,
              fontSize: '0.875rem',
              '& fieldset': { borderColor: 'rgba(0,0,0,0.06)' },
            },
            '& .MuiInputLabel-root': {
              fontSize: '0.8rem',
              fontWeight: 700,
              '&.MuiInputLabel-shrink': { transform: 'translate(14px, -10px) scale(0.85)', bgcolor: 'white', px: 0.5 }
            }
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0.5 }}>
                  <Sort sx={{ color: 'text.secondary', opacity: 0.7, fontSize: '1.1rem' }} />
                </InputAdornment>
              ),
            },
            inputLabel: { shrink: true }
          }}
        >
          <MenuItem value="newest">Newest First</MenuItem>
          <MenuItem value="oldest">Oldest First</MenuItem>
          <MenuItem value="price-low">Price: Low to High</MenuItem>
          <MenuItem value="price-high">Price: High to Low</MenuItem>
        </TextField>
      </Box>

      {loading ? (
        <TableSkeleton 
          columns={[
            { flex: 3, align: 'left', variant: 'circular' },
            { flex: 1, align: 'center', variant: 'rectangular' },
            { flex: 1, align: 'center', variant: 'rectangular' },
            { flex: 1, align: 'center', variant: 'text' },
            { flex: 1.2, align: 'center', variant: 'rectangular' },
            { flex: 1, align: 'right', variant: 'circular' },
          ]} 
        />
      ) : (
        <Box sx={{ 
          bgcolor: 'white', 
          border: '1px solid rgba(0,0,0,0.06)', 
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          {/* Table Header */}
          <Box sx={{ display: 'flex', px: 3, py: 1.5, bgcolor: 'rgba(0,0,0,0.01)', borderBottom: '1px solid rgba(0,0,0,0.06)', minWidth: 900 }}>
            <Typography variant="caption"  sx={{ fontWeight: 800,  flex: 3, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem' }}>Product</Typography>
            <Typography variant="caption"  sx={{ fontWeight: 800,  flex: 1, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem', textAlign: 'center' }}>Category</Typography>
            <Typography variant="caption"  sx={{ fontWeight: 800,  flex: 1, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem', textAlign: 'center' }}>Subcategory</Typography>
            <Typography variant="caption"  sx={{ fontWeight: 800,  flex: 1, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem', textAlign: 'center' }}>Price</Typography>
            <Typography variant="caption"  sx={{ fontWeight: 800,  flex: 1.2, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem', textAlign: 'center' }}>Stock</Typography>
            <Typography variant="caption"  sx={{ fontWeight: 800,  flex: 1, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem', textAlign: 'right' }}>Actions</Typography>
          </Box>

        {/* Table Rows */}
        <Box sx={{ overflow: 'auto' }}>
          <Box sx={{ minWidth: 700 }}>
            {filteredProducts.map((product) => (
              <Box
                key={product._id}
                component={Link}
                to={`/admin/products/${product._id}`}
                sx={{
                  display: 'flex',
                  px: 3,
                  py: 1.5,
                  borderBottom: '1px solid rgba(0,0,0,0.04)',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  '&:hover': { 
                    bgcolor: 'rgba(45, 75, 56, 0.02)',
                    '& .product-name': { color: 'primary.main' }
                  },
                }}
              >
                <Box sx={{ flex: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 64,
                      bgcolor: (() => {
                        if (product.countInStock === 0) return 'rgba(170, 57, 43, 0.08)';
                        if (product.countInStock < 5) return 'rgba(244, 160, 60, 0.08)';
                        return '#f5f4f0';
                      })(),
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      borderRadius: '10px',
                      border: '1px solid rgba(0,0,0,0.06)'
                    }}
                  >
                    {product.image ? (
                      <Box component="img" src={product.image} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Typography sx={{ fontSize: '0.65rem', color: 'rgba(0,0,0,0.2)', fontWeight: 800 }}>VB</Typography>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="body2" className="product-name" sx={{ fontWeight: 800, transition: 'color 0.2s' }}>{product.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      {product.numReviews} review{product.numReviews !== 1 ? 's' : ''} · ★ {product.rating?.toFixed(1)}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <Chip label={product.category} size="small" sx={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                </Box>
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <Chip label={product.subcategory} size="small" variant="outlined" sx={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                </Box>
                <Typography variant="body2"  sx={{ fontWeight: 800,  flex: 1, color: 'primary.main', textAlign: 'center' }}>
                  ${product.price?.toFixed(2)}
                </Typography>
                <Box sx={{ flex: 1.2, display: 'flex', justifyContent: 'center' }}>
                  <Chip
                    label={product.countInStock > 0 ? `${product.countInStock} IN STOCK` : 'OUT OF STOCK'}
                    sx={{
                      height: 32,
                      width: 130, 
                      display: 'flex',
                      justifyContent: 'center',
                      bgcolor: (() => {
                        if (product.countInStock === 0) return '#aa392b';
                        if (product.countInStock < 5) return '#f4a03c';
                        return '#2D4B38'; 
                      })(),
                      color: 'white',
                      fontWeight: 800,
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      '& .MuiChip-label': { px: 1, width: '100%', textAlign: 'center' }
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1, display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                  <Tooltip title="Edit Product">
                    <IconButton
                      size="small"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/admin/products/${product._id}/edit`); }}
                      sx={{ color: '#5b7fa5', borderRadius: '8px', '&:hover': { bgcolor: 'rgba(91, 127, 165, 0.1)' } }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Product">
                    <IconButton
                      size="small"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeleteId(product._id); }}
                      sx={{ color: '#aa392b', borderRadius: '8px', '&:hover': { bgcolor: 'rgba(170, 57, 43, 0.1)' } }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      )}

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this product? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
