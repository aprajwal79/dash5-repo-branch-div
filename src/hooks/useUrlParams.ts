import { useMemo, useState, useEffect } from 'react';

export const useUrlParams = () => {
  const [search, setSearch] = useState(window.location.search);

  useEffect(() => {
    const handlePopState = () => {
      setSearch(window.location.search);
    };

    // Listen for browser back/forward navigation
    window.addEventListener('popstate', handlePopState);
    
    // Check for URL changes periodically (fallback for manual URL changes)
    const interval = setInterval(() => {
      if (window.location.search !== search) {
        setSearch(window.location.search);
      }
    }, 100);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      clearInterval(interval);
    };
  }, [search]);

  return useMemo(() => {
    const params = new URLSearchParams(search);
    const divisionId = params.get('div') || undefined;
    console.log('URL search params:', search);
    console.log('Extracted divisionId:', divisionId);
    return {
      divisionId,
    };
  }, [search]);
};