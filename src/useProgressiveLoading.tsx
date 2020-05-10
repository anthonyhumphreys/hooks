import { useEffect, useState } from 'react';

export const useProgressiveLoading: Function = (
  timings: number[] = [5, 15, 30],
  strings: string[] = [
    'Still loading, please wait...',
    'Still loading, please wait a while longer...',
    'Still loading, thank you for your patience...',
  ]
): string => {
  const [text, setText] = useState<string>('');

  useEffect(() => {
    timings.forEach((delay: number, index: number) =>
      setTimeout(() => setText(strings[index]), delay * 1000)
    );
    return () => setText('');
  }, [timings, strings]);

  return text;
};
