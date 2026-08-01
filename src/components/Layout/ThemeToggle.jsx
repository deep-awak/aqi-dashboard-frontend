import { IconButton } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';

export default function ThemeToggle({ mode, onToggle }) {
  return (
    <IconButton color="primary" onClick={onToggle} size="small">
      {mode === 'dark' ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
}
