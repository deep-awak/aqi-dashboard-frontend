import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  alpha,
  Popover,
  IconButton,
  Divider,
} from '@mui/material';
import { InfoOutlined, Close } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Sparkline } from '../Charts.jsx';
import { aqiQualityLabel } from '../../lib/insights.js';

// --- Informations contextuelles pour chaque métrique ---
const METRIC_INFO = {
  aqi: {
    title: 'Indice AQI (1-5)',
    description:
      "L'Indice de Qualité de l'Air (AQI) est un indicateur synthétique qui agrège les concentrations de plusieurs polluants (PM2.5, PM10, NO2, O3, etc.) en un score unique de 1 à 5. " +
      "Il permet une évaluation rapide de la qualité de l'air globale.",
    usage:
      'Utilisé comme référence pour la santé publique et les prises de décision environnementales. Un score bas indique une bonne qualité, un score élevé une alerte.',
  },
  pm25: {
    title: 'Particules fines PM2.5 (µg/m³)',
    description:
      "Les PM2.5 sont des particules en suspension de diamètre inférieur à 2,5 micromètres. Elles sont particulièrement nocives car elles pénètrent profondément dans les voies respiratoires.",
    usage:
      "Provenant principalement des moteurs diesel, des industries, du chauffage au bois et des feux de forêt. Leur suivi est essentiel pour la santé respiratoire.",
  },
  pm10: {
    title: 'Particules PM10 (µg/m³)',
    description:
      "Les PM10 sont des particules de diamètre inférieur à 10 micromètres. Bien que moins fines que les PM2.5, elles restent irritantes pour les voies respiratoires.",
    usage:
      'Émises par les chantiers, l’usure des routes, l’agriculture et les industries. Leur mesure est un indicateur de pollution urbaine.',
  },
  no2: {
    title: 'Dioxyde d’azote NO₂ (µg/m³)',
    description:
      "Le dioxyde d'azote est un gaz irritant produit principalement par la combustion des carburants (transport, centrales thermiques).",
    usage:
      "Exposé à des concentrations élevées, il peut aggraver les affections pulmonaires et cardiovasculaires. Il est aussi un précurseur de l'ozone troposphérique.",
  },
};

export default function AnimatedMetric({
  value,
  label,
  icon: Icon,
  color,
  bg,
  sparkData,
  kpiKey,
  totalMeasurements,
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // ---- Animation du compteur ----
  useEffect(() => {
    const target = parseFloat(value) || 0;
    const duration = 600;
    const startTime = performance.now();
    const startVal = prevValue.current;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (target - startVal) * eased;
      setDisplayValue(current);
      if (progress < 1) requestAnimationFrame(animate);
      else {
        setDisplayValue(target);
        prevValue.current = target;
      }
    };
    requestAnimationFrame(animate);
  }, [value]);

  // ---- Couleurs dynamiques ----
  const isAqi = kpiKey === 'aqi';
  const quality = isAqi ? aqiQualityLabel(parseFloat(value)) : '';
  const colorMap = {
    Bonne: '#22c55e',
    Moyenne: '#facc15',
    Dégradée: '#f97316',
    Mauvaise: '#ef4444',
    'Très mauvaise': '#7f1d1d',
  };
  const dynamicColor = isAqi ? colorMap[quality] || color : color;
  const gradientBg = `linear-gradient(135deg, ${alpha(dynamicColor, 0.08)} 0%, ${alpha(dynamicColor, 0.02)} 100%)`;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const info = METRIC_INFO[kpiKey] || {
    title: label,
    description: 'Métrique de qualité de l’air.',
    usage: 'Permet de suivre les tendances de la pollution.',
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ height: '100%', cursor: 'pointer', width: '100%' }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        onClick={handleClick}
      >
        <Card
          variant="outlined"
          sx={{
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            background: gradientBg,
            borderColor: alpha(dynamicColor, 0.2),
            transition: 'box-shadow 0.3s, border-color 0.3s',
            '&:hover': {
              boxShadow: `0 8px 24px ${alpha(dynamicColor, 0.15)}`,
              borderColor: dynamicColor,
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, ${dynamicColor}, ${alpha(dynamicColor, 0.4)})`,
            }}
          />

          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              pt: 2.5,
              pb: 1.5,
              px: 2,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
                sx={{ fontSize: '0.7rem', letterSpacing: 0.5 }}
              >
                {label}
              </Typography>
              <Box
                sx={{
                  bgcolor: alpha(dynamicColor, 0.12),
                  borderRadius: 2,
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'rotate(8deg) scale(1.1)' },
                }}
              >
                <Icon sx={{ color: dynamicColor, fontSize: 18 }} />
              </Box>
            </Stack>

            <Typography
              variant="h5"
              fontWeight={800}
              mt={0.5}
              sx={{
                color: dynamicColor,
                fontSize: '1.8rem',
                letterSpacing: '-0.5px',
                lineHeight: 1.2,
              }}
            >
              {isAqi ? displayValue.toFixed(1) : displayValue.toFixed(0)}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
              {isAqi && (
                <Chip
                  label={quality}
                  size="small"
                  sx={{
                    bgcolor: alpha(dynamicColor, 0.15),
                    color: dynamicColor,
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    height: 20,
                    '& .MuiChip-label': { px: 1, py: 0 },
                  }}
                />
              )}
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                {!isAqi && `sur ${totalMeasurements?.toLocaleString('fr-FR') ?? 0} mesures`}
              </Typography>
            </Stack>

            <Box sx={{ mt: 'auto', pt: 1 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Sparkline
                  data={(sparkData || []).map((s) => ({ v: s[kpiKey] ?? 0 }))}
                  color={dynamicColor}
                  gradient
                  showPoints
                />
              </motion.div>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            maxWidth: 420,
            p: 2,
            borderRadius: 1,
            bgcolor: 'background.paper',
            boxShadow: 24,
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Icon sx={{ color: dynamicColor, fontSize: 24 }} />
            <Typography variant="h6" fontWeight={700}>
              {info.title}
            </Typography>
          </Stack>
          <IconButton size="small" onClick={handleClose}>
            <Close fontSize="small" />
          </IconButton>
        </Stack>

        <Divider sx={{ mb: 1.5 }} />

        <Typography variant="body2" sx={{ mb: 1.5, lineHeight: 1.6 }}>
          {info.description}
        </Typography>

        <Box
          sx={{
            bgcolor: alpha(dynamicColor, 0.06),
            borderRadius: 2,
            p: 1.5,
            mb: 1.5,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} color={dynamicColor}>
            📌 Utilisation :
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {info.usage}
          </Typography>
        </Box>

        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Évolution récente
          </Typography>
          <Box sx={{ height: 60 }}>
            <Sparkline
              data={(sparkData || []).map((s) => ({ v: s[kpiKey] ?? 0 }))}
              color={dynamicColor}
              gradient
              showPoints
            />
          </Box>
        </Box>

        {/* Valeur actuelle (rappel) */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'right' }}>
          Valeur actuelle :{' '}
          <strong style={{ color: dynamicColor }}>
            {isAqi ? displayValue.toFixed(1) : displayValue.toFixed(0)}
          </strong>
        </Typography>
      </Popover>
    </>
  );
}