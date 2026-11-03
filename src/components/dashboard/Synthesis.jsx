import { formatLongDate } from '../../utils/format';
import AnalysisCard from './AnalysisCard';

// Découpe la synthèse en cartes : chaque partie commence par « 1. », « 2. », etc.
export default function Synthesis({ entry }) {
  if (!entry) return <AnalysisCard entry={null} title="Synthèse" />;

  const sections = entry.content
    .split(/\n(?=\d\s*[.)]\s)/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <>
      <p className="muted small">
        Générée le {formatLongDate(entry.generatedAt)} sur l’ensemble des données de Madagascar. Elle ne change pas avec les filtres.
      </p>
      <div className="synthesis-grid">
        {sections.map((section, i) => {
          const [headLine, ...rest] = section.split('\n');
          const title = headLine.replace(/^\d\s*[.)]\s*/, '');
          const body = rest.join('\n').trim();
          return (
            <article key={i} className="card synth-card">
              <span className="synth-num">{i + 1}</span>
              <h3>{title}</h3>
              {body && <p>{body}</p>}
            </article>
          );
        })}
      </div>
    </>
  );
}
