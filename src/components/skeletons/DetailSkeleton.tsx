import { Box, Container, Grid, Skeleton, Stack, Divider } from '@mui/material';

interface DetailSkeletonProps {
  type?: 'product' | 'order';
  isAdmin?: boolean;
}

/**
 * Premium Generic Detail Skeleton
 * Aligned with the ALPAC Management Console and Storefront Product pages
 */
export default function DetailSkeleton({ 
  type = 'product', 
  isAdmin = false 
}: DetailSkeletonProps) {
  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: isAdmin ? 0 : { xs: 2, md: 5 } }}>
        {/* Header/Navigation Skeleton */}
        <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="text" width={200} height={32} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }} />
          {isAdmin && (
             <Stack direction="row" spacing={2}>
               <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: '12px' }} />
               <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: '12px' }} />
             </Stack>
          )}
        </Box>

        {/* Primary Content Card Skeleton */}
        <Box 
          sx={{ 
            bgcolor: 'white', 
            border: '1px solid rgba(0,0,0,0.06)', 
            borderRadius: '24px', 
            p: { xs: 2, md: 5 }, 
            boxShadow: '0 10px 40px rgba(0,0,0,0.03)', 
            mb: 5 
          }}
        >
          <Grid container spacing={type === 'product' ? 8 : 4}>
            {/* Left Side: Visual or List */}
            <Grid size={{ xs: 12, md: type === 'product' ? 5 : 8 }}>
              {type === 'product' ? (
                <Skeleton
                  variant="rectangular"
                  sx={{
                    width: '100%',
                    aspectRatio: '0.85',
                    borderRadius: '24px',
                    bgcolor: 'rgba(0,0,0,0.03)',
                  }}
                  animation="pulse"
                />
              ) : (
                <Stack spacing={3}>
                  <Skeleton variant="text" width="40%" height={32} />
                  {[1, 2, 3].map(i => (
                    <Box key={i} sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                      <Skeleton variant="rectangular" width={60} height={75} sx={{ borderRadius: '12px' }} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton width="60%" height={24} sx={{ mb: 1 }} />
                        <Skeleton width="30%" height={16} />
                      </Box>
                      <Skeleton width={80} height={24} />
                    </Box>
                  ))}
                </Stack>
              )}
            </Grid>

            {/* Right Side: Info or Summary */}
            <Grid size={{ xs: 12, md: type === 'product' ? 7 : 4 }}>
              <Box>
                <Skeleton variant="text" width="90%" height={60} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="40%" height={40} sx={{ mb: 4 }} />
                
                <Divider sx={{ mb: 4, borderStyle: 'dashed' }} />
                
                <Stack spacing={2} sx={{ mb: 5 }}>
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} variant="text" width={i === 3 ? "70%" : "100%"} height={24} />
                  ))}
                </Stack>

                <Box sx={{ mt: 'auto' }}>
                  <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: '50px' }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Bottom Section: Specifics */}
        <Grid container spacing={4}>
          {[1, 2].map(i => (
            <Grid size={{ xs: 12, md: 6 }} key={i}>
              <Box sx={{ bgcolor: 'white', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '24px', p: { xs: 2, md: 4 }, boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
                <Skeleton width="150px" height={32} sx={{ mb: 3 }} />
                <Stack spacing={2}>
                   {[1, 2].map(j => (
                     <Box key={j} sx={{ display: 'flex', gap: 2 }}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Box sx={{ flex: 1 }}>
                           <Skeleton width="120px" height={20} sx={{ mb: 0.5 }} />
                           <Skeleton width="100%" height={16} />
                        </Box>
                     </Box>
                   ))}
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
