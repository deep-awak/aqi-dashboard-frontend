import { useEffect, useRef, useState } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { useAI } from '../../hooks/useAI';
import { loadSettings, saveSettings, clearSettings, isRemembered } from '../../utils/aiSettings';

const PROVIDERS = [
  { value: 'gemini', label: 'Gemini' },
  { value: 'deepseek', label: 'DeepSeek' },
];

const SUGGESTIONS = [
  'Quelle région est la plus polluée ?',
  "Quelle est la tendance de l'AQI ?",
  'Compare Analamanga et Atsinanana',
  'Quels sont les niveaux de PM2.5 ?',
  'Y a-t-il une différence semaine / week-end ?',
];

const GREETING = {
  role: 'assistant',
  content:
    'Bonjour ! Je peux répondre à vos questions sur les données affichées. Pour cela, saisissez votre clé API Gemini ou DeepSeek ci-dessus.',
};

const providerLabel = (value) => PROVIDERS.find((p) => p.value === value)?.label ?? value;

// Contexte allégé : seulement ce qui sert aux réponses.
function buildContext({ kpis, series, summary, histo, weekday, filters }) {
  return {
    kpis,
    series: series.slice(-30),
    regions: summary,
    histo,
    weekday,
    filters,
  };
}

export default function AssistantDrawer({ open, onClose, dashboard }) {
  const { ask, loading } = useAI();
  const [settings, setSettings] = useState(() => loadSettings());
  const [draftProvider, setDraftProvider] = useState('gemini');
  const [draftKey, setDraftKey] = useState('');
  const [remember, setRemember] = useState(false);
  const [formError, setFormError] = useState('');
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!open) return null;

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
        messages: next.filter((m) => !m.error).map(({ role, content: text }) => ({ role, content: text })),
        context: buildContext(dashboard),
        provider: settings.provider,
        apiKey: settings.apiKey,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Erreur : ${err.message}`, error: true }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside className="drawer" role="dialog" aria-label="Assistant IA" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <div className="card-title">
            <span className="icon-bubble">
              <Bot size={18} />
            </span>
            <div>
              <h2>Assistant IA</h2>
              <p className="muted small">{settings ? `Fournisseur : ${providerLabel(settings.provider)}` : 'Clé API requise'}</p>
            </div>
          </div>
          <button className="ghost" onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </button>
        </div>

        {settings ? (
          <div className="key-box">
            <p className="drawer-note">
              Clé {providerLabel(settings.provider)} enregistrée {isRemembered() ? 'sur cet appareil' : 'pour cette session'}.
            </p>
            <button className="ghost" onClick={handleClearKey}>
              Effacer la clé
            </button>
          </div>
        ) : (
          <div className="key-box">
            <p className="drawer-note">
              Saisissez votre propre clé API. Elle reste dans votre navigateur et sert uniquement à vos questions.
              Elle transite par le serveur du site pour appeler le fournisseur, sans être stockée ni journalisée.
            </p>
            <label>
              Fournisseur
              <select value={draftProvider} onChange={(e) => setDraftProvider(e.target.value)}>
                {PROVIDERS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Clé API
              <input
                type="password"
                value={draftKey}
                onChange={(e) => setDraftKey(e.target.value)}
                autoComplete="off"
              />
            </label>
            <label className="checkbox">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              &nbsp;Mémoriser sur cet appareil
            </label>
            {formError && <p className="notice notice-warn">{formError}</p>}
            <button className="primary" onClick={handleSaveKey} disabled={!draftKey.trim()}>
              Enregistrer la clé
            </button>
          </div>
        )}

        <div className="drawer-body">
          {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.role} ${msg.error ? 'error' : ''}`}>
              {msg.content}
            </div>
          ))}
          {loading && <div className="msg assistant muted">Réflexion en cours…</div>}
          <div ref={endRef} />
        </div>

        <div className="suggestions">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => sendMessage(s)} disabled={loading || !settings}>
              {s}
            </button>
          ))}
        </div>

        <div className="composer">
          <textarea
            rows={2}
            value={input}
            disabled={!settings || loading}
            placeholder={settings ? 'Posez votre question…' : 'Enregistrez une clé API pour poser une question'}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={() => sendMessage(input)} disabled={loading || !settings || !input.trim()} aria-label="Envoyer">
            <Send size={18} />
          </button>
        </div>
      </aside>
    </div>
  );
}
