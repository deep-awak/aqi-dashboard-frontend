import { useState, useRef, useEffect } from 'react';
import {
  Box, Drawer, Stack, Typography, Chip, IconButton, Paper,
  TextareaAutosize, CircularProgress, Button, Divider,
} from '@mui/material';
import { Close, Send, AutoAwesome, Check } from '@mui/icons-material';
import { useAI } from '../../hooks/useAI';
import { useDashboard } from '../../contexts/DashboardContext';

const SUGGESTIONS = [
  'Affiche l\'AQI à Paris',
  'Compare Paris et Tokyo',
  'Montre l\'évolution du PM2.5',
  'Filtre sur le week-end',
  'Donne les tendances récentes',
];

export default function AssistantDrawer({ open, onClose, onApplyActions }) {
  const dashboardData = useDashboard();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Bonjour ! Je suis votre assistant. Posez-moi des questions ou demandez-moi de modifier le tableau de bord.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingActions, setPendingActions] = useState(null);
  const messagesEndRef = useRef(null);
  const { generateInsight } = useAI();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = async (content) => {
    const userMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setPendingActions(null);

    const result = await generateInsight(
      [...messages, userMessage],
      dashboardData
    );

    if (result) {
      const assistantContent = result.content || result;
      const actions = result.actions || null;

      const assistantMessage = { role: 'assistant', content: assistantContent };
      setMessages(prev => [...prev, assistantMessage]);

      if (actions && actions.length > 0) {
        setPendingActions(actions);
      }
    } else {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Désolé, une erreur est survenue.' }]);
    }
    setLoading(false);
  };

  const handleApplyActions = () => {
    if (pendingActions && onApplyActions) {
      onApplyActions(pendingActions);
      setPendingActions(null);
      setMessages(prev => [...prev, { role: 'assistant', content: '✅ Actions appliquées avec succès !' }]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 420 } } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* En-tête */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <AutoAwesome sx={{ color: '#7c3aed' }} />
            <Typography variant="h6" fontWeight={700}>Assistant IA</Typography>
            <Chip label="Gemini" size="small" sx={{ bgcolor: '#7c3aed', color: 'white' }} />
          </Stack>
          <IconButton onClick={onClose}><Close /></IconButton>
        </Stack>

        {/* Messages */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: '#f9fafb' }}>
          {messages.map((msg, idx) => (
            <Box key={idx} sx={{ mb: 2, display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <Paper elevation={0} sx={{ p: 1.5, maxWidth: '80%', borderRadius: 2, bgcolor: msg.role === 'user' ? '#2563eb' : 'white', color: msg.role === 'user' ? 'white' : 'text.primary', border: msg.role === 'assistant' ? '1px solid #e5e7eb' : 'none', whiteSpace: 'pre-wrap' }}>
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
          {pendingActions && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
              <Button variant="contained" color="primary" startIcon={<Check />} onClick={handleApplyActions}>
                Appliquer les modifications proposées
              </Button>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

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
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={loading}
                sx={{ bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#e2e8f0' }, marginBottom: 0.5 }}
              />
            ))}
          </Stack>
        </Box>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'white' }}>
          <Stack direction="row" spacing={1}>
            <TextareaAutosize
              minRows={2}
              maxRows={4}
              placeholder="Posez votre question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
              }}
              style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.9rem', resize: 'none', fontFamily: 'inherit' }}
            />
            <IconButton color="primary" onClick={handleSend} disabled={loading || !input.trim()} sx={{ alignSelf: 'flex-end', bgcolor: '#2563eb', color: 'white', '&:hover': { bgcolor: '#1d4ed8' } }}>
              <Send />
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
}