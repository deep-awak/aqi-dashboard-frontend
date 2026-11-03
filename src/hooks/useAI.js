import { useState } from 'react';
import { api } from '../services/api';

// Chat libre : lève une erreur en cas d'échec, l'appelant l'affiche.
export function useAI() {
  const [loading, setLoading] = useState(false);

  const ask = async (payload) => {
    setLoading(true);
    try {
      const result = await api.chat(payload);
      if (typeof result?.content !== 'string' || result.content === '') {
        throw new Error('Réponse vide du service.');
      }
      return result.content;
    } finally {
      setLoading(false);
    }
  };

  return { ask, loading };
}
