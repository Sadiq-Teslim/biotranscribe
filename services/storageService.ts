import { HistoryRecord } from '../types';

// CONFIGURATION
// ---------------------------------------------------------------------------
// 1. Set to true to use the Backend (Python). False uses LocalStorage (Browser).
const USE_BACKEND = true;

// 2. API URL Configuration
// Automatically detects if running locally or in production
// Uses environment variable if set, otherwise auto-detects based on hostname
const getApiUrl = (): string => {
  // Check for environment variable first (set in vite.config.ts)
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (envApiUrl) {
    return envApiUrl;
  }

  // Auto-detect based on hostname
  const hostname = window.location.hostname;
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '';

  return isLocal
    ? 'http://localhost:5000/api'
    : 'https://biotranscribe-api.onrender.com/api'; // Default production URL
};

const API_URL = getApiUrl();
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'biotranscribe_history_v1';

// --- Local Storage Implementation (Fallback) ---

const getHistoryLocal = (): HistoryRecord[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse history", e);
    return [];
  }
};

const saveRecordLocal = (record: Omit<HistoryRecord, 'id' | 'date'>): HistoryRecord => {
  const newRecord: HistoryRecord = {
    ...record,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };

  const existing = getHistoryLocal();
  const updated = [newRecord, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newRecord;
};

const deleteRecordLocal = (id: string) => {
  const existing = getHistoryLocal();
  const updated = existing.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

// --- API Implementation (Python/MySQL) ---

const getHistoryAPI = async (): Promise<HistoryRecord[]> => {
  try {
    const response = await fetch(`${API_URL}/history`);
    if (!response.ok) throw new Error('Failed to fetch history');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
};

const saveRecordAPI = async (record: Omit<HistoryRecord, 'id' | 'date'>): Promise<HistoryRecord | null> => {
  try {
    const response = await fetch(`${API_URL}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (!response.ok) throw new Error('Failed to save record');
    const data = await response.json();
    return { ...record, id: data.id, date: new Date().toISOString() } as HistoryRecord;
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
};

const deleteRecordAPI = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/history/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('API Error:', error);
    return false;
  }
};

// --- Exported Interface (Hybrid) ---

export const getHistory = (): HistoryRecord[] => {
  // Synchronous fallback for initial render, components should use fetchHistoryAsync
  return [];
};

// Helper for components that can handle async
export const fetchHistoryAsync = async (): Promise<HistoryRecord[]> => {
  if (USE_BACKEND) {
    return await getHistoryAPI();
  }
  return getHistoryLocal();
};

export const saveRecord = (record: Omit<HistoryRecord, 'id' | 'date'>) => {
  if (USE_BACKEND) {
    saveRecordAPI(record);
    // Return optimistic response
    return { ...record, id: 'temp-id', date: new Date().toISOString() } as HistoryRecord;
  }
  return saveRecordLocal(record);
};

export const deleteRecord = async (id: string): Promise<boolean> => {
  if (USE_BACKEND) {
    return await deleteRecordAPI(id);
  }
  deleteRecordLocal(id);
  return true;
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};