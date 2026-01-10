/**
 * Optimistic updates utility for improving perceived performance
 */

export interface OptimisticUpdateOptions<T> {
  optimisticData: T;
  onSuccess?: (data: T) => void;
  onError?: (error: any, rollbackData: T) => void;
  rollbackOnError?: boolean;
}

/**
 * Execute an async operation with optimistic update
 */
export async function withOptimisticUpdate<T, R>(
  operation: () => Promise<R>,
  options: OptimisticUpdateOptions<T>
): Promise<R> {
  const { optimisticData, onSuccess, onError, rollbackOnError = true } = options;

  try {
    const result = await operation();
    onSuccess?.(result as T);
    return result;
  } catch (error) {
    if (rollbackOnError) {
      onError?.(error, optimisticData);
    }
    throw error;
  }
}

/**
 * Create an optimistic update handler for React state
 */
export function createOptimisticHandler<T>(
  setState: (data: T) => void,
  rollbackState: (data: T) => void
) {
  return {
    apply: (optimisticData: T) => {
      setState(optimisticData);
    },
    rollback: (originalData: T) => {
      rollbackState(originalData);
    },
    commit: (finalData: T) => {
      setState(finalData);
    },
  };
}

/**
 * Optimistic update for list operations (add, update, delete)
 */
export interface ListOptimisticUpdate<T> {
  add: (item: T) => T[];
  update: (id: string | number, updates: Partial<T>) => T[];
  delete: (id: string | number) => T[];
}

export function createListOptimisticHandler<T extends { id: string | number }>(
  items: T[]
): ListOptimisticUpdate<T> {
  return {
    add: (item: T) => [...items, item],
    update: (id: string | number, updates: Partial<T>) =>
      items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    delete: (id: string | number) => items.filter((item) => item.id !== id),
  };
}
