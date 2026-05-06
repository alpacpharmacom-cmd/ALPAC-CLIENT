import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  MenuList,
  Divider,
  Container,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  TextField,
  InputAdornment,
  ClickAwayListener,
  Tooltip,
  Collapse,
} from '@mui/material';
import {
  ShoppingCart,
  Person,
  Logout,
  Menu as MenuIcon,
  Close, 
  Dashboard,
  Search,
  FavoriteBorder,
  Inventory2,
  KeyboardArrowDown,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { 
    label: 'Cosmetics', 
    path: '/shop?category=cosmetics',
    subLinks: [
      { label: 'Skin Care', path: '/shop?category=cosmetics&subcategory=skin care' },
      { label: 'Hair Care', path: '/shop?category=cosmetics&subcategory=hair care' },
      { label: 'Intimate', path: '/shop?category=cosmetics&subcategory=intimate' },
      { label: 'Kids Care', path: '/shop?category=cosmetics&subcategory=kids care' },
      { label: 'Oral Care', path: '/shop?category=cosmetics&subcategory=oral care' },
      { label: 'Muscles & Joints', path: '/shop?category=cosmetics&subcategory=muscles & joints' },
      { label: 'Antiseptics', path: '/shop?category=cosmetics&subcategory=antiseptics' },
      { label: 'Anti Scar', path: '/shop?category=cosmetics&subcategory=anti scar' },
    ]
  },
  { 
    label: 'Nutrients', 
    path: '/shop?category=nutrients',
    subLinks: [
      { label: 'Vitamins', path: '/shop?category=nutrients&subcategory=vitamins' },
      { label: 'Supplements', path: '/shop?category=nutrients&subcategory=supplements' },
      { label: 'Wellness', path: '/shop?category=nutrients&subcategory=wellness' },
    ]
  },
  { label: 'About', path: '/about' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isAdmin = useAuthStore(state => state.isAdmin);
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  
  const totalItems = useCartStore(state => state.totalItems);
  const wishlistItems = useWishlistStore(state => state.items);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const toggleMobileExpanded = (label: string) => {
    setMobileExpanded(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'rgba(247, 244, 239, 0.85)',
        backdropFilter: 'blur(24px)',
        color: '#111111',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        zIndex: 1100,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            minHeight: { xs: '60px', md: '68px' },
            px: { xs: 0, md: 2 },
            gap: 2,
          }}
        >
          {/* Mobile menu button */}
          <IconButton
            sx={{ display: { md: 'none' }, color: '#111' }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo - LEFT */}
          <Box
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              mr: { xs: 'auto', md: 4 },
              position: 'static',
              transform: 'none',
              ml: { xs: 0.5, md: 0 },
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontWeight: 700,
                fontSize: { xs: '1.35rem', md: '1.5rem' },
                letterSpacing: '0.12em',
                color: '#111',
              }}
            >
              ALPAC
            </Typography>
          </Box>

          {/* Nav links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, alignItems: 'center' }}>
            {navLinks.map((link) => {
              const isShopRoot = link.path === '/shop' && (location.pathname === '/shop' && location.search === '');
              const isExactMatch = location.pathname + location.search === link.path;
              const isActive = isShopRoot || isExactMatch;

              return (
                <Box
                  key={link.path}
                  sx={{
                    position: 'relative',
                    '&:hover .nav-dropdown': {
                      opacity: 1,
                      visibility: 'visible',
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  <Button
                    component={Link}
                    to={link.path}
                    sx={{
                      color: isActive ? '#3d6b4f' : '#333',
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.82rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      px: 2.2,
                      py: 1,
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      transition: 'none',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 4,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: isActive ? '50%' : 0,
                        height: '2px',
                        bgcolor: '#3d6b4f',
                      },
                      '&:hover': {
                        bgcolor: 'transparent',
                        color: '#3d6b4f',
                        '&::after': {
                          width: '50%',
                        },
                      },
                    }}
                  >
                    {link.label}
                    {link.subLinks && <KeyboardArrowDown sx={{ fontSize: 16, opacity: 0.7 }} />}
                  </Button>

                  {link.subLinks && (
                    <Box
                      className="nav-dropdown"
                      sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        opacity: 0,
                        visibility: 'hidden',
                        transform: 'translateY(8px)',
                        transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                        minWidth: 100,
                        pt: 1, // This creates a "bridge" to prevent flickering
                        zIndex: 1000,
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.98)',
                          backdropFilter: { xs: 'none', md: 'blur(12px)' },
                          borderRadius: '12px',
                          boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                          border: '1px solid rgba(0,0,0,0.06)',
                          overflow: 'hidden',
                        }}
                      >
                        <MenuList
                          sx={{
                            py: 1,
                          }}
                        >
                          {link.subLinks.map((sub: any) => (
                            <MenuItem
                              key={sub.path}
                              component={Link}
                              to={sub.path}
                              sx={{
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                py: 1.2,
                                px: 3,
                                color: '#333',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                '&:hover': {
                                  bgcolor: 'rgba(45,75,56,0.06)',
                                  color: '#3d6b4f',
                                },
                              }}
                            >
                              {sub.label}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Box>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />

          {/* Search bar - Desktop */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              position: 'relative',
              mr: 1,
            }}
          >
            <TextField
              size="small"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ fontSize: 18, color: '#999' }} />
                    </InputAdornment>
                  ),
                }
              }}
              sx={{
                width: searchOpen ? 260 : 180,
                transition: 'width 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '100px',
                  bgcolor: 'rgba(0,0,0,0.03)',
                  height: 38,
                  fontSize: '0.82rem',
                  fontFamily: '"DM Sans", sans-serif',
                  transition: 'background-color 0.3s ease, border-color 0.3s ease',
                  '& fieldset': {
                    borderColor: 'rgba(0,0,0,0.08)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(0,0,0,0.15)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3d6b4f',
                    borderWidth: '1px',
                  },
                  '&.Mui-focused': {
                    bgcolor: 'white',
                  },
                },
                '& input::placeholder': {
                  color: '#999',
                  opacity: 1,
                  fontSize: '0.82rem',
                },
              }}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => {
                if (!searchQuery) setSearchOpen(false);
              }}
            />
          </Box>

          {/* Right icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
            {/* Mobile search */}
            <IconButton
              sx={{ display: { md: 'none' }, color: '#333' }}
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search sx={{ fontSize: 21 }} />
            </IconButton>

            {isAdmin && (
              <Tooltip title="Admin Dashboard">
                <IconButton
                  component={Link}
                  to="/admin"
                  sx={{
                    color: '#3d6b4f',
                    display: { xs: 'none', md: 'flex' },
                    '&:hover': { bgcolor: 'rgba(61,107,79,0.06)' },
                  }}
                >
                  <Dashboard sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            )}

            {isAuthenticated ? (
              <Tooltip title="Account Settings">
                <IconButton 
                  onClick={handleMenuOpen} 
                  sx={{ 
                    color: '#333', 
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                  }}
                >
                  <Person sx={{ fontSize: 21 }} />
                </IconButton>
              </Tooltip>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  color: '#111',
                  borderColor: 'rgba(0,0,0,0.15)',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  px: 2.5,
                  py: 0.6,
                  '&:hover': { 
                    borderColor: '#3d6b4f', 
                    color: '#3d6b4f',
                    bgcolor: 'rgba(61,107,79,0.02)'
                  },
                }}
              >
                Sign In
              </Button>
            )}

            {/* Subtle Divider between Auth and Shop */}
            <Box sx={{ width: '1px', height: '20px', bgcolor: 'rgba(0,0,0,0.1)', mx: 1.5, display: { xs: 'none', md: 'block' } }} />

            <Tooltip title="Wishlist">
              <IconButton
                component={Link}
                to={isAuthenticated ? '/wishlist' : '/login'}
                sx={{ 
                  color: '#333', 
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                }}
              >
                <Badge
                  badgeContent={wishlistItems.length}
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: '#4a6741',
                      color: 'white',
                      fontSize: '0.6rem',
                      minWidth: '16px',
                      height: '16px',
                      fontWeight: 700,
                      top: 4,
                      right: 4,
                    },
                  }}
                >
                  <FavoriteBorder sx={{ fontSize: 21 }} />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Shopping Cart">
              <IconButton
                component={Link}
                to={isAuthenticated ? '/cart' : '/login'}
                sx={{ 
                  color: '#333', 
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                }}
              >
                <Badge
                  badgeContent={totalItems}
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: '#3d6b4f',
                      color: 'white',
                      fontSize: '0.6rem',
                      minWidth: '16px',
                      height: '16px',
                      fontWeight: 700,
                      top: 4,
                      right: 4,
                    },
                  }}
                >
                  <ShoppingCart sx={{ fontSize: 21 }} />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="My Orders">
              <IconButton
                component={Link}
                to={isAuthenticated ? '/orders' : '/login'}
                sx={{ 
                  color: '#333', 
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                }}
              >
                <Inventory2 sx={{ fontSize: 21 }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* User menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            slotProps={{
              paper: {
                sx: {
                  mt: 1.5,
                  minWidth: 220,
                  borderRadius: '16px',
                  boxShadow: '0 12px 48px rgba(0,0,0,0.12)',
                  border: '1px solid rgba(0,0,0,0.05)',
                }
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {isAuthenticated ? (
              [
                <Box key="greeting" sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="body2"  color="text.primary"sx={{ fontWeight: 600 }}>
                    {user?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>,
                <Divider key="d1" />,
                <MenuItem key="profile" onClick={() => { handleMenuClose(); navigate('/profile'); }}
                  sx={{ py: 1.2, fontSize: '0.85rem' }}>
                  Profile
                </MenuItem>,

                <Divider key="d3" />,
                <MenuItem key="logout" onClick={handleLogout}
                  sx={{ py: 1.2, fontSize: '0.85rem', color: '#d32f2f' }}>
                  Sign Out
                </MenuItem>,
              ]
            ) : (
              [
                <MenuItem key="login" onClick={() => { handleMenuClose(); navigate('/login'); }}
                  sx={{ py: 1.2, fontSize: '0.85rem' }}>
                  Sign In
                </MenuItem>,
                <MenuItem key="register" onClick={() => { handleMenuClose(); navigate('/register'); }}
                  sx={{ py: 1.2, fontSize: '0.85rem' }}>
                  Create Account
                </MenuItem>,
              ]
            )}
          </Menu>
        </Toolbar>

        {/* Mobile search bar - slides down */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <ClickAwayListener onClickAway={() => { if (window.innerWidth < 900) setSearchOpen(false); }}>
                <Box
                  component="form"
                  onSubmit={handleSearch}
                  sx={{
                    display: { md: 'none' },
                    pb: 1.5,
                    px: 1,
                  }}
                >
                  <TextField
                    autoFocus
                    fullWidth
                    size="small"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ fontSize: 18, color: '#999' }} />
                          </InputAdornment>
                        ),
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '100px',
                        bgcolor: 'white',
                        height: 40,
                        fontSize: '0.85rem',
                        '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
                        '&.Mui-focused fieldset': { borderColor: '#3d6b4f', borderWidth: '1px' },
                      },
                    }}
                  />
                </Box>
              </ClickAwayListener>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 300,
              bgcolor: 'white',
            }
          }
        }}
      >
        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              fontSize: '1.3rem',
              letterSpacing: '0.12em',
              color: '#111',
            }}
          >
            Alpac
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <List sx={{ pt: 0 }}>
          {navLinks.map((link) => {
            const hasSubLinks = link.subLinks && link.subLinks.length > 0;
            const isExpanded = mobileExpanded[link.label];
            const isShopRoot = link.path === '/shop' && (location.pathname === '/shop' && location.search === '');
            const isExactMatch = location.pathname + location.search === link.path;
            const isActive = isShopRoot || isExactMatch;

            return (
              <Box key={link.label}>
                <ListItem disablePadding>
                  <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                    <ListItemButton
                      component={Link}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      sx={{ 
                        py: 1.8, 
                        px: 3, 
                        flexGrow: 1,
                        bgcolor: isActive ? 'rgba(61, 107, 79, 0.04)' : 'transparent',
                        color: isActive ? '#3d6b4f' : 'inherit',
                        borderLeft: isActive ? '4px solid #3d6b4f' : '4px solid transparent',
                      }}
                    >
                      <ListItemText
                        primary={link.label}
                        slotProps={{
                          primary: {
                            sx: {
                              fontSize: '0.9rem',
                              letterSpacing: '0.06em',
                              textTransform: 'uppercase',
                              fontWeight: isActive ? 700 : 500,
                            }
                          }
                        }}
                      />
                    </ListItemButton>
                    {hasSubLinks && (
                      <IconButton 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleMobileExpanded(link.label);
                        }}
                        sx={{ mr: 1, color: isActive ? '#3d6b4f' : 'inherit' }}
                      >
                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    )}
                  </Box>
                </ListItem>
                
                {hasSubLinks && (
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ bgcolor: 'rgba(0,0,0,0.01)' }}>
                      {link.subLinks.map((sub: any) => {
                        const isSubActive = location.pathname + location.search === sub.path;
                        return (
                          <ListItemButton
                            key={sub.path}
                            component={Link}
                            to={sub.path}
                            onClick={() => setMobileOpen(false)}
                            sx={{ 
                              py: 1.2, 
                              pl: 6,
                              color: isSubActive ? '#3d6b4f' : '#666',
                              fontWeight: isSubActive ? 600 : 400,
                            }}
                          >
                            <ListItemText 
                              primary={sub.label} 
                              slotProps={{
                                primary: {
                                  sx: {
                                    fontSize: '0.85rem',
                                    letterSpacing: '0.02em',
                                  }
                                }
                              }}
                            />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </Box>
            );
          })}
          
          <Divider sx={{ my: 2, opacity: 0.6 }} />
          


          {isAuthenticated ? (
            <>
              <Typography variant="overline" sx={{ px: 3, color: '#999', fontWeight: 600, letterSpacing: '0.1em' }}>
                Account & Shopping
              </Typography>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/profile" onClick={() => setMobileOpen(false)} sx={{ py: 1.5, px: 3, gap: 2 }}>
                  <Person sx={{ fontSize: 22, color: '#666' }} />
                  <ListItemText primary="Profile Settings" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/wishlist" onClick={() => setMobileOpen(false)} sx={{ py: 1.5, px: 3, gap: 2 }}>
                  <FavoriteBorder sx={{ fontSize: 22, color: '#666' }} />
                  <ListItemText primary="Wishlist" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/cart" onClick={() => setMobileOpen(false)} sx={{ py: 1.5, px: 3, gap: 2 }}>
                  <Badge badgeContent={totalItems} color="success" sx={{ '& .MuiBadge-badge': { bgcolor: '#3d6b4f' } }}>
                    <ShoppingCart sx={{ fontSize: 22, color: '#666' }} />
                  </Badge>
                  <ListItemText primary="Shopping Cart" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/orders" onClick={() => setMobileOpen(false)} sx={{ py: 1.5, px: 3, gap: 2 }}>
                  <Inventory2 sx={{ fontSize: 22, color: '#666' }} />
                  <ListItemText primary="My Orders" />
                </ListItemButton>
              </ListItem>
              {isAdmin && (
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/admin" onClick={() => setMobileOpen(false)} sx={{ py: 1.5, px: 3, gap: 2 }}>
                    <Dashboard sx={{ fontSize: 22, color: '#3d6b4f' }} />
                    <ListItemText primary="Admin Dashboard" slotProps={{ primary: { sx: { color: '#3d6b4f', fontWeight: 600 } } }} />
                  </ListItemButton>
                </ListItem>
              )}
              <Divider sx={{ my: 1, opacity: 0.6 }} />
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }} 
                  sx={{ 
                    py: 1.5, 
                    px: 3, 
                    gap: 2,
                    color: '#d32f2f',
                    '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.04)' }
                  }}
                >
                  <Logout sx={{ fontSize: 22 }} />
                  <ListItemText 
                    primary="Sign Out" 
                    slotProps={{ 
                      primary: { 
                        sx: { fontWeight: 600 } 
                      } 
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <>
              <ListItem disablePadding sx={{ mt: 1 }}>
                <Box sx={{ px: 2, width: '100%' }}>
                  <Button
                    fullWidth
                    component={Link}
                    to="/login"
                    variant="contained"
                    onClick={() => setMobileOpen(false)}
                    sx={{
                      bgcolor: '#3d6b4f',
                      color: 'white',
                      py: 1.2,
                      borderRadius: '8px',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      '&:hover': { bgcolor: '#2d4b38' }
                    }}
                  >
                    Sign In
                  </Button>
                </Box>
              </ListItem>
              <ListItem disablePadding sx={{ mt: 1 }}>
                <Box sx={{ px: 2, width: '100%' }}>
                  <Button
                    fullWidth
                    component={Link}
                    to="/register"
                    variant="outlined"
                    onClick={() => setMobileOpen(false)}
                    sx={{
                      borderColor: '#3d6b4f',
                      color: '#3d6b4f',
                      py: 1.2,
                      borderRadius: '8px',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      '&:hover': { bgcolor: 'rgba(61,107,79,0.04)', borderColor: '#2d4b38' }
                    }}
                  >
                    Create Account
                  </Button>
                </Box>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
}
