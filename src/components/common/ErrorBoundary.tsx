import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { ErrorOutlined } from '@mui/icons-material';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              textAlign: 'center',
              gap: 3,
            }}
          >
            <ErrorOutlined sx={{ fontSize: 80, color: '#c0392b' }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                Something went wrong
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We've encountered an unexpected error. Please try refreshing the page.
              </Typography>
              {import.meta.env.MODE !== 'production' && (
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 2,
                    p: 2,
                    bgcolor: '#f5f5f5',
                    borderRadius: 1,
                    textAlign: 'left',
                    fontFamily: 'monospace',
                    color: '#c0392b',
                    overflowX: 'auto',
                  }}
                >
                  {this.state.error?.toString()}
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{ bgcolor: '#2D4B38', '&:hover': { bgcolor: '#1A2E1F' } }}
            >
              Refresh Page
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
