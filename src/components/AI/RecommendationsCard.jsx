import { useMemo, useState } from 'react';
import { Card, CardContent, Typography, Button, Stack, CircularProgress, Box, Snackbar, Alert } from '@mui/material';
import { AutoAwesome, ContentCopy } from '@mui/icons-material';
import { useAI } from '../../hooks/useAI';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useDashboard } from '../../contexts/DashboardContext';

export default function RecommendationsCard() {
  const { kpis, series, citySummary, weekdayRaw, filters, histo } = useDashboard();
  const [synthesis, setSynthesis] = useLocalStorage('synthesis_ia', null);
  const [copied, setCopied] = useState(false);
  const { generateInsight, loading } = useAI();

  const compactContext = useMemo(() => ({
    kpis,
    series: series?.slice(-20),
    citySummary,
    weekday: weekdayRaw,
    histo,
    filters,
  }), [citySummary, filters, kpis, series, weekdayRaw, histo]);

  const handleGenerate = async () => {
    const prompt = `À partir des données fournies (indicateurs globaux, tendances temporelles, répartition par ville, distribution des niveaux d'AQI, répartition semaine/week-end), réalise une synthèse complète de l'état de la qualité de l'air.

Structure ta réponse en plusieurs parties :
1. **État général** : description globale des niveaux de pollution (AQI, PM2.5, PM10, NO2) et tendances récentes.
2. **Analyse par ville** : comparaison entre les villes, identification des plus polluées et des moins polluées.
3. **Facteurs temporels** : différences entre semaine et week-end, évolution dans le temps (pics, périodes critiques).
4. **Causes probables** : à partir des données, propose des hypothèses sur les origines de la pollution (trafic, activités industrielles, conditions météo, etc.).
5. **Conclusion** : bilan global et perspectives.

Rédige en français, de manière claire et structurée, sans markdown (ni #, ni **). Utilise des retours à la ligne pour les sections.`;

    const result = await generateInsight([{ role: 'user', content: prompt }], compactContext);
    if (result) setSynthesis(result);
  };

  const copySynthesis = async () => {
    if (!synthesis) return;
    await navigator.clipboard.writeText(synthesis);
    setCopied(true);
  };

  return (
    <Card variant="outlined" sx={{ mt: 2, borderRadius: 1, bgcolor: 'background.paper' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} flexWrap="wrap">
          <Typography variant="subtitle1" fontWeight={700}>
            Synthèse finale de l'analyse
          </Typography>
          <Stack direction="row" spacing={1}>
            {synthesis ? (
              <Button variant="outlined" size="small" startIcon={<ContentCopy />} onClick={copySynthesis}>
                Copier
              </Button>
            ) : null}
            <Button
              variant="contained"
              size="small"
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AutoAwesome />}
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? 'Génération en cours...' : synthesis ? 'Régénérer' : 'Générer la synthèse'}
            </Button>
          </Stack>
        </Stack>

        <Box mt={2}>
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" color="text.secondary">L'IA analyse les données et prépare la synthèse...</Typography>
            </Box>
          ) : synthesis ? (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: '0.95rem' }}>
              {synthesis}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Cliquez sur le bouton pour générer une synthèse complète des causes, tendances et conclusions de l'étude de la qualité de l'air.
            </Typography>
          )}
        </Box>
      </CardContent>
      <Snackbar open={copied} autoHideDuration={1400} onClose={() => setCopied(false)}>
        <Alert severity="success">Synthèse copiée dans le presse-papiers.</Alert>
      </Snackbar>
    </Card>
  );
}