import { useMemo, useState } from 'react';
import { Map as MapIcon, TrendingUp, BarChart3, CalendarDays, Sparkles, MapPin, RefreshCw } from 'lucide-react';
import { useDashboardData } from './hooks/useDashboardData';
import { useAnalyses } from './hooks/useAnalyses';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Hero from './components/dashboard/Hero';
import KpiCards from './components/dashboard/KpiCards';
import TrendChart from './components/dashboard/TrendChart';
import MadagascarMap from './components/dashboard/MadagascarMap';
import RegionRanking from './components/dashboard/RegionRanking';
import Distribution from './components/dashboard/Distribution';
import WeekdayCompare from './components/dashboard/WeekdayCompare';
import AnalysisCard from './components/dashboard/AnalysisCard';
import Synthesis from './components/dashboard/Synthesis';
import AssistantDrawer from './components/assistant/AssistantDrawer';
import { Card, CardHeader, Notice } from './components/common/ui';

const ERROR_LABELS = {
  kpis: 'indicateurs',
  series: 'tendances',
  summary: 'régions',
  histo: 'répartition',
  weekday: 'semaine / week-end',
};

export default function App() {
  const [region, setRegion] = useState('all');
  const [weekend, setWeekend] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [assistantOpen, setAssistantOpen] = useState(false);

  const data = useDashboardData({ city: region, weekend, refreshKey });
  const { analyses, loading: analysesLoading } = useAnalyses();

  const regionItems = useMemo(
    () => [...data.summary].sort((a, b) => a.city_name.localeCompare(b.city_name, 'fr')),
    [data.summary]
  );
  const regions = useMemo(() => regionItems.map((r) => r.city_name), [regionItems]);
  const lastDate = data.series.at(-1)?.d;
  const scopeLabel = region === 'all' ? 'Madagascar entier' : `Région : ${region}`;
  const failed = Object.keys(data.errors).map((k) => ERROR_LABELS[k] || k);

  const dashboard = {
    kpis: data.kpis,
    series: data.series,
    summary: data.summary,
    histo: data.histo,
    weekday: data.weekday,
    filters: { region, weekend },
  };

  return (
    <div className="app">
      <Sidebar
        kpis={data.kpis}
        scopeLabel={scopeLabel}
        regions={regionItems}
        selected={region}
        onSelect={setRegion}
        onOpenAssistant={() => setAssistantOpen(true)}
      />

      <main className="main">
        <TopBar
          region={region}
          regions={regions}
          onRegion={setRegion}
          weekend={weekend}
          onWeekend={setWeekend}
          onRefresh={() => setRefreshKey((k) => k + 1)}
          loading={data.loading}
          onOpenAssistant={() => setAssistantOpen(true)}
        />

        {data.loading && (
          <Notice>
            Chargement des données. Le serveur peut mettre environ une minute à démarrer après une période d’inactivité.
          </Notice>
        )}

        {failed.length > 0 && !data.loading && (
          <Notice tone="warn">
            Certaines données n’ont pas pu être chargées ({failed.join(', ')}).
            <button className="link" onClick={() => setRefreshKey((k) => k + 1)}>
              <RefreshCw size={14} /> Réessayer
            </button>
          </Notice>
        )}

        <Hero
          kpis={data.kpis}
          scopeLabel={scopeLabel}
          lastDate={lastDate}
          synthesis={analyses.synthesis}
          onReadSynthesis={() => document.getElementById('synthese')?.scrollIntoView({ behavior: 'smooth' })}
        />

        <KpiCards kpis={data.kpis} series={data.series} />

        <Card id="tendances">
          <CardHeader
            icon={TrendingUp}
            title="Évolution dans le temps"
            subtitle="Moyenne journalière. La ligne rouge indique le repère de l’OMS quand il existe."
          />
          <TrendChart series={data.series} />
          <AnalysisCard entry={analyses.timeseries} title="Analyse des tendances" />
        </Card>

        <div className="grid-2">
          <Card id="carte">
            <CardHeader
              icon={MapPin}
              title="Carte des régions"
              subtitle="Chaque point est un chef-lieu. Cliquez pour choisir la région."
            />
            <MadagascarMap summary={data.summary} selected={region} onSelect={setRegion} />
            <AnalysisCard entry={analyses.map} title="Analyse géographique" />
          </Card>

          <Card id="regions">
            <CardHeader
              icon={BarChart3}
              title="Classement des régions"
              subtitle="AQI moyen par région, de la plus exposée à la moins exposée."
            />
            <RegionRanking summary={data.summary} selected={region} onSelect={setRegion} />
            <AnalysisCard entry={analyses.cityComparison} title="Comparaison des régions" />
          </Card>
        </div>

        <div className="grid-2">
          <Card>
            <CardHeader icon={MapIcon} title="Répartition des niveaux" subtitle="Part des mesures dans chaque niveau AQI." />
            <Distribution histo={data.histo} />
            <AnalysisCard entry={analyses.histogram} title="Analyse de la répartition" />
          </Card>

          <Card>
            <CardHeader
              icon={CalendarDays}
              title="Semaine et week-end"
              subtitle="Le niveau de pollution change-t-il selon le type de jour ?"
            />
            <WeekdayCompare weekday={data.weekday} />
          </Card>
        </div>

        <section id="synthese">
          <CardHeader
            icon={Sparkles}
            title="Synthèse de la situation"
            subtitle={analysesLoading ? 'Chargement…' : 'Analyse IA sur l’ensemble du pays.'}
          />
          <Synthesis entry={analyses.synthesis} />
        </section>

        <p className="footer">
          Données : OpenWeather (qualité de l’air) · Chefs-lieux de région de Madagascar · Les analyses IA sont
          générées une fois par jour et ne changent pas avec les filtres.
        </p>
      </main>

      <AssistantDrawer open={assistantOpen} onClose={() => setAssistantOpen(false)} dashboard={dashboard} />
    </div>
  );
}
