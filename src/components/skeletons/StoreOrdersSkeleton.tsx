import { Box, Container, Skeleton, Stack, Grid, Divider } from '@mui/material';

/**
 * Store Orders Skeleton (History)
 * High-fidelity representation of the storefront OrdersPage.tsx
 */
export default function StoreOrdersSkeleton() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'transparent' }}>
      {/* Premium Header Sanctuary - Color Matched to Shop */}
      <Box 
        sx={{ 
          bgcolor: 'primary.dark', 
          pt: { xs: 8, md: 12 }, 
          pb: { xs: 8, md: 12 }, 
          textAlign: 'center', 
          color: 'white', 
          position: 'relative', 
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(180deg, rgba(26,46,31,1) 0%, rgba(45,75,56,0.95) 100%)',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Skeleton 
             variant="text" 
             width={320} 
             height={60} 
             sx={{ mx: 'auto', mb: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} 
          />
          <Skeleton 
             variant="text" 
             width={200} 
             height={20} 
             sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.05)' }} 
          />
        </Box>
      </Box>

      <Container maxWidth={false} sx={{ py: { xs: 4, md: 6 }, mt: { xs: -2, md: -4 }, position: 'relative', zIndex: 3, px: { xs: 2, md: 6 }, maxWidth: '1600px' }}>
        <Grid container spacing={5}>
          {/* Main Column Skeleton */}
          <Grid size={{ xs: 12, md: 9 }}>
            {/* Ritual Control Bar Skeleton */}
            <Box
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2, 
                mb: 2,
                p: 1.5,
                bgcolor: 'white',
                borderRadius: '24px',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
                alignItems: 'center'
              }}
            >
              <Skeleton variant="rectangular" height={44} sx={{ width: { xs: '100%', md: 300 }, borderRadius: '12px' }} />
              <Box sx={{ display: 'flex', gap: 2, flex: 1, justifyContent: { xs: 'stretch', md: 'flex-end' }, width: '100%' }}>
                <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: '12px' }} />
                <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: '12px' }} />
                <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: '12px' }} />
              </Box>
            </Box>

            <Stack spacing={3}>
              {[...Array(4)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    borderRadius: '24px',
                    bgcolor: 'white',
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* TOP SECTION */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
                        <Box>
                           <Skeleton width={60} height={14} sx={{ mb: 0.5 }} />
                           <Skeleton width={100} height={20} />
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ height: 24, display: { xs: 'none', sm: 'block' } }} />
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                           <Skeleton width={60} height={14} sx={{ mb: 0.5 }} />
                           <Skeleton width={100} height={20} />
                        </Box>
                      </Stack>
                      <Box sx={{ textAlign: 'right' }}>
                         <Skeleton width={80} height={14} sx={{ mb: 0.5, ml: 'auto' }} />
                         <Skeleton width={120} height={35} sx={{ borderRadius: '8px' }} />
                      </Box>
                    </Box>

                    {/* BOTTOM SECTION */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, flex: 1, minWidth: 200 }}>
                        {[...Array(3)].map((_, j) => (
                          <Skeleton 
                            key={j} 
                            variant="rectangular" 
                            sx={{ width: { xs: 48, md: 56 }, height: { xs: 60, md: 70 }, borderRadius: '12px' }} 
                          />
                        ))}
                      </Box>
                      <Skeleton variant="rectangular" sx={{ width: { xs: '100%', sm: 120 }, height: 32, borderRadius: '8px' }} />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* Sidebar Skeleton */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ 
                borderRadius: '12px', 
                bgcolor: 'white', 
                border: '1px solid rgba(0,0,0,0.06)', 
                boxShadow: 'none',
                overflow: 'hidden'
              }}>
                <Box sx={{ p: 2, pb: 1.5 }}>
                   <Skeleton width="50%" height={24} />
                </Box>
                <Divider sx={{ borderColor: 'rgba(0,0,0,0.05)' }} />
                
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Skeleton width="40%" height={20} />
                    <Skeleton width="15%" height={24} />
                  </Box>
                </Box>

                {[...Array(4)].map((_, i) => (
                  <Box key={i}>
                    <Divider sx={{ borderColor: 'rgba(0,0,0,0.05)' }} />
                    <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Skeleton width={100} height={20} />
                      <Skeleton width={15} height={20} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
