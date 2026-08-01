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
      return result?.content || result || '';
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generateInsight, loading, error };
}