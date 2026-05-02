import { Box, Skeleton, Card, CardContent } from '@mui/material';

interface CardSkeletonProps {
  hasAction?: boolean;
  hasRating?: boolean;
}

/**
 * Premium Generic Card Skeleton
 * Aligned with the ALPAC Eco-Luxury storefront grid
 */
export default function CardSkeleton({ 
  hasAction = true,
  hasRating = true
}: CardSkeletonProps) {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f5f3ec',
        borderRadius: { xs: '20px', sm: '24px' },
        px: { xs: 1, sm: 2 },
        pt: { xs: 1, sm: 2 },
        pb: { xs: 1, sm: 1.5 },
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
        height: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Skeleton
        variant="rectangular"
        sx={{
          width: '100%',
          aspectRatio: '0.85',
          borderRadius: { xs: '14px', sm: '18px' },
          bgcolor: '#f8f7f4', // Matches ProductCard image placeholder bg
          mb: { xs: 1, sm: 1.5 },
        }}
        animation="wave"
      />
      <CardContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Skeleton 
          variant="text" 
          width="40%" 
          height={14} 
          sx={{ mb: 1, bgcolor: 'rgba(0,0,0,0.03)' }} 
          animation="wave"
        />
        <Skeleton 
          variant="text" 
          width="90%" 
          height={28} 
          sx={{ mb: 1.5, bgcolor: 'rgba(0,0,0,0.05)' }} 
          animation="wave"
        />
        
        <Box sx={{ mt: 'auto', mb: 2 }}>
          {hasRating && (
            <Box sx={{ display: 'flex', gap: 0.8, mb: 1 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton 
                  key={i} 
                  variant="circular" 
                  width={14} 
                  height={14} 
                  sx={{ bgcolor: 'rgba(74, 103, 65, 0.08)' }} // Hint of botanical green
                  animation="wave"
                />
              ))}
            </Box>
          )}
          <Skeleton 
            variant="text" 
            width="35%" 
            height={32} 
            sx={{ bgcolor: 'rgba(45, 75, 56, 0.05)' }} 
            animation="wave"
          />
        </Box>

        {hasAction && (
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height={40} 
            sx={{ 
              borderRadius: '10px', 
              bgcolor: 'rgba(45, 75, 56, 0.08)' 
            }} 
            animation="wave"
          />
        )}
      </CardContent>
    </Card>
  );
}
