import { AppBar, IconButton, Toolbar, Typography, Box } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';

export default function CustomAppBar({ onToggleTheme, themeMode }) {
  return (
    <AppBar color="secondary" position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Air Quality Dashboard
        </Typography>
        <Box>
          <IconButton color="inherit" onClick={onToggleTheme}>
            {themeMode === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}