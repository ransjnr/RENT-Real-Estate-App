import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

interface UseAppwriteOptions<
  T,
  P extends Record<string, string | number | undefined>
> {
  fn: (params?: P) => Promise<T>;
  params?: P;
  skip?: boolean;
}

interface UseAppwriteReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams?: P) => Promise<void>;
}

export const useAppwrite = <
  T,
  P extends Record<string, string | number | undefined>
>({
  fn,
  params = {} as P,
  skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (fetchParams?: P) => {
      setLoading(true);
      setError(null);

      try {
        const result = await fn(fetchParams);
        setData(result);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        console.error("[useAppwrite] Error:", err);
        // Only show alert for non-skip calls to avoid spam
        if (!skip) {
          Alert.alert("Error", errorMessage);
        }
      } finally {
        setLoading(false);
      }
    },
    [fn, skip]
  );

  useEffect(() => {
    if (!skip) {
      fetchData(params);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, JSON.stringify(params)]);

  const refetch = useCallback(
    async (newParams?: P) => {
      await fetchData(newParams || params);
    },
    [fetchData, params]
  );

  return { data, loading, error, refetch };
};
