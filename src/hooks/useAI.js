import { useState } from 'react';
import { fetchAIInsight } from '../services/api';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateInsight = async (messages, context) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAIInsight(messages, context);
  
      if (!result) return '';
      if (typeof result === 'string') return result;
      if (result.content) {
        return typeof result.content === 'object' ? result.content.content || JSON.stringify(result.content) : result.content;
      }
      return JSON.stringify(result);
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generateInsight, loading, error };
}
