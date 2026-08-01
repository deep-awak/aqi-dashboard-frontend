import { Component } from 'react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error.message || 'Une erreur inattendue est survenue.' };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
          <Alert severity="error" sx={{ maxWidth: 560 }}>
            <Stack spacing={1.5}>
              <Typography variant="h6">Une erreur a interrompu l’affichage du tableau de bord.</Typography>
              <Typography variant="body2">{this.state.message}</Typography>
              <Button variant="contained" onClick={() => window.location.reload()}>
                Recharger l’application
              </Button>
            </Stack>
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}
