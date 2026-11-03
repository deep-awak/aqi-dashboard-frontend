import { useState } from 'react';
import { fetchAIChat } from '../services/api';

export function useAI() {
  const [loading, setLoading] = useState(false);

  const ask = async ({ messages, context, provider, apiKey }) => {
    setLoading(true);
    try {
      const result = await fetchAIChat({ messages, context, provider, apiKey });
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
