import { useState, useCallback } from 'react';

export enum StorageType {
  LOCAL_STORAGE = 'LOCAL_STORAGE',
  SESSION_STORAGE = 'SESSION_STORAGE',
}

export const useBrowserStorage = (
  key: string,
  initialValue: string,
  type: StorageType
) => {
  const storageProvider =
    type === StorageType.LOCAL_STORAGE
      ? window.localStorage
      : window.sessionStorage;

  const [storedValue, setStoredValue] = useState<string>(() => {
    try {
      const storedItem = storageProvider.getItem(key);
      return storedItem ? JSON.parse(storedItem) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: string | Function) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storageProvider.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, []);

  return [storedValue, setValue];
};
