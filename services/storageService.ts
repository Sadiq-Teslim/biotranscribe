import { HistoryRecord } from '../types';

const STORAGE_KEY = 'biotranscribe_history_v1';

export const saveRecord = (record: Omit<HistoryRecord, 'id' | 'date'>): HistoryRecord => {
  const newRecord: HistoryRecord = {
    ...record,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };

  const existing = getHistory();
  const updated = [newRecord, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newRecord;
};

export const getHistory = (): HistoryRecord[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse history", e);
    return [];
  }
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const deleteRecord = (id: string) => {
  const existing = getHistory();
  const updated = existing.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};