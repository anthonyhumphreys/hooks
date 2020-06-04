import { useState, useCallback, useReducer, useEffect } from 'react';

type State = {
  success: boolean;
  loading: boolean;
  error: boolean;
};

type Action = {
  type: 'loading' | 'success' | 'error';
  syncedState?: object;
};

const initialState: State = {
  success: false,
  loading: false,
  error: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'success':
      return { success: true, loading: false, error: false };
    case 'loading':
      return { success: false, loading: true, error: false };
    case 'error':
      return { success: false, loading: false, error: true };
    default:
      return state;
  }
};

const SYNC_URL = '';

export const useSyncState = (
  key: string,
  initialValue: string | object,
  delay: number = 1000
) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const syncToServer = useCallback(async (valueToStore: object) => {
    dispatch({ type: 'loading' });
    const response = await fetch(SYNC_URL, {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(valueToStore),
    });
    response.ok ? dispatch({ type: 'success' }) : dispatch({ type: 'error' });
  }, []);

  const syncToClient = useCallback(async () => {
    dispatch({ type: 'loading' });
    const response = await fetch(SYNC_URL, {
      method: 'GET',
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    response.ok
      ? dispatch({ type: 'success', syncedState: await response.json() })
      : dispatch({ type: 'error' });
    return response.json();
  }, []);

  const [syncedValue, setSyncedValue] = useState<object>(async () => {
    try {
      const syncedState = await syncToClient();
      return syncedState ?? initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: object | Function) => {
    try {
      const valueToStore =
        value instanceof Function ? value(syncedValue) : value;
      setSyncedValue(valueToStore);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      syncToServer(syncedValue);
    }, delay);
    return () => clearTimeout(timeout);
  }, [syncedValue, delay]);

  return [state, syncedValue, setValue];
};
