import { useState } from 'react';
import { Box, Stack, IconButton, Typography, Paper, Collapse, Snackbar, Alert } from '@mui/material';
import { AutoAwesome, ExpandMore, ExpandLess, ContentCopy } from '@mui/icons-material';
import { useAnalyses } from '../../hooks/useAnalyses';
import { formatAnalysisDate } from '../../utils/date';

export default function ChartAnalysis({ chartKey }) {
  const { analyses, loading } = useAnalyses();
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const entry = analyses[chartKey];

  const copyAnalysis = async () => {
    if (!entry) return;
    await navigator.clipboard.writeText(entry.content);
    setCopied(true);
  };

  let caption = 'Analyse bientôt disponible';
  if (loading) caption = 'Chargement…';
  else if (entry) caption = `Analyse du ${formatAnalysisDate(entry.generatedAt)}`;

  return (
    <Box sx={{ mt: 1 }}>
      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
        <IconButton
          size="small"
          onClick={() => setExpanded((v) => !v)}
          disabled={!entry}
          sx={{ color: 'primary.main' }}
          aria-label="Afficher l'analyse"
        >
          <AutoAwesome fontSize="small" />
        </IconButton>
        <Typography variant="caption" color="text.secondary">{caption}</Typography>
        {entry && (
          <>
            <IconButton size="small" onClick={() => setExpanded((v) => !v)} aria-label="Déplier">
              {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
            </IconButton>
            <IconButton size="small" onClick={copyAnalysis} aria-label="Copier l'analyse">
              <ContentCopy fontSize="small" />
            </IconButton>
          </>
        )}
      </Stack>

      <Collapse in={expanded && !!entry}>
        <Paper
          variant="outlined"
          sx={{ p: 1.5, mt: 1, bgcolor: 'background.paper', whiteSpace: 'pre-wrap', fontSize: '0.875rem', lineHeight: 1.6 }}
        >
          {entry?.content}
        </Paper>
      </Collapse>

      <Snackbar open={copied} autoHideDuration={1400} onClose={() => setCopied(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>Analyse copiée dans le presse-papiers.</Alert>
      </Snackbar>
    </Box>
  );
}
