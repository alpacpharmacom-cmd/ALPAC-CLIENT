import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
  Button
} from '@mui/material';
import {
  Dashboard,
  Inventory2,
  ShoppingCart,
  People,
  Menu as MenuIcon,
  Storefront,
  Close,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import AmbientBackground from '../common/AmbientBackground';

const DRAWER_WIDTH = 280; // Slightly wider for premium feel

const menuItems = [
  { label: 'Admin Overview', path: '/admin', icon: <Dashboard /> },
  { label: 'Product Inventory', path: '/admin/products', icon: <Inventory2 /> },
  { label: 'Order History', path: '/admin/orders', icon: <ShoppingCart /> },
  { label: 'User Directory', path: '/admin/users', icon: <People /> },
];

export default function AdminLayout() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuthStore();

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
      <Box sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 800,
              fontSize: '1.6rem',
              letterSpacing: '0.05em',
              color: '#111',
              mb: 0.5
            }}
          >
            ALPAC
          </Typography>
          <Typography 
            variant="overline" 
            sx={{ 
              color: 'primary.main', 
              fontWeight: 800, 
              fontSize: '0.65rem',
              letterSpacing: '0.2em' 
            }}
          >
            ADMIN PANEL
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={() => setMobileOpen(false)}>
            <Close />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ mx: 2, opacity: 0.5 }} />

      <List sx={{ flex: 1, px: 2, py: 4 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{
                borderRadius: '16px',
                py: 1.5,
                px: 2.5,
                bgcolor: isActive(item.path) ? 'primary.main' : 'transparent',
                color: isActive(item.path) ? 'white' : 'text.secondary',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: isActive(item.path) ? 'primary.dark' : 'rgba(45, 75, 56, 0.04)',
                  transform: 'translateX(6px)',
                  boxShadow: isActive(item.path) ? '0 8px 20px rgba(45, 75, 56, 0.2)' : 'none',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path) ? 'white' : 'text.secondary',
                  minWidth: 44,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: '0.9rem',
                      fontWeight: isActive(item.path) ? 700 : 500,
                      letterSpacing: '0.01em',
                    }
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 3, mt: 'auto' }}>
        <Box
          sx={{
            bgcolor: 'rgba(45, 75, 56, 0.03)',
            borderRadius: '20px',
            p: 2.5,
            border: '1px solid rgba(0,0,0,0.04)',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
            {user?.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
            {user?.email}
          </Typography>
          
          <Button
            component={Link}
            to="/"
            variant="outlined"
            size="small"
            fullWidth
            startIcon={<Storefront sx={{ fontSize: '1rem' }} />}
            sx={{ 
              borderRadius: '10px', 
              fontSize: '0.7rem', 
              fontWeight: 800,
              color: 'primary.main',
              borderColor: 'rgba(45, 75, 56, 0.2)',
              '&:hover': { borderColor: 'primary.main', bgcolor: 'transparent' }
            }}
          >
            Visit Store
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'transparent', position: 'relative' }}>
      <AmbientBackground />
      {/* Sidebar */}
      {isMobile ? (
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          slotProps={{
            paper: {
              sx: { width: DRAWER_WIDTH, bgcolor: 'white', borderRight: 'none' }
            }
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          slotProps={{
            paper: {
              sx: {
                width: DRAWER_WIDTH,
                bgcolor: 'white',
                borderRight: '1px solid rgba(0,0,0,0.06)',
              }
            }
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Main content */}
      <Box sx={{ flex: 1, ml: { md: `${DRAWER_WIDTH}px` }, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar for mobile */}
        {isMobile && (
          <AppBar
            position="sticky"
            sx={{
              bgcolor: 'white',
              color: 'text.primary',
              boxShadow: 'none',
              borderBottom: '1px solid rgba(0,0,0,0.06)'
            }}
          >
            <Toolbar sx={{ height: 80 }}>
              <IconButton onClick={() => setMobileOpen(true)} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '0.05em' }}>
                ALPAC <Box component="span" sx={{ fontSize: '0.7rem', color: 'primary.main', fontWeight: 600 }}>ADMIN</Box>
              </Typography>
            </Toolbar>
          </AppBar>
        )}

        <Box sx={{ p: { xs: 3, md: 6 }, maxWidth: 1600, mx: 'auto', flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

