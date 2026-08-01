# AQI Dashboard Frontend

## Présentation

AQI Dashboard Frontend est une application web moderne de visualisation et d’analyse de la qualité de l’air. Elle permet de consulter des indicateurs clés, d’explorer des tendances sur plusieurs villes et de bénéficier d’un assistant IA pour interpréter les données et ajuster l’affichage du tableau de bord.

Le projet est développé avec React, Vite et Material UI, et s’appuie sur une API backend pour fournir les données d’analyse.

## Fonctionnalités principales

- Tableau de bord interactif avec filtres par ville, période et plage de dates
- Indicateurs KPI (AQI, PM2.5, PM10, etc.)
- Graphiques dynamiques : courbes, histogrammes, barres et cartes
- Résumé analytique par ville
- Assistant IA intégré pour poser des questions et appliquer des actions de filtrage ou d’affichage
- Thème clair/sombre
- Déploiement prêt pour GitHub Pages

## Architecture du projet

La structure du frontend est organisée comme suit :

- src/App.jsx : point d’entrée principal de l’application
- src/dashboard/Dashboard.jsx : composition du tableau de bord et logique d’affichage
- src/contexts/DashboardContext.jsx : gestion centralisée des données et filtres
- src/services/api.js : client API pour les appels au backend
- src/hooks/ : hooks React pour l’analyse et l’IA
- src/components/ : composants UI réutilisables
- src/utils/ : utilitaires et validations

## Technologies utilisées

- React 18
- Vite 5
- Material UI
- Recharts
- React Admin
- Framer Motion
- Leaflet / React Leaflet
- Axios
- Gemini AI via l’API Google Generative AI

## Prérequis

Avant de lancer le projet, assurez-vous d’avoir installé :

- Node.js 18 ou supérieur
- npm ou yarn
- Un backend API fonctionnel exposant les endpoints utilisés par le frontend

## Installation

1. Cloner le projet :

```bash
git clone <url-du-repo>
cd aqi-dashboard/frontend
```

2. Installer les dépendances :

```bash
npm install
```

## Configuration

Le projet attend une variable d’environnement pour l’URL de l’API :

```bash
VITE_API_URL=http://localhost:4000/api
```

Le fichier de configuration Vite utilise également un proxy local vers le backend sur le port 4000.

## Lancer l’application en développement

```bash
npm run dev
```

L’application sera disponible sur :

- http://localhost:5173

## Construire la version de production

```bash
npm run build
```

Le build sera généré dans le dossier dist.

## Déployer sur GitHub Pages

Le projet est prêt pour un déploiement sur GitHub Pages avec la commande suivante :

```bash
npm run deploy
```

Cette commande construit l’application puis publie le contenu du dossier dist.

## Points d’intégration API

Le frontend consomme les endpoints suivants :

- /cities
- /kpis
- /timeseries
- /cities-summary
- /aqi-distribution
- /weekday-distribution
- /ai/chat

## Utilisation du tableau de bord

1. Sélectionner une ville dans le filtre en haut du tableau de bord
2. Choisir une période ou une plage de dates
3. Afficher ou masquer certains graphiques via le sélecteur
4. Utiliser l’assistant IA pour poser des questions ou appliquer des actions de filtrage

## Développement et maintenance

Pour maintenir le projet proprement :

- garder les composants modulaires
- centraliser les appels API dans src/services
- éviter les dépendances inutiles
- tester les changements sur la version de développement avant le déploiement

## Auteur

Projet développé dans le cadre d’un tableau de bord analytique sur la qualité de l’air.
