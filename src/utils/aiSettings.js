const STORAGE_KEY = 'aqi_ai_settings';

export function loadSettings() {
  for (const store of [localStorage, sessionStorage]) {
    try {
      const raw = store.getItem(STORAGE_KEY);
      if (raw) {
        const { provider, apiKey } = JSON.parse(raw);
        if (provider && apiKey) return { provider, apiKey };
      }
    } catch {
    }
  }
  return null;
}

export function isRemembered() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

export function saveSettings(settings, remember) {
  const raw = JSON.stringify(settings);
  try {
    sessionStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // Silencieux : l'app fonctionne sans stockage.
  }
  try {
    if (remember) localStorage.setItem(STORAGE_KEY, raw);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Idem.
  }
}

export function clearSettings() {
  for (const store of [localStorage, sessionStorage]) {
    try {
      store.removeItem(STORAGE_KEY);
    } catch {
      // Idem.
    }
  }
}
