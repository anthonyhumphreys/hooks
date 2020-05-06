import { useEffect, useState } from 'react';

enum FakeAsyncState {
  PENDING = 'PENDING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}

const useFakeAsync: Function = (
  callback: Function,
  delay: number = 3000,
  shouldError: boolean = false,
  chaos: boolean = false
) => {
  const [state, setState] = useState<FakeAsyncState>(FakeAsyncState.PENDING);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const succeed = chaos ? Math.random() >= 0.5 : !shouldError;
    if (succeed) {
      timer = setTimeout(() => {
        callback();
        setState(FakeAsyncState.COMPLETE);
      }, delay);
    } else {
      setState(FakeAsyncState.ERROR);
    }
    return () => clearTimeout(timer);
  }, [delay, callback, chaos, shouldError]);

  return [state];
};

export default useFakeAsync;
