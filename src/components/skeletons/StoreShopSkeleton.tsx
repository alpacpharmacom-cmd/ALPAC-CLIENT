import { Box, Container, Grid, Skeleton, Stack } from '@mui/material';
import CardSkeleton from './CardSkeleton';

/**
 * Store Shop Skeleton
 * High-fidelity representation of the ShopPage.tsx
 */
export default function StoreShopSkeleton() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'transparent' }}>
      {/* Immersive Shop Header Skeleton */}
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
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Skeleton width={120} height={20} sx={{ mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Skeleton width="60%" sx={{ height: { xs: 48, md: 80 }, mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Skeleton width="80%" sx={{ height: { xs: 16, md: 24 }, mx: 'auto', bgcolor: 'rgba(255,255,255,0.05)' }} />
        </Container>
      </Box>

      {/* Main Content Area Skeleton */}
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 6, lg: 8 }, py: { xs: 3, md: 6 } }}>
        <Grid container spacing={{ xs: 3, md: 6 }}>
          {/* Sidebar Skeleton */}
          <Grid component="div" size={{ lg: 3, xl: 2.5 }}>
            <Box sx={{ display: { xs: 'none', lg: 'block' }, position: 'sticky', top: 100 }}>
              <Stack spacing={4}>
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: '12px' }} />
                <Box>
                  <Skeleton width={100} height={20} sx={{ mb: 2 }} />
                  <Stack spacing={1}>
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} height={40} sx={{ borderRadius: '10px' }} />
                    ))}
                  </Stack>
                </Box>
                <Box>
                  <Skeleton width={100} height={20} sx={{ mb: 2 }} />
                  <Stack spacing={1}>
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} variant="rectangular" height={32} sx={{ borderRadius: '10px' }} />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Product Grid Area Skeleton */}
          <Grid component="div" size={{ xs: 12, lg: 9, xl: 9.5 }}>
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
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: { xs: '100%', lg: 'auto' } }}>
                <Box sx={{ display: { xs: 'flex', lg: 'none' }, gap: 1 }}>
                  <Skeleton variant="rectangular" height={38} sx={{ borderRadius: '10px', flex: 1 }} />
                </Box>
                <Box sx={{ display: { xs: 'block', lg: 'none' }, width: '100%', mt: 1 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Skeleton variant="rectangular" height={40} sx={{ borderRadius: '10px', flex: 1 }} />
                    <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: '10px' }} />
                  </Stack>
                </Box>
                <Skeleton width={120} height={20} sx={{ ml: 0.5 }} />
              </Box>
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2, alignItems: 'center' }}>
                <Skeleton width={60} height={20} />
                <Skeleton variant="rectangular" width={180} height={40} sx={{ borderRadius: '12px' }} />
              </Box>
            </Box>

            <Grid container spacing={{ xs: 2.5, sm: 4 }}>
              {[...Array(8)].map((_, i) => (
                <Grid component="div" size={{ xs: 6, sm: 4 }} key={i}>
                   <CardSkeleton />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
