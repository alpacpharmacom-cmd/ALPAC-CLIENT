import React, { useEffect, useState, useMemo, memo } from 'react';
import { useSearchParams, useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Box, Container, Typography, Grid, TextField, InputAdornment, MenuItem, Select,
  Drawer, IconButton, Chip, Stack, Button, List, ListItemButton, ListItemText,
  useMediaQuery, useTheme
} from '@mui/material';
import { 
  Search, Close, RestartAlt, 
  Tune, ShoppingCart
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import toast from 'react-hot-toast';
import { useProductStore } from '../../stores/productStore';
import StoreShopSkeleton from '../../components/skeletons/StoreShopSkeleton';
import ProductCard from '../../components/store/ProductCard';
import {
  COSMETICS_CATEGORIES,
  NUTRIENTS_CATEGORIES,
  CATEGORY_HEALTH_GOALS,
  slugify,
  unslugify
} from '../../utils/category.utils';
import { HealthGoalIcon } from '../../components/store/HealthGoalIcons';

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
  activePriceRange: string;
  activeSort: string;
  activeBrands: string[];
  uniqueBrands: string[];
  updateFilters: (key: string, value: string) => void;
  toggleBrand: (brand: string) => void;
  clearAllFilters: () => void;
  mobile?: boolean;
}

const ShopFilters = memo(({
  searchQuery,
  setSearchQuery,
  activeCategory,
  activePriceRange,
  activeSort,
  activeBrands,
  uniqueBrands,
  updateFilters,
  toggleBrand,
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
                    bgcolor: 'white',
                    border: '1.5px solid rgba(0,0,0,0.18)',
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'rgba(0,0,0,0.3)',
                    },
                    '&.Mui-focused': {
                      borderColor: '#3d6b4f',
                    }
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
                '&:hover': {
                  bgcolor: 'primary.main',
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
            component={Link}
            to="/shop"
            selected={activeCategory === 'all'}
            sx={{ borderRadius: '10px', mb: 1 }}
          >
            <ListItemText 
              primary={
                <Typography sx={{ fontSize: '0.9rem', fontWeight: activeCategory === 'all' ? 700 : 400 }}>
                  All Products
                </Typography>
              } 
            />
          </ListItemButton>

          <Typography variant="caption" sx={{ px: 2, py: 0.5, fontWeight: 700, color: 'text.secondary', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Cosmetics
          </Typography>
          {COSMETICS_CATEGORIES.map(cat => (
            <ListItemButton 
              key={cat}
              component={Link}
              to={`/category/${slugify(cat)}`}
              selected={activeCategory === cat}
              sx={{ borderRadius: '10px', mb: 0.5, pl: 3 }}
            >
              <ListItemText 
                primary={
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: activeCategory === cat ? 700 : 400, textTransform: 'capitalize' }}>
                    {cat}
                  </Typography>
                }
              />
            </ListItemButton>
          ))}

          <Typography variant="caption" sx={{ px: 2, py: 1, fontWeight: 700, color: 'text.secondary', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', mt: 1.5 }}>
            Nutrients
          </Typography>
          {NUTRIENTS_CATEGORIES.map(cat => (
            <ListItemButton 
              key={cat}
              component={Link}
              to={`/category/${slugify(cat)}`}
              selected={activeCategory === cat}
              sx={{ borderRadius: '10px', mb: 0.5, pl: 3 }}
            >
              <ListItemText 
                primary={
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: activeCategory === cat ? 700 : 400, textTransform: 'capitalize' }}>
                    {cat}
                  </Typography>
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Brands (Dynamic checkboxes) */}
      {uniqueBrands.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2, color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Brands
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {uniqueBrands.map(brand => {
              const isChecked = activeBrands.includes(brand);
              return (
                <Chip
                  key={brand}
                  label={brand}
                  onClick={() => toggleBrand(brand)}
                  variant={isChecked ? 'filled' : 'outlined'}
                  color={isChecked ? 'primary' : 'default'}
                  sx={{ 
                    borderRadius: '10px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                />
              );
            })}
          </Box>
        </Box>
      )}

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
));

ShopFilters.displayName = 'ShopFilters';

export default function ShopPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [searchParams, setSearchParams] = useSearchParams();
  const { categoryName, goalName } = useParams<{ categoryName?: string; goalName?: string }>();
  
  // State
  const { allProducts, fetchedAll, fetchAllProducts } = useProductStore();
  const [loading, setLoading] = useState(!fetchedAll);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  
  // URL Params mapping
  const activeCategory = categoryName ? unslugify(categoryName) : (searchParams.get('category') || 'all');
  const activeGoal = goalName ? unslugify(goalName) : null;
  const activePriceRange = searchParams.get('price') || 'all';
  const activeSort = searchParams.get('sort') || 'newest';

  const activeBrands = useMemo(() => {
    const val = searchParams.get('brands');
    return val ? val.split(',') : [];
  }, [searchParams]);

  const activeHealthGoals = useMemo(() => {
    if (activeGoal) return [activeGoal];
    const val = searchParams.get('healthGoals');
    return val ? val.split(',') : [];
  }, [searchParams, activeGoal]);

  const { isAuthenticated } = useAuthStore();
  const wishlistItems = useWishlistStore(state => state.items);
  const toggleWishlistProduct = useWishlistStore(state => state.toggleWishlistProduct);

  const handleToggleWishlist = React.useCallback(async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to use wishlist');
      return;
    }
    try {
      await toggleWishlistProduct(productId);
      const isWishlisted = wishlistItems.some(item => item._id === productId);
      if (isWishlisted) {
        toast.success('Removed from wishlist');
      } else {
        toast.success('Added to wishlist!');
      }
    } catch {
      toast.error('Failed to update wishlist');
    }
  }, [isAuthenticated, toggleWishlistProduct, wishlistItems]);

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

  const updateFilters = React.useCallback((key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    const currentValue = searchParams.get(key) || 'all';

    const isToggleable = ['price'].includes(key);
    const finalValue = (isToggleable && value !== 'all' && currentValue === value) ? 'all' : value;

    if (finalValue === 'all' || !finalValue) {
      newParams.delete(key);
    } else {
      newParams.set(key, finalValue);
    }
    
    setSearchParams(newParams);
    if (!isDesktop) setMobileFilterOpen(false);
  }, [searchParams, setSearchParams, isDesktop]);

  const toggleBrand = React.useCallback((brand: string) => {
    const newParams = new URLSearchParams(searchParams);
    const current = searchParams.get('brands') ? searchParams.get('brands')!.split(',') : [];
    let updated;
    if (current.includes(brand)) {
      updated = current.filter(b => b !== brand);
    } else {
      updated = [...current, brand];
    }
    if (updated.length === 0) {
      newParams.delete('brands');
    } else {
      newParams.set('brands', updated.join(','));
    }
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const toggleHealthGoal = React.useCallback((goal: string) => {
    if (goalName) {
      navigate(`/category/${slugify(activeCategory)}`);
      return;
    }

    const newParams = new URLSearchParams(searchParams);
    const isNutrient = activeCategory.toLowerCase() === 'nutrients';

    if (isNutrient) {
      const current = searchParams.get('healthGoals') ? searchParams.get('healthGoals')!.split(',') : [];
      if (current.includes(goal) && current.length === 1) {
        newParams.delete('healthGoals');
      } else {
        newParams.set('healthGoals', goal);
      }
    } else {
      const current = searchParams.get('healthGoals') ? searchParams.get('healthGoals')!.split(',') : [];
      let updated;
      if (current.includes(goal)) {
        updated = current.filter(g => g !== goal);
      } else {
        updated = [...current, goal];
      }
      if (updated.length === 0) {
        newParams.delete('healthGoals');
      } else {
        newParams.set('healthGoals', updated.join(','));
      }
    }
    setSearchParams(newParams);
  }, [searchParams, setSearchParams, activeCategory, goalName, navigate]);

  const handleConcernClick = React.useCallback((goal: string) => {
    if (categoryName) {
      navigate(`/category/${slugify(categoryName)}/goal/${slugify(goal)}`);
    } else {
      toggleHealthGoal(goal);
    }
  }, [categoryName, navigate, toggleHealthGoal]);

  const clearAllFilters = React.useCallback(() => {
    if (goalName) {
      navigate(`/category/${slugify(activeCategory)}`);
    } else {
      setSearchParams(new URLSearchParams());
      setSearchQuery('');
    }
    if (!isDesktop) setMobileFilterOpen(false);
  }, [setSearchParams, isDesktop, goalName, activeCategory, navigate]);

  const uniqueBrands = useMemo(() => {
    if (activeCategory === 'all') {
      const brands = allProducts.map(p => p.brand).filter(Boolean);
      return Array.from(new Set(brands)).sort();
    }
    const brands = allProducts
      .filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase())
      .map(p => p.brand)
      .filter(Boolean);
    return Array.from(new Set(brands)).sort();
  }, [allProducts, activeCategory]);

  const categoryHealthGoals = useMemo(() => {
    if (activeCategory === 'all') return [];
    return CATEGORY_HEALTH_GOALS[activeCategory.toLowerCase()] || [];
  }, [activeCategory]);

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
      result = result.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());
    }

    // Brands
    if (activeBrands.length > 0) {
      result = result.filter(p => p.brand && activeBrands.includes(p.brand));
    }

    // Health Goals
    if (activeHealthGoals.length > 0) {
      result = result.filter(p => p.healthGoal && activeHealthGoals.includes(p.healthGoal));
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
  }, [allProducts, searchParams, activeCategory, activeBrands, activeHealthGoals, activePriceRange, activeSort]);

  if (loading) return <StoreShopSkeleton />;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'transparent' }}>
      {/* Immersive Shop Header */}
      <Box
        sx={{
          bgcolor: 'primary.dark',
          pt: activeGoal ? { xs: 3.5, md: 5 } : { xs: 5, md: 7 },
          pb: activeGoal ? { xs: 3.5, md: 5 } : { xs: 5, md: 7 },
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(180deg, rgba(26,46,31,1) 0%, rgba(45,75,56,0.95) 100%)',
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          {activeGoal && (
            <Box sx={{ mb: 2.5 }}>
              <Button
                component={Link}
                to={`/category/${slugify(activeCategory)}`}
                sx={{
                  color: 'rgba(255,255,255,0.85)',
                  textTransform: 'uppercase',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  border: '1.5px solid rgba(255,255,255,0.25)',
                  borderRadius: '100px',
                  px: 2.5,
                  py: 0.6,
                  backdropFilter: 'blur(4px)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderColor: 'white',
                    transform: 'translateX(-2px)'
                  }
                }}
              >
                ← Back to {activeCategory}
              </Button>
            </Box>
          )}
          <Typography
            variant="h1"
            sx={{ fontWeight: 600, fontSize: activeGoal ? { xs: '2rem', md: '3.2rem' } : { xs: '2.5rem', md: '4rem' }, mb: 1, textTransform: 'capitalize' }}
          >
            {activeGoal ? activeGoal : (activeCategory === 'all' ? 'All Products' : activeCategory)}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.65)', maxWidth: 600, mx: 'auto', fontSize: activeGoal ? { xs: '0.9rem', md: '1.05rem' } : { xs: '1rem', md: '1.15rem' }, lineHeight: 1.5 }}>
            {activeGoal 
              ? `Discover our specialized formulations for ${activeGoal.toLowerCase()}.` 
              : 'Discover our curated collection of botanical formulations and holistic wellness products.'
            }
          </Typography>
        </Container>
      </Box>

      {/* Visual Shop By Concern Grid (Header concern section, shown on Category page) */}
      {activeCategory !== 'all' && !activeGoal && categoryHealthGoals.length > 0 && (
        <Box sx={{ py: 5, bgcolor: 'rgba(247, 244, 239, 0.3)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
          <Typography 
            variant="h3" 
            align="center"
            sx={{ 
              fontWeight: 700, 
              fontSize: { xs: '1.35rem', md: '1.85rem' }, 
              color: 'primary.dark', 
              fontFamily: '"Playfair Display", serif',
              textAlign: 'center',
              letterSpacing: '0.02em',
              mb: 1
            }}
          >
            {activeCategory.toLowerCase() === 'nutrients' ? 'Shop by Health Goal' : 'Shop By Concern'}
          </Typography>
          {/* Reference wavy divider line */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, mt: -1 }}>
            <Box sx={{ width: 60, height: 8, overflow: 'hidden' }}>
              <svg width="60" height="8" viewBox="0 0 60 8" fill="none">
                <path d="M1 6C3 4.5 5 3 8 3C11 3 13 4.5 15 6C17 7.5 19 6 22 6C25 6 27 4.5 29 3C31 1.5 33 3 36 3C39 3 41 4.5 43 6C45 7.5 47 6 50 6C53 6 55 4.5 57 3" stroke="#47c3be" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </Box>
          </Box>

          <Grid 
            container 
            spacing={{ xs: 3, md: 4 }} 
            sx={{ justifyContent: 'center', maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 6 } }}
          >
            {categoryHealthGoals.map(goal => {
              const isSelected = activeHealthGoals.includes(goal);
              const isNutrient = activeCategory.toLowerCase() === 'nutrients';

              return (
                <Grid size={isNutrient ? { xs: 6, sm: 4, md: 1.7 } : { xs: 6, sm: 4, md: 2.4 }} key={goal} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box
                    onClick={() => handleConcernClick(goal)}
                    sx={{
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      width: '100%',
                      maxWidth: '140px',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)'
                      }
                    }}
                  >
                    {/* Clean Circular Container */}
                    <Box
                      sx={{
                        width: '84px',
                        height: '84px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: isSelected ? 'rgba(61,107,79,0.06)' : 'rgba(0,0,0,0.02)',
                        color: isSelected ? '#3d6b4f' : '#222222',
                        border: isSelected ? '2.5px solid #3d6b4f' : '1.5px solid rgba(0,0,0,0.08)',
                        boxShadow: isSelected ? '0 4px 12px rgba(61,107,79,0.1)' : 'none',
                        p: 2.2,
                        mb: 1.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: '#3d6b4f',
                          color: '#3d6b4f',
                          bgcolor: 'rgba(61,107,79,0.03)'
                        }
                      }}
                    >
                      <HealthGoalIcon goal={goal} size="100%" />
                    </Box>

                    {/* Centered label directly below icon */}
                    <Typography 
                      sx={{ 
                        color: isSelected ? '#3d6b4f' : '#222222', 
                        fontSize: '0.82rem', 
                        fontWeight: isSelected ? 700 : 500, 
                        lineHeight: 1.3,
                        textTransform: 'capitalize',
                        transition: 'color 0.2s ease'
                      }}
                    >
                      {goal}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      {/* Main Content Area */}
      <Container maxWidth={false} sx={{ px: { xs: 1.5, md: 6, lg: 8 }, py: { xs: 2, md: 6 } }}>
        <Grid container spacing={{ xs: 2, md: 6 }}>
          {/* Sidebar - Desktop */}
          {isDesktop && (
            <Grid component="div" size={{ lg: 3, xl: 2.5 }}>
              <Box sx={{ position: 'sticky', top: 100 }}>
                <ShopFilters 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  activeCategory={activeCategory}
                  activePriceRange={activePriceRange}
                  activeSort={activeSort}
                  activeBrands={activeBrands}
                  uniqueBrands={uniqueBrands}
                  updateFilters={updateFilters}
                  toggleBrand={toggleBrand}
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
                mb: { xs: 2.5, md: 4 },
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
                        py: { xs: 0.6, md: 0.8 },
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.02em',
                        flex: 1
                      }}
                    >
                      Filter & Sort
                    </Button>
                  )}
                  
                  {!isDesktop && (activeCategory !== 'all' || activeBrands.length > 0 || activeHealthGoals.length > 0 || activePriceRange !== 'all' || searchParams.get('search')) && (
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
                        height: 38,
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
            {(activeCategory !== 'all' || activeBrands.length > 0 || activeHealthGoals.length > 0 || activePriceRange !== 'all' || searchParams.get('search')) && (
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
                      '&:hover': { bgcolor: '#E8E9E6' },
                      '& .MuiChip-deleteIcon': {
                        color: 'rgba(0,0,0,0.4)',
                        fontSize: 18,
                        '&:hover': { color: 'error.main' }
                      }
                    }}
                  />
                )}
                {categoryName && activeCategory !== 'all' && (
                  <Chip 
                    label={`Category: ${activeCategory}`} 
                    component={Link}
                    to="/shop"
                    sx={{ 
                      borderRadius: '10px', 
                      bgcolor: '#F0F1EF', 
                      color: 'primary.dark', 
                      fontWeight: 700,
                      height: 32,
                      border: '1px solid rgba(0,0,0,0.05)',
                      textDecoration: 'none',
                      '&:hover': { bgcolor: '#E8E9E6' },
                      '& .MuiChip-label': { cursor: 'pointer' }
                    }}
                  />
                )}
                {activeBrands.map(brand => (
                  <Chip 
                    key={brand}
                    label={`Brand: ${brand}`} 
                    onDelete={() => toggleBrand(brand)}
                    sx={{ 
                      borderRadius: '10px', 
                      bgcolor: '#F0F1EF', 
                      color: 'primary.dark', 
                      fontWeight: 700,
                      height: 32,
                      border: '1px solid rgba(0,0,0,0.05)',
                      '&:hover': { bgcolor: '#E8E9E6' },
                      '& .MuiChip-deleteIcon': {
                        color: 'rgba(0,0,0,0.4)',
                        fontSize: 18,
                        '&:hover': { color: 'error.main' }
                      }
                    }}
                  />
                ))}
                {activeHealthGoals.map(goal => (
                  <Chip 
                    key={goal}
                    label={`Goal: ${goal}`} 
                    onDelete={() => toggleHealthGoal(goal)}
                    sx={{ 
                      borderRadius: '10px', 
                      bgcolor: '#F0F1EF', 
                      color: 'primary.dark', 
                      fontWeight: 700,
                      height: 32,
                      border: '1px solid rgba(0,0,0,0.05)',
                      '&:hover': { bgcolor: '#E8E9E6' },
                      '& .MuiChip-deleteIcon': {
                        color: 'rgba(0,0,0,0.4)',
                        fontSize: 18,
                        '&:hover': { color: 'error.main' }
                      }
                    }}
                  />
                ))}
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
                      '&:hover': { bgcolor: '#E8E9E6' },
                      '& .MuiChip-deleteIcon': {
                        color: 'rgba(0,0,0,0.4)',
                        fontSize: 18,
                        '&:hover': { color: 'error.main' }
                      }
                    }}
                  />
                )}
                
                {/* Desktop-only Clear All button */}
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
            ) : (
                <Grid container spacing={{ xs: 2, sm: 4 }}>
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
                </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
      
      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        slotProps={{
          paper: {
            sx: { width: '85%', maxWidth: 360, p: 3, bgcolor: '#fbfaf8' }
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Filters</Typography>
          <IconButton onClick={() => setMobileFilterOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <ShopFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeCategory={activeCategory}
          activePriceRange={activePriceRange}
          activeSort={activeSort}
          activeBrands={activeBrands}
          uniqueBrands={uniqueBrands}
          updateFilters={updateFilters}
          toggleBrand={toggleBrand}
          clearAllFilters={clearAllFilters}
          mobile
        />
      </Drawer>
    </Box>
  );
}
