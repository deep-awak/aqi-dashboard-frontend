import { useMemo, useState } from 'react';
import { Box, Stack, IconButton, Typography, Paper, Collapse, CircularProgress, Snackbar, Alert } from '@mui/material';
import { AutoAwesome, ExpandMore, ExpandLess, ContentCopy } from '@mui/icons-material';
import { useAI } from '../../hooks/useAI';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function ChartAnalysis({ chartKey, data, prompt }) {
  const [expanded, setExpanded] = useState(false);
  const [analysis, setAnalysis] = useLocalStorage(`analysis_${chartKey}`, null);
  const [copied, setCopied] = useState(false);
  const { generateInsight, loading } = useAI();

  const compactData = useMemo(() => {
    if (!Array.isArray(data)) return data;
    return data.slice(-8).map((item) => ({ d: item?.d, aqi: item?.aqi, pm25: item?.pm25, pm10: item?.pm10, no2: item?.no2 }));
  }, [data]);

  const handleAnalyze = async () => {
    const result = await generateInsight([{ role: 'user', content: prompt }], { data: compactData });
    if (result) {
      setAnalysis(result);
      setExpanded(true);
    }
  };

  const copyAnalysis = async () => {
    if (!analysis) return;
    await navigator.clipboard.writeText(analysis);
    setCopied(true);
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
        <IconButton size="small" onClick={handleAnalyze} disabled={loading} sx={{ color: 'primary.main' }}>
          {loading ? <CircularProgress size={20} /> : <AutoAwesome fontSize="small" />}
        </IconButton>
        <Typography variant="caption" color="text.secondary">
          {loading ? 'Analyse en cours...' : analysis ? 'Analyse disponible' : 'Cliquez pour analyser'}
        </Typography>
        {analysis && (
          <>
            <IconButton size="small" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
            </IconButton>
            <IconButton size="small" onClick={copyAnalysis}>
              <ContentCopy fontSize="small" />
            </IconButton>
          </>
        )}
      </Stack>
      <Collapse in={expanded && !!analysis}>
        <Paper variant="outlined" sx={{ p: 1.5, mt: 1, bgcolor: 'background.paper', whiteSpace: 'pre-wrap', fontSize: '0.875rem', lineHeight: 1.6 }}>
          {analysis}
        </Paper>
      </Collapse>
      <Snackbar open={copied} autoHideDuration={1400} onClose={() => setCopied(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>Analyse copiée dans le presse-papiers.</Alert>
      </Snackbar>
    </Box>
  );
}