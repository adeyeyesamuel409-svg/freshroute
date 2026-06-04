import { useCallback, useRef } from "react";

export function useDebouncedCallback<A extends unknown[]>(
  callback: (...args: A) => void,
  delay: number,
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: A) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay],
  );
}
