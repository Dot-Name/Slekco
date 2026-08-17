import { createContext, useContext, useMemo } from 'react';
import { fetchCategories } from '../api/categories';
import { useApi } from '../hooks/useApi';

const CatalogContext = createContext(null);

/**
 * Categories are needed by the header, the filters and the footer, so they
 * are fetched once from the API and shared — never duplicated in components.
 */
export function CatalogProvider({ children }) {
  const { data, loading, error, retry } = useApi((opts) => fetchCategories(opts), []);

  const value = useMemo(
    () => ({
      categories: data?.items || [],
      loading,
      error,
      retry,
      accentFor: (slug) => data?.items?.find((c) => c.slug === slug)?.accent || '#14161A',
    }),
    [data, loading, error, retry]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export const useCatalog = () => {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used inside <CatalogProvider>');
  return ctx;
};
