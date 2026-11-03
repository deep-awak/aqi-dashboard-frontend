import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { formatLongDate } from '../../utils/format';

// Affiche l'analyse stockée d'une section. Elle est générée chaque jour côté serveur.
export default function AnalysisCard({ entry, title = 'Analyse IA' }) {
  const [open, setOpen] = useState(false);

  if (!entry) {
    return (
      <div className="analysis analysis-empty">
        <Sparkles size={16} />
        Analyse en attente : elle sera disponible après la prochaine génération quotidienne.
      </div>
    );
  }

  return (
    <div className="analysis">
      <div className="analysis-head">
        <p>
          <Sparkles size={16} />
          <strong>{title}</strong>
          <span className="muted small">· {formatLongDate(entry.generatedAt)}</span>
        </p>
        <button className="ghost" onClick={() => setOpen((o) => !o)}>
          {open ? 'Réduire' : 'Lire'}
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      <div className={`analysis-body ${open ? 'open' : ''}`}>{entry.content}</div>
    </div>
  );
}
