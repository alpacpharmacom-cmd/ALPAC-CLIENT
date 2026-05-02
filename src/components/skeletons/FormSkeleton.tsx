import { Box, Card, Skeleton, Container } from '@mui/material';

interface FormSkeletonProps {
  fields?: number;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  titleWidth?: string;
  hasFooter?: boolean;
}

/**
 * Premium Generic Form Skeleton
 * Matches the ALPAC 35px border-radius Auth Portals and Admin Forms
 */
export default function FormSkeleton({ 
  fields = 3, 
  maxWidth = 'sm', 
  titleWidth = '50%',
  hasFooter = true 
}: FormSkeletonProps) {
  return (
    <Box sx={{ minHeight: 'calc(100vh - 68px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', pt: { xs: 4, md: 6 }, pb: 8 }}>
      <Container maxWidth={maxWidth} sx={{ position: 'relative', zIndex: 1, maxWidth: maxWidth === 'sm' ? { sm: 500, md: 560 } : undefined }}>
        <Card 
          sx={{ 
            borderRadius: '24px', 
            boxShadow: '0 40px 100px rgba(0,0,0,0.08)', 
            border: '1px solid rgba(0,0,0,0.03)', 
            p: { xs: 4, sm: 6 },
            bgcolor: 'white'
          }}
        >
          {/* Header Skeleton */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Skeleton variant="text" width={titleWidth} height={16} sx={{ mx: 'auto', mb: 2, bgcolor: 'rgba(0,0,0,0.04)' }} animation="pulse" />
            <Skeleton variant="text" width="80%" height={60} sx={{ mx: 'auto', mb: 1, bgcolor: 'rgba(0,0,0,0.03)' }} animation="pulse" />
            <Skeleton variant="text" width="60%" height={20} sx={{ mx: 'auto', bgcolor: 'rgba(0,0,0,0.02)' }} animation="pulse" />
          </Box>

          {/* Form Fields Skeleton */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            {[...Array(fields)].map((_, i) => (
              <Box key={i}>
                <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: '12px', bgcolor: 'rgba(0,0,0,0.03)' }} animation="pulse" />
              </Box>
            ))}

            <Skeleton variant="text" width="40%" height={20} sx={{ ml: 'auto', bgcolor: 'rgba(0,0,0,0.02)' }} animation="pulse" />

            <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: '50px', mt: 1, bgcolor: 'rgba(0,0,0,0.05)' }} animation="pulse" />
          </Box>

          {/* Footer Area Skeleton */}
          {hasFooter && (
            <Box sx={{ mt: 5, pt: 4, borderTop: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
               <Skeleton variant="text" width="60%" height={20} sx={{ mx: 'auto', mb: 2, bgcolor: 'rgba(0,0,0,0.02)' }} animation="pulse" />
               <Skeleton variant="text" width="120px" height={24} sx={{ mx: 'auto', bgcolor: 'rgba(0,0,0,0.03)' }} animation="pulse" />
            </Box>
          )}
        </Card>
      </Container>
    </Box>
  );
}
