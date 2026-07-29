import { useMemo, useState } from 'react';
import { Admin, CustomRoutes, Layout } from 'react-admin';
import { Route } from 'react-router-dom';
import { dataProvider } from './dataProvider.js';
import { lightTheme, darkTheme } from './theme.js';
import Dashboard from './dashboard/Dashboard.jsx';
import ErrorBoundary from './components/Layout/ErrorBoundary.jsx';
import CustomAppBar from './components/Layout/CustomAppBar.jsx';

const MyCustomLayout = (props) => {
  const { onToggleTheme, themeMode } = props;
  return (
    <Layout
      {...props}
      appBar={() => <CustomAppBar onToggleTheme={onToggleTheme} themeMode={themeMode} />}
      sidebar={() => null}
      sx={{
        // 1. Force la barre de navigation à rester fixée tout en haut de la page
        '& .RaLayout-appBar': {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200, // S'assure de passer au-dessus des cartes et graphiques
        },
        // 2. Ajuste la zone de contenu pour qu'elle ne soit pas masquée sous la barre fixe
        '& .RaLayout-content': {
          padding: 0,
          paddingTop: '64px', // Hauteur standard d'une AppBar Material-UI (à ajuster si votre barre est plus haute)
          backgroundColor: 'background.default',
        },
        // 3. Nettoie les comportements de scroll par défaut du conteneur de React-Admin
        '& .RaLayout-contentWithSidebar': {
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }
      }}
    />
  );
};

export default function App() {
  const [mode, setMode] = useState('light');
  const theme = useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);
  const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ErrorBoundary>
      <Admin
        dataProvider={dataProvider}
        theme={theme}
        dashboard={Dashboard} 
        layout={(props) => <MyCustomLayout {...props} onToggleTheme={toggleTheme} themeMode={mode} />}
        title="Air Quality Analytics"
      >
        <CustomRoutes>
          <Route path="/" element={<Dashboard themeMode={mode} onToggleTheme={toggleTheme} />} />
        </CustomRoutes>
      </Admin>
    </ErrorBoundary>
  );
}
