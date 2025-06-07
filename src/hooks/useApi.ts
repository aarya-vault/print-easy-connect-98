
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/services/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApiQuery<T>(
  queryFn: () => Promise<any>,
  dependencies: any[] = []
): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null
  });

  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setState({ data: null, loading: false, error: 'Not authenticated' });
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const result = await queryFn();
        
        if (!cancelled) {
          setState({ data: result, loading: false, error: null });
        }
      } catch (error: any) {
        if (!cancelled) {
          setState({ 
            data: null, 
            loading: false, 
            error: error.response?.data?.error || error.message || 'An error occurred' 
          });
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [user, ...dependencies]);

  return state;
}

export function useApiMutation<T>(
  mutationFn: (...args: any[]) => Promise<any>
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const mutate = async (...args: any[]) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const result = await mutationFn(...args);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  };

  return { ...state, mutate };
}

// Specific hooks for common operations
export function useOrders() {
  const { user } = useAuth();
  
  return useApiQuery(
    async () => {
      if (user?.role === 'shop_owner') {
        return await apiService.getShopOrders();
      } else if (user?.role === 'customer') {
        return await apiService.getCustomerOrders();
      }
      throw new Error('Invalid user role for orders');
    },
    [user?.role]
  );
}

export function useShops() {
  return useApiQuery(async () => {
    return await apiService.getShops();
  });
}
