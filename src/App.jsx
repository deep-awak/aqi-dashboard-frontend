import { useMemo, useState } from 'react';
import {
  Map as MapIcon,
  TrendingUp,
  BarChart3,
  CalendarDays,
  Sparkles,
  MapPin,
  RefreshCw,
  LayoutDashboard,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useDashboardData } from './hooks/useDashboardData';
import { useAnalyses } from './hooks/useAnalyses';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Hero from './components/dashboard/Hero';
import AirQualityOverview from './components/dashboard/AirQualityOverview';
import ForecastPills from './components/dashboard/ForecastPills';
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
  const [activeTab, setActiveTab] = useState('overview');

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
    <div className="app-page-wrapper">
      {/* Background layer with subtle light Madagascar satellite map */}
      <div className="bg-map-backdrop" aria-hidden="true" />

      {/* Main floating rounded dashboard container like the reference design */}
      <div className="rounded-dashboard-shell">
        <Sidebar
          kpis={data.kpis}
          scopeLabel={scopeLabel}
          regions={regionItems}
          selected={region}
          onSelect={setRegion}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenAssistant={() => setAssistantOpen(true)}
        />

        <main className="main-content-panel">
          <TopBar
            region={region}
            regions={regions}
            onRegion={setRegion}
            weekend={weekend}
            onWeekend={setWeekend}
            onRefresh={() => setRefreshKey((k) => k + 1)}
            loading={data.loading}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onOpenAssistant={() => setAssistantOpen(true)}
          />

          {data.loading && (
            <Notice>
              Chargement des relevés en direct de Madagascar…
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

          {/* VUE 1 : VUE D'ENSEMBLE (DASHBOARD COMME L'IMAGE) */}
          {activeTab === 'overview' && (
            <div className="tab-view-content fade-in">
              {/* Top Row: Mini Region Forecast Cards */}
              <ForecastPills
                summary={regionItems}
                selected={region}
                onSelect={setRegion}
              />

              {/* Main 2-column Hero Row (Glowing Orange Card + Air Quality Overview) */}
              <div className="hero-overview-grid">
                <Hero
                  kpis={data.kpis}
                  selected={region}
                  regions={regionItems}
                  onSelect={setRegion}
                  lastDate={lastDate}
                />

                <AirQualityOverview
                  kpis={data.kpis}
                  scopeLabel={scopeLabel}
                />
              </div>

              {/* Metric Cards Grid (PM2.5, PM10, NO2, Relevés) */}
              <KpiCards kpis={data.kpis} series={data.series} />
            </div>
          )}

          {/* VUE 2 : TENDANCES & ÉVOLUTION */}
          {activeTab === 'tendances' && (
            <div className="tab-view-content fade-in">
              <Card>
                <CardHeader
                  icon={TrendingUp}
                  title="Évolution temporelle & Analyse des polluants"
                  subtitle="Courbe lissée avec repères sanitaires de l’Organisation Mondiale de la Santé (OMS)."
                />
                <TrendChart series={data.series} />
                <AnalysisCard entry={analyses.timeseries} title="Analyse experte des tendances" />
              </Card>
            </div>
          )}

          {/* VUE 3 : CARTE INTERACTIVE */}
          {activeTab === 'carte' && (
            <div className="tab-view-content fade-in">
              <Card>
                <CardHeader
                  icon={MapPin}
                  title="Cartographie des 22 régions de Madagascar"
                  subtitle="Chaque marqueur correspond au chef-lieu de région. Cliquez pour sélectionner et inspecter."
                />
                <MadagascarMap summary={data.summary} selected={region} onSelect={setRegion} />
                <AnalysisCard entry={analyses.map} title="Analyse géographique" />
              </Card>
            </div>
          )}

          {/* VUE 4 : CLASSEMENT DES RÉGIONS */}
          {activeTab === 'regions' && (
            <div className="tab-view-content fade-in">
              <Card>
                <CardHeader
                  icon={BarChart3}
                  title="Palmarès et comparaison régionale"
                  subtitle="Indice AQI moyen calculé par région, de la plus exposée à la plus pure."
                />
                <RegionRanking summary={data.summary} selected={region} onSelect={setRegion} />
                <AnalysisCard entry={analyses.cityComparison} title="Comparatif régional" />
              </Card>
            </div>
          )}

          {/* VUE 5 : RÉPARTITION ET COMPARAISON SEMAINE / WEEK-END */}
          {activeTab === 'repartition' && (
            <div className="tab-view-content fade-in">
              <div className="grid-2">
                <Card>
                  <CardHeader
                    icon={MapIcon}
                    title="Répartition des seuils AQI"
                    subtitle="Part des mesures selon les 5 échelons de qualité de l’air."
                  />
                  <Distribution histo={data.histo} />
                  <AnalysisCard entry={analyses.histogram} title="Analyse de la répartition" />
                </Card>

                <Card>
                  <CardHeader
                    icon={CalendarDays}
                    title="Impact Semaine vs Week-end"
                    subtitle="La baisse du trafic et de l'activité économique réduit-elle la pollution le week-end ?"
                  />
                  <WeekdayCompare weekday={data.weekday} />
                </Card>
              </div>
            </div>
          )}

          {/* VUE 6 : ANALYSES IA */}
          {activeTab === 'synthese' && (
            <div className="tab-view-content fade-in">
              <Card>
                <CardHeader
                  icon={Sparkles}
                  title="Synthèse globale de la situation atmosphérique"
                  subtitle={analysesLoading ? 'Génération de l’analyse…' : 'Rapport IA exhaustif pour Madagascar.'}
                />
                <Synthesis entry={analyses.synthesis} />
              </Card>
            </div>
          )}

          <footer className="footer-panel">
            Données OpenWeather en direct · 22 Chefs-lieux de région de Madagascar · Modélisation atmosphérique AirMada
          </footer>
        </main>

        <AssistantDrawer
          open={assistantOpen}
          onClose={() => setAssistantOpen(false)}
          dashboard={dashboard}
        />
      </div>
    </div>
  );
}
