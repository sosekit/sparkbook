import { useState } from 'react';
import { suggestionService } from '../services/suggestionService';
import { Spark } from '../types/spark';

export function useSuggestions() {
  const [suggestion, setSuggestion] = useState<Spark | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadDeletedSparkReplacement() {
    return load(() => suggestionService.replacementForDeletedSpark());
  }

  async function loadDeletedListReplacement() {
    return load(() => suggestionService.replacementForDeletedList().then(() => null));
  }

  async function loadEmptyLocationSuggestion() {
    return load(() => suggestionService.suggestionForEmptyLocation());
  }

  async function loadNearbySuggestion(latitude: number, longitude: number) {
    return load(() => suggestionService.nearbySparkSuggestion(latitude, longitude));
  }

  async function load(loadFn: () => Promise<Spark | null>) {
    try {
      setLoading(true);
      const next = await loadFn();
      setSuggestion(next);
      setError(null);
      return next;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load suggestion');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    suggestion,
    loading,
    error,
    loadDeletedSparkReplacement,
    loadDeletedListReplacement,
    loadEmptyLocationSuggestion,
    loadNearbySuggestion
  };
}
