import { Box, Skeleton } from '@mui/material';

interface ColumnConfig {
  label?: string;
  flex: number;
  align?: 'left' | 'center' | 'right';
  variant?: 'text' | 'circular' | 'rectangular';
}

interface TableSkeletonProps {
  rows?: number;
  columns?: ColumnConfig[];
  hasHeader?: boolean;
}

/**
 * Premium Configurable Table Skeleton
 * Aligned with the ALPAC Eco-Luxury 24px radius design system
 */
export default function TableSkeleton({ 
  rows = 6, 
  columns = [
    { flex: 3, align: 'left', variant: 'circular' }, // Identity/Image + Text
    { flex: 2, align: 'left', variant: 'text' },
    { flex: 1.2, align: 'center', variant: 'rectangular' },
    { flex: 1.2, align: 'center', variant: 'text' },
    { flex: 1, align: 'right', variant: 'circular' }, // Actions
  ],
  hasHeader = true
}: TableSkeletonProps) {
  return (
    <Box 
      sx={{ 
        width: '100%', 
        bgcolor: 'white', 
        borderRadius: '24px', 
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.03)'
      }}
    >
      {/* Header Skeleton */}
      {hasHeader && (
        <Box 
          sx={{ 
            display: 'flex', 
            px: 3, 
            py: 1.5, 
            bgcolor: 'rgba(45, 75, 56, 0.02)', 
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            minWidth: 900 
          }}
        >
          {columns.map((col, idx) => (
            <Box 
              key={`header-${idx}`} 
              sx={{ 
                flex: col.flex, 
                display: 'flex', 
                justifyContent: col.align === 'center' ? 'center' : col.align === 'right' ? 'flex-end' : 'flex-start',
                mx: col.align === 'center' ? 1 : 0
              }}
            >
              <Skeleton 
                variant="text" 
                width="60%" 
                height={20} 
                sx={{ bgcolor: 'rgba(0,0,0,0.04)' }} 
              />
            </Box>
          ))}
        </Box>
      )}

      {/* Row List Skeleton */}
      <Box sx={{ minWidth: 900 }}>
        {[...Array(rows)].map((_, i) => (
          <Box 
            key={i} 
            sx={{ 
              px: 3, 
              py: 1.5, 
              display: 'flex', 
              alignItems: 'center',
              borderBottom: i === rows - 1 ? 'none' : '1px solid rgba(0,0,0,0.04)' 
            }}
          >
            {columns.map((col, idx) => (
              <Box 
                key={`row-${idx}`} 
                sx={{ 
                  flex: col.flex, 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: col.align === 'center' ? 'center' : col.align === 'right' ? 'flex-end' : 'flex-start',
                  gap: 2,
                  mx: col.align === 'center' ? 1 : 0
                }}
              >
                {col.variant === 'circular' ? (
                  <>
                    <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }} />
                    {idx === 0 && <Skeleton variant="text" width="60%" height={24} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }} />}
                  </>
                ) : col.variant === 'rectangular' ? (
                  <Skeleton variant="rectangular" width="80%" height={28} sx={{ borderRadius: '12px', bgcolor: 'rgba(0,0,0,0.02)' }} />
                ) : (
                  <Skeleton variant="text" width="70%" height={20} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }} />
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
