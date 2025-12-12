"use client";

import { useState, useEffect, useCallback } from 'react';
import type { HistoryItem } from '@/lib/types';

const HISTORY_STORAGE_KEY = 'airscribe-history';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const addToHistory = useCallback((item: HistoryItem) => {
    setHistory(prevHistory => {
      const newHistory = [item, ...prevHistory];
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error("Failed to save history to localStorage", error);
        // If storage fails, at least the session state is updated
      }
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear history from localStorage", error);
    }
  }, []);

  return { history, addToHistory, clearHistory, isLoaded };
}
