import { useState } from 'react';
import { Card, CardContent, Typography, Button, Stack, CircularProgress, Box, Snackbar, Alert } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { useAnalyses } from '../../hooks/useAnalyses';
import { formatAnalysisDate } from '../../utils/date';

export default function RecommendationsCard() {
  const { analyses, loading } = useAnalyses();
  const [copied, setCopied] = useState(false);
  const entry = analyses.synthesis;

  const copySynthesis = async () => {
    if (!entry) return;
    await navigator.clipboard.writeText(entry.content);
    setCopied(true);
  };

  let caption = 'Synthèse bientôt disponible';
  if (entry) caption = `Générée le ${formatAnalysisDate(entry.generatedAt)} sur l'ensemble des données`;

  return (
    <Card variant="outlined" sx={{ mt: 2, borderRadius: 1, bgcolor: 'background.paper' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} flexWrap="wrap">
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              Synthèse finale de l'analyse
            </Typography>
            <Typography variant="caption" color="text.secondary">{caption}</Typography>
          </Box>
          {entry && (
            <Button variant="outlined" size="small" startIcon={<ContentCopy />} onClick={copySynthesis}>
              Copier
            </Button>
          )}
        </Stack>

        <Box mt={2}>
          {loading ? (
            <CircularProgress size={24} />
          ) : entry ? (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: '0.95rem' }}>
              {entry.content}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              La synthèse est préparée chaque jour à partir des données de l'étude.
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
