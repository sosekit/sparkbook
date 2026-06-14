import { useEffect, useMemo, useState } from 'react';
import { searchService, SearchResult } from '../services/searchService';
import { SparkList } from '../types/list';
import { Spark } from '../types/spark';

export function useSearch(query: string, sparks: Spark[], lists: SparkList[] = []) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const sparkKey = useMemo(() => sparks.map((spark) => `${spark.id}:${spark.updatedAt || ''}:${spark.status}`).join('|'), [sparks]);
  const listKey = useMemo(() => lists.map((list) => `${list.id}:${list.updatedAt || ''}:${list.status}`).join('|'), [lists]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (query.trim().length < 2) {
        setResults((current) => current.length ? [] : current);
        setSearching(false);
        return;
      }
      setSearching(true);
      const next = await searchService.searchAll(query, sparks, lists);
      if (!cancelled) {
        setResults((current) => sameResults(current, next) ? current : next);
        setSearching(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [listKey, query, sparkKey]);

  return { results, searching };
}

function sameResults(a: SearchResult[], b: SearchResult[]) {
  if (a.length !== b.length) return false;
  return a.every((item, index) => item.id === b[index]?.id && item.type === b[index]?.type);
}
