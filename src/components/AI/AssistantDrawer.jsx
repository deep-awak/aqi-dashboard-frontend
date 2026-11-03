import { useState, useRef, useEffect } from 'react';
import {
  Box, Drawer, Stack, Typography, Chip, IconButton, Paper, Button, TextField, MenuItem,
  FormControlLabel, Checkbox, TextareaAutosize, CircularProgress, Alert,
} from '@mui/material';
import { Close, Send, AutoAwesome } from '@mui/icons-material';
import { useAI } from '../../hooks/useAI';
import { useDashboard } from '../../contexts/DashboardContext';
import { loadSettings, saveSettings, clearSettings, isRemembered } from '../../utils/aiSettings';

const PROVIDERS = [
  { value: 'gemini', label: 'Gemini' },
  { value: 'deepseek', label: 'DeepSeek' },
];

const SUGGESTIONS = [
  'Quelle est la ville la plus polluée ?',
  "Quelle est la tendance de l'AQI ?",
  'Compare Paris et Tokyo',
  'Donne les niveaux de PM2.5',
  'Résumé de la situation actuelle',
  'Y a-t-il des différences entre semaine et week-end ?',
];

const GREETING = {
  role: 'assistant',
  content: 'Bonjour ! Je suis votre assistant. Pour me poser des questions, saisissez votre propre clé API ci-dessus.',
};

function buildContext({ kpis, series, citySummary, weekdayRaw, filters, histo }) {
  return {
    kpis,
    series: series?.slice(-30),
    citySummary,
    weekday: weekdayRaw,
    filters,
    histo,
  };
}

const providerLabel = (value) => PROVIDERS.find((p) => p.value === value)?.label ?? value;

export default function AssistantDrawer({ open, onClose }) {
  const dashboardData = useDashboard();
  const { ask, loading } = useAI();

  const [settings, setSettings] = useState(() => loadSettings());
  const [draftProvider, setDraftProvider] = useState('gemini');
  const [draftKey, setDraftKey] = useState('');
  const [remember, setRemember] = useState(false);
  const [formError, setFormError] = useState('');

  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSaveKey = () => {
    const key = draftKey.trim();
    if (key.length < 10) {
      setFormError('Cette clé semble trop courte. Vérifiez-la.');
      return;
    }
    const next = { provider: draftProvider, apiKey: key };
    saveSettings(next, remember);
    setSettings(next);
    setDraftKey('');
    setFormError('');
  };

  const handleClearKey = () => {
    clearSettings();
    setSettings(null);
  };

  const sendMessage = async (raw) => {
    const content = raw.trim();
    if (!content || loading || !settings) return;

    const next = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');

    try {
      const reply = await ask({
        messages: next
          .filter((m) => !m.error)
          .map(({ role, content: text }) => ({ role, content: text })),
        context: buildContext(dashboardData),
        provider: settings.provider,
        apiKey: settings.apiKey,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Erreur : ${err.message}`, error: true },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 420 } } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* En-tête */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <AutoAwesome sx={{ color: '#7c3aed' }} />
            <Typography variant="h6" fontWeight={700}>Assistant IA</Typography>
            <Chip
              label={settings ? providerLabel(settings.provider) : 'Clé requise'}
              size="small"
              sx={{ bgcolor: '#7c3aed', color: 'white' }}
            />
          </Stack>
          <IconButton onClick={onClose} aria-label="Fermer">
            <Close />
          </IconButton>
        </Stack>

        {/* Clé API du visiteur */}
        {settings ? (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider', bgcolor: 'white' }}
          >
            <Typography variant="caption" color="text.secondary">
              Clé {providerLabel(settings.provider)} enregistrée{' '}
              {isRemembered() ? 'sur cet appareil' : 'pour cette session'}.
            </Typography>
            <Button size="small" color="inherit" onClick={handleClearKey}>
              Effacer la clé
            </Button>
          </Stack>
        ) : (
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'white' }}>
            <Typography variant="body2" sx={{ mb: 1.5 }}>
              Saisissez votre clé API Gemini ou DeepSeek. Elle reste dans votre navigateur et sert uniquement
              à vos questions. Elle transite par le serveur du site pour l'appel au fournisseur, sans être
              stockée ni journalisée.
            </Typography>
            <Stack spacing={1.5}>
              <TextField
                select
                size="small"
                label="Fournisseur"
                value={draftProvider}
                onChange={(e) => setDraftProvider(e.target.value)}
              >
                {PROVIDERS.map((p) => (
                  <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                ))}
              </TextField>
              <TextField
                size="small"
                type="password"
                label="Clé API"
                value={draftKey}
                onChange={(e) => setDraftKey(e.target.value)}
                autoComplete="off"
              />
              <FormControlLabel
                control={
                  <Checkbox size="small" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                }
                label={<Typography variant="caption">Mémoriser sur cet appareil</Typography>}
              />
              {formError && <Alert severity="error">{formError}</Alert>}
              <Button variant="contained" onClick={handleSaveKey} disabled={!draftKey.trim()}>
                Enregistrer la clé
              </Button>
            </Stack>
          </Box>
        )}

        {/* Messages */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: '#f9fafb' }}>
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              sx={{ mb: 2, display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  maxWidth: '80%',
                  borderRadius: 2,
                  bgcolor: msg.role === 'user' ? '#2563eb' : 'white',
                  color: msg.role === 'user' ? 'white' : msg.error ? 'error.main' : 'text.primary',
                  border: msg.role === 'assistant' ? '1px solid #e5e7eb' : 'none',
                  whiteSpace: 'pre-wrap',
                }}
              >
                <Typography variant="body2">{msg.content}</Typography>
              </Paper>
            </Box>
          ))}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
              <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'white', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                <CircularProgress size={20} />
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Suggestions */}
        <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', bgcolor: 'white' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Suggestions :
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {SUGGESTIONS.map((suggestion) => (
              <Chip
                key={suggestion}
                label={suggestion}
                size="small"
                clickable
                onClick={() => sendMessage(suggestion)}
                disabled={loading || !settings}
                sx={{ bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#e2e8f0' }, marginBottom: 0.5 }}
              />
            ))}
          </Stack>
        </Box>

        {/* Saisie */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'white' }}>
          <Stack direction="row" spacing={1}>
            <TextareaAutosize
              minRows={2}
              maxRows={4}
              placeholder={settings ? 'Posez votre question...' : 'Enregistrez une clé API pour poser une question'}
              value={input}
              disabled={!settings || loading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                fontSize: '0.9rem',
                resize: 'none',
                fontFamily: 'inherit',
              }}
            />
            <IconButton
              onClick={() => sendMessage(input)}
              disabled={loading || !settings || !input.trim()}
              aria-label="Envoyer"
              sx={{
                alignSelf: 'flex-end',
                bgcolor: '#2563eb',
                color: 'white',
                '&:hover': { bgcolor: '#1d4ed8' },
                '&.Mui-disabled': { bgcolor: '#cbd5e1', color: 'white' },
              }}
            >
              <Send />
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
}
