import { useCallback, useEffect, useState } from 'react';
import { listService } from '../services/listService';
import { SparkList } from '../types/list';

export function useLists() {
  const [lists, setLists] = useState<SparkList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setLists(await listService.fetchLists());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load lists');
    } finally {
      setLoading(false);
    }
  }, []);

  const addSparkToList = useCallback(async (listId: string, sparkId: string) => {
    const updatedList = await listService.addSparkToList(listId, sparkId);
    setLists((current) => current.map((list) => (list.id === updatedList.id ? updatedList : list)));
    return updatedList;
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    lists,
    loading,
    error,
    refresh,
    createList: listService.createList,
    addSparkToList,
    removeSparkFromList: listService.removeSparkFromList,
    reorderListSparks: listService.reorderListSparks,
    softDeleteList: listService.softDeleteList
  };
}
