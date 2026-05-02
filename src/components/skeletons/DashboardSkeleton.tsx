import { Box, Grid, Skeleton, Card, CardContent } from '@mui/material';

/**
 * Premium Dashboard Skeleton
 * Aligned with the ALPAC Eco-Luxury Admin Overview
 */
export default function DashboardSkeleton() {
  return (
    <Box>
      <Box sx={{ mb: 6 }}>
        <Skeleton variant="text" width={240} height={50} sx={{ mb: 1, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: '4px' }} animation="wave" />
        <Skeleton variant="text" width={180} height={20} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }} animation="wave" />
      </Box>

      {/* Alert Skeletons */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[1, 2].map((i) => (
          <Grid size={{ xs: 12, md: 6 }} key={i}>
            <Box sx={{ bgcolor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '24px', p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Skeleton variant="rectangular" width={44} height={44} sx={{ borderRadius: '12px', bgcolor: 'rgba(0,0,0,0.04)' }} />
                <Box>
                  <Skeleton width="120px" height={24} sx={{ mb: 0.5 }} />
                  <Skeleton width="220px" height={16} />
                </Box> 
              </Box>
              <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: '12px' }} />
            </Box>
          </Grid>
        ))}  
      </Grid>

      {/* Stats Matrix */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid size={{ xs: 6, md: 3 }} key={i}>
            <Card sx={{ borderRadius: '24px', boxShadow: 'none', border: '1px solid rgba(0,0,0,0.06)', bgcolor: 'white' }}>
              <CardContent sx={{ p: 3.5 }}>
                <Box sx={{ mb: 3 }}>
                   <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: '16px', bgcolor: 'rgba(0,0,0,0.03)' }} animation="wave" />
                </Box>
                <Skeleton variant="text" width="70%" height={52} sx={{ mb: 0.5, bgcolor: 'rgba(0,0,0,0.04)' }} animation="wave" />
                <Skeleton variant="text" width="40%" height={24} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }} animation="wave" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Insights Grid */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ borderRadius: '24px', boxShadow: 'none', border: '1px solid rgba(0,0,0,0.06)', height: 480 }}>
            <CardContent sx={{ p: 4.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Skeleton variant="text" width={180} height={32} sx={{ mb: 5, bgcolor: 'rgba(0,0,0,0.03)' }} animation="wave" />
              <Skeleton variant="rectangular" sx={{ flex: 1, width: '100%', borderRadius: '24px', bgcolor: 'rgba(0,0,0,0.015)' }} animation="wave" />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ borderRadius: '24px', boxShadow: 'none', border: '1px solid rgba(0,0,0,0.06)', height: 480 }}>
            <CardContent sx={{ p: 4.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Skeleton variant="text" width={140} height={32} sx={{ mb: 5, bgcolor: 'rgba(0,0,0,0.03)' }} animation="wave" />
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Skeleton variant="circular" width={240} height={240} sx={{ bgcolor: 'rgba(0,0,0,0.015)' }} animation="wave" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
