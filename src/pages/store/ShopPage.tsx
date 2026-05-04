import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Box, Container, Typography, Grid, TextField, InputAdornment, MenuItem, Select,
  Drawer, IconButton, Chip, Stack, Button, List, ListItemButton, ListItemText,
  useMediaQuery, useTheme, Fade
} from '@mui/material';
import { 
  Search, Close, RestartAlt, 
  Tune, ArrowForwardIos, ShoppingCart
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import toast from 'react-hot-toast';
import { useProductStore } from '../../stores/productStore';
import StoreShopSkeleton from '../../components/skeletons/StoreShopSkeleton';
import ProductCard from '../../components/store/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

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

const priceRanges = [
  { value: 'all', label: 'All Prices' },
  { value: 'under-50', label: 'Under $50' },
  { value: '50-100', label: '$50 – $100' },
  { value: 'over-100', label: 'Over $100' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name: A–Z' },
];

interface ShopFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeCategory: string;
  activeSubcategory: string;
  activePriceRange: string;
  activeSort: string;
  updateFilters: (key: string, value: string) => void;
  clearAllFilters: () => void;
  mobile?: boolean;
}

const ShopFilters = ({
  searchQuery,
  setSearchQuery,
  activeCategory,
  activeSubcategory,
  activePriceRange,
  activeSort,
  updateFilters,
  clearAllFilters,
  mobile
}: ShopFiltersProps) => (
  <Box sx={{ p: mobile ? 0 : { xs: 3, lg: 0 } }}>
    <Stack spacing={4}>
      {/* Search - Only show in sidebar on desktop */}
      {!mobile && (
        <Box>
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              placeholder="Search..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && updateFilters('search', searchQuery)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'primary.main', opacity: 1, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  sx: { 
                    borderRadius: '12px', 
                    bgcolor: 'rgba(255,255,255,0.5)',
                    border: '1px solid rgba(0,0,0,0.5)',
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                  }
                }
              }}
            />
            <IconButton 
              onClick={() => updateFilters('search', searchQuery)}
              sx={{ 
                bgcolor: 'primary.dark', 
                color: 'white',
                borderRadius: '12px',
                width: 40,
                height: 40,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'primary.main',
                  transform: 'scale(1.05)'
                }
              }}
            >
              <Search sx={{ fontSize: 20 }} />
            </IconButton>
          </Stack>
        </Box>
      )}

      {/* Categories */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Categories
        </Typography>
        <List disablePadding>
          <ListItemButton 
            selected={activeCategory === 'all'}
            onClick={() => updateFilters('category', 'all')}
            sx={{ borderRadius: '10px', mb: 0.5 }}
          >
            <ListItemText 
              primary={
                <Typography sx={{ fontSize: '0.9rem', fontWeight: activeCategory === 'all' ? 700 : 400 }}>
                  All Products
                </Typography>
              } 
            />
          </ListItemButton>
          {Object.keys(subcategoryMap).map(cat => (
            <Box key={cat}>
              <ListItemButton 
                selected={activeCategory === cat}
                onClick={() => updateFilters('category', cat)}
                sx={{ 
                  borderRadius: '10px', 
                  mb: 0.5,
                  position: 'relative',
                  pl: activeCategory === cat ? 2.5 : 2,
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    bgcolor: 'rgba(0,0,0,0.04)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '25%',
                      height: '50%',
                      width: 3,
                      bgcolor: 'primary.main',
                      borderRadius: '0 4px 4px 0'
                    }
                  }
                }}
              >
                <ListItemText 
                  primary={
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: activeCategory === cat ? 700 : 400 }}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </Typography>
                  }
                />
                {activeCategory === cat ? <Close sx={{ fontSize: 14, opacity: 0.5 }} /> : <ArrowForwardIos sx={{ fontSize: 10, opacity: 0.3 }} />}
              </ListItemButton>
              
              <AnimatePresence>
                {activeCategory === cat && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Box sx={{ pl: 2, mb: 1 }}>
                      <ListItemButton 
                        selected={activeSubcategory === 'all'}
                        onClick={() => updateFilters('subcategory', 'all')}
                        sx={{ borderRadius: '8px', py: 0.5 }}
                      >
                        <ListItemText 
                          primary={
                            <Typography sx={{ fontSize: '0.8rem', opacity: 0.7 }}>
                              All {cat}
                            </Typography>
                          } 
                        />
                      </ListItemButton>
                      {subcategoryMap[cat].map(sub => (
                        <ListItemButton 
                          key={sub.value}
                          selected={activeSubcategory === sub.value}
                          onClick={() => updateFilters('subcategory', sub.value)}
                          sx={{ borderRadius: '8px', py: 0.5 }}
                        >
                          <ListItemText 
                            primary={
                              <Typography sx={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                {sub.label}
                              </Typography>
                            } 
                          />
                        </ListItemButton>
                      ))}
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          ))}
        </List>
      </Box>

      {/* Price Range */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2, color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Price Range
        </Typography>
        <Stack spacing={1}>
          {priceRanges.map(range => (
            <Chip
              key={range.value}
              label={range.label}
              onClick={() => updateFilters('price', range.value)}
              variant={activePriceRange === range.value ? 'filled' : 'outlined'}
              color={activePriceRange === range.value ? 'primary' : 'default'}
              sx={{ 
                justifyContent: 'flex-start',
                borderRadius: '10px',
                fontWeight: 600,
                '& .MuiChip-label': { px: 2 }
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Sort By */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2, color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Sort By
        </Typography>
        <Stack spacing={1}>
          {sortOptions.map(opt => (
            <Chip
              key={opt.value}
              label={opt.label}
              onClick={() => updateFilters('sort', opt.value)}
              variant={activeSort === opt.value ? 'filled' : 'outlined'}
              color={activeSort === opt.value ? 'primary' : 'default'}
              sx={{ 
                justifyContent: 'flex-start',
                borderRadius: '10px',
                fontWeight: 600,
                '& .MuiChip-label': { px: 2 }
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Reset */}
      <Button 
        fullWidth 
        variant="outlined" 
        startIcon={<RestartAlt />}
        onClick={clearAllFilters}
        sx={{ borderRadius: '12px', py: 1.5 }}
      >
        Reset All
      </Button>
    </Stack>
  </Box>
);

export default function ShopPage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const { allProducts, fetchedAll, fetchAllProducts } = useProductStore();
  const [loading, setLoading] = useState(!fetchedAll);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  
  // URL Params
  const activeCategory = searchParams.get('category') || 'all';
  const activeSubcategory = searchParams.get('subcategory') || 'all';
  const activePriceRange = searchParams.get('price') || 'all';
  const activeSort = searchParams.get('sort') || 'newest';

  const { isAuthenticated } = useAuthStore();
  const wishlistItems = useWishlistStore(state => state.items);
  const toggleWishlistProduct = useWishlistStore(state => state.toggleWishlistProduct);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!fetchedAll) {
        setLoading(true);
        try {
          await fetchAllProducts();
        } catch (error) {
          console.error('Failed to fetch products:', error);
          toast.error('Failed to load products');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProducts();
  }, [fetchedAll, fetchAllProducts]);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    const currentValue = searchParams.get(key) || 'all';

    // If clicking an already active filter (and it's not 'all'), toggle it off
    const isToggleable = ['category', 'subcategory', 'price'].includes(key);
    const finalValue = (isToggleable && value !== 'all' && currentValue === value) ? 'all' : value;

    if (finalValue === 'all' || !finalValue) {
      newParams.delete(key);
    } else {
      newParams.set(key, finalValue);
    }
    
    if (key === 'category' && finalValue !== currentValue) {
      newParams.delete('subcategory');
    }
    
    setSearchParams(newParams);
    if (!isDesktop) setMobileFilterOpen(false);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearchQuery('');
    if (!isDesktop) setMobileFilterOpen(false);
  };

  const handleToggleWishlist = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to use wishlist');
      return;
    }
    try {
      await toggleWishlistProduct(productId);
      const isWishlisted = wishlistItems.some(item => item._id === productId);
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Search
    const search = searchParams.get('search')?.toLowerCase() || '';
    if (search) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.description?.toLowerCase().includes(search)
      );
    }

    // Category
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Subcategory
    if (activeSubcategory !== 'all') {
      result = result.filter(p => p.subcategory === activeSubcategory);
    }

    // Price
    if (activePriceRange === 'under-50') result = result.filter(p => p.price < 50);
    else if (activePriceRange === '50-100') result = result.filter(p => p.price >= 50 && p.price <= 100);
    else if (activePriceRange === 'over-100') result = result.filter(p => p.price > 100);

    // Sort
    if (activeSort === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (activeSort === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (activeSort === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (activeSort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    else if (activeSort === 'newest') result.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());

    return result;
  }, [allProducts, searchParams, activeCategory, activeSubcategory, activePriceRange, activeSort]);

  if (loading) return <StoreShopSkeleton />;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'transparent' }}>
      {/* Immersive Shop Header */}
      <Box
        sx={{
          bgcolor: 'primary.dark',
          pt: { xs: 3, md: 10 },
          pb: { xs: 3, md: 10 },
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(180deg, rgba(26,46,31,1) 0%, rgba(45,75,56,0.95) 100%)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: 0.1 }}
        >
          {/* Decorative pattern could go here */}
        </motion.div>

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            className="overline"
            sx={{ color: 'secondary.light', mb: 2, display: 'block' }}
          >
          </Typography>
          <Typography
            variant="h1"
            sx={{ fontWeight: 600, fontSize: { xs: '2.5rem', md: '5rem' }, mb: 2 }}
          >
            {activeCategory === 'all' ? 'All Products' : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: 600, mx: 'auto', fontSize: { xs: '1rem', md: '1.2rem' }, lineHeight: 1.6 }}>
            Discover our curated collection of botanical formulations and holistic wellness products.
          </Typography>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth={false} sx={{ px: { xs: 1, md: 6, lg: 8 }, py: { xs: 3, md: 6 } }}>
        <Grid container spacing={{ xs: 3, md: 6 }}>
          {/* Sidebar - Desktop */}
          {isDesktop && (
            <Grid component="div" size={{ lg: 3, xl: 2.5 }}>
              <Box sx={{ position: 'sticky', top: 100 }}>
                <ShopFilters 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  activeCategory={activeCategory}
                  activeSubcategory={activeSubcategory}
                  activePriceRange={activePriceRange}
                  activeSort={activeSort}
                  updateFilters={updateFilters}
                  clearAllFilters={clearAllFilters}
                />
              </Box>
            </Grid>
          )}

          {/* Product Grid Area */}
          <Grid component="div" size={{ xs: 12, lg: 9, xl: 9.5 }}>
            {/* Toolbar */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 4,
                gap: 2,
                flexWrap: 'wrap'
              }}
            >
              <Stack 
                direction="column" 
                sx={{ alignItems: 'flex-start', width: isDesktop ? 'auto' : '100%' }}
                spacing={1}
              >
                <Stack direction="row" spacing={1} sx={{ width: '100%', alignItems: 'center' }}>
                  {!isDesktop && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Tune sx={{ fontSize: 18 }} />}
                      onClick={() => setMobileFilterOpen(true)}
                      sx={{ 
                        borderRadius: '10px', 
                        bgcolor: 'primary.dark',
                        px: 2,
                        py: 0.8,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.02em',
                        flex: 1
                      }}
                    >
                      Filter & Sort
                    </Button>
                  )}
                  
                  {!isDesktop && (activeCategory !== 'all' || activeSubcategory !== 'all' || activePriceRange !== 'all' || searchParams.get('search')) && (
                    <Button 
                      size="small" 
                      onClick={clearAllFilters}
                      variant="outlined"
                      startIcon={<RestartAlt sx={{ fontSize: 14 }} />}
                      sx={{ 
                        borderRadius: '10px', 
                        fontSize: '0.7rem', 
                        fontWeight: 800,
                        color: 'error.main',
                        borderColor: 'rgba(211,47,47,0.15)',
                        height: 38, // Match contained button height roughly
                        px: 2,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        '&:hover': {
                          borderColor: 'error.main',
                          bgcolor: 'rgba(211,47,47,0.04)'
                        }
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </Stack>

                {/* Mobile Search - Visible only on mobile below filter buttons */}
                {!isDesktop && (
                  <Box sx={{ width: '100%', mt: 1 }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        placeholder="Search..."
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && updateFilters('search', searchQuery)}
                        slotProps={{
                          input: {
                            sx: { 
                              borderRadius: '10px', 
                              bgcolor: 'rgba(255,255,255,0.5)',
                              border: '1px solid rgba(0,0,0,0.5)',
                              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                              height: 40,
                              fontSize: '0.85rem'
                            }
                          }
                        }}
                        sx={{ flex: 1 }}
                      />
                      <IconButton 
                        onClick={() => updateFilters('search', searchQuery)}
                        sx={{ 
                          bgcolor: 'primary.dark', 
                          color: 'white',
                          borderRadius: '10px',
                          width: 40,
                          height: 40,
                          '&:hover': { bgcolor: 'primary.main' }
                        }}
                      >
                        <Search sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Stack>
                  </Box>
                )}

                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 800, 
                    color: 'primary.dark',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    ml: 0.5,
                  }}
                >
                  {filteredProducts.length} Results
                </Typography>
              </Stack>

              <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, color: 'text.secondary', fontWeight: 600 }}>
                  SORT BY
                </Typography>
                <Select
                  value={activeSort}
                  onChange={(e) => updateFilters('sort', e.target.value)}
                  size="small"
                  sx={{ 
                    borderRadius: '12px', 
                    minWidth: 180, 
                    fontWeight: 700,
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    bgcolor: 'rgba(0,0,0,0.03)'
                  }}
                >
                  {sortOptions.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>

            {/* Active Filter Chips */}
            {(activeCategory !== 'all' || activeSubcategory !== 'all' || activePriceRange !== 'all' || searchParams.get('search')) && (
              <Stack component="div" direction="row" spacing={1} sx={{ mb: 4, gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                {searchParams.get('search') && (
                  <Chip 
                    label={`Search: ${searchParams.get('search')}`} 
                    onDelete={() => {
                      updateFilters('search', '');
                      setSearchQuery('');
                    }}
                    sx={{ 
                      borderRadius: '10px', 
                      bgcolor: '#F0F1EF', 
                      color: 'primary.dark', 
                      fontWeight: 700,
                      height: 32,
                      border: '1px solid rgba(0,0,0,0.05)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: '#E8E9E6',
                      },
                      '& .MuiChip-deleteIcon': {
                        color: 'rgba(0,0,0,0.4)',
                        fontSize: 18,
                        '&:hover': { color: 'error.main' }
                      }
                    }}
                  />
                )}
                {activeCategory !== 'all' && (
                  <Chip 
                    label={`Category: ${activeCategory}`} 
                    onDelete={() => updateFilters('category', 'all')}
                    sx={{ 
                      borderRadius: '10px', 
                      bgcolor: '#F0F1EF', 
                      color: 'primary.dark', 
                      fontWeight: 700,
                      height: 32,
                      border: '1px solid rgba(0,0,0,0.05)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: '#E8E9E6',
                      },
                      '& .MuiChip-deleteIcon': {
                        color: 'rgba(0,0,0,0.4)',
                        fontSize: 18,
                        '&:hover': { color: 'error.main' }
                      }
                    }}
                  />
                )}
                {activeSubcategory !== 'all' && (
                  <Chip 
                    label={`Type: ${activeSubcategory}`} 
                    onDelete={() => updateFilters('subcategory', 'all')}
                    sx={{ 
                      borderRadius: '10px', 
                      bgcolor: '#F0F1EF', 
                      color: 'primary.dark', 
                      fontWeight: 700,
                      height: 32,
                      border: '1px solid rgba(0,0,0,0.05)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: '#E8E9E6',
                      },
                      '& .MuiChip-deleteIcon': {
                        color: 'rgba(0,0,0,0.4)',
                        fontSize: 18,
                        '&:hover': { color: 'error.main' }
                      }
                    }}
                  />
                )}
                {activePriceRange !== 'all' && (
                  <Chip 
                    label={priceRanges.find(r => r.value === activePriceRange)?.label} 
                    onDelete={() => updateFilters('price', 'all')}
                    sx={{ 
                      borderRadius: '10px', 
                      bgcolor: '#F0F1EF', 
                      color: 'primary.dark', 
                      fontWeight: 700,
                      height: 32,
                      border: '1px solid rgba(0,0,0,0.05)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: '#E8E9E6',
                      },
                      '& .MuiChip-deleteIcon': {
                        color: 'rgba(0,0,0,0.4)',
                        fontSize: 18,
                        '&:hover': { color: 'error.main' }
                      }
                    }}
                  />
                )}
                
                {/* Desktop-only Clear All button (Mobile has it in the toolbar) */}
                {isDesktop && (
                  <Button 
                    size="small" 
                    onClick={clearAllFilters}
                    variant="outlined"
                    startIcon={<RestartAlt sx={{ fontSize: 14 }} />}
                    sx={{ 
                      borderRadius: '8px', 
                      fontSize: '0.7rem', 
                      fontWeight: 800,
                      color: 'error.main',
                      borderColor: 'rgba(211,47,47,0.15)',
                      height: 32,
                      px: 1.5,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      '&:hover': {
                        borderColor: 'error.main',
                        bgcolor: 'rgba(211,47,47,0.04)'
                      }
                    }}
                  >
                    Clear All
                  </Button>
                )}
              </Stack>
            )}

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <Fade in>
                <Box 
                  sx={{ 
                    textAlign: 'center', 
                    py: 12, 
                    px: 3,
                    bgcolor: 'rgba(0,0,0,0.01)',
                    borderRadius: '24px',
                    border: '1px dashed rgba(0,0,0,0.1)'
                  }}
                >
                  <Box sx={{ mb: 3, opacity: 0.1 }}>
                    <ShoppingCart sx={{ fontSize: 80 }} />
                  </Box>
                  <Typography variant="h4" sx={{ mb: 2, fontWeight: 300 }}>
                    No products found
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', mb: 4, maxWidth: 400, mx: 'auto' }}>
                    We couldn't find any products matching your current filters. Try adjusting your search or clearing filters.
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={clearAllFilters}
                    startIcon={<RestartAlt />}
                    sx={{ borderRadius: '12px', px: 4 }}
                  >
                    Reset All Filters
                  </Button>
                </Box>
              </Fade>
            ) : (
              <motion.div layout>
                <Grid container spacing={{ xs: 1.5, sm: 4 }}>
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, index) => (
                      <Grid component="div" size={{ xs: 6, sm: 4 }} key={product._id}>
                        <ProductCard 
                          product={product} 
                          index={index} 
                          handleToggleWishlist={handleToggleWishlist}
                          isWishlisted={wishlistItems.some(item => item._id === product._id)}
                        />
                      </Grid>
                    ))}
                  </AnimatePresence>
                </Grid>
              </motion.div>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="left"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        slotProps={{
          paper: {
            sx: { width: '85%', maxWidth: 360, borderRadius: '0 24px 24px 0' }
          }
        }}
      >
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Tune sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Filter & Sort</Typography>
          </Box>
          <IconButton onClick={() => setMobileFilterOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ px: 3, py: 4 }}>
          <ShopFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeCategory={activeCategory}
            activeSubcategory={activeSubcategory}
            activePriceRange={activePriceRange}
            activeSort={activeSort}
            updateFilters={updateFilters}
            clearAllFilters={clearAllFilters}
            mobile
          />
        </Box>
      </Drawer>
    </Box>
  );
}
