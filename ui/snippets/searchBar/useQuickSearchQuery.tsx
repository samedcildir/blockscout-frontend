import React from 'react';

import { isBech32Address, fromBech32Address, isBTCAddress, fromBTCAddress, isInscriptionId } from 'lib/address/bech32';
import useApiQuery from 'lib/api/useApiQuery';
import useDebounce from 'lib/hooks/useDebounce';

export default function useQuickSearchQuery() {
  const [ searchTerm, setSearchTerm ] = React.useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  let q = debouncedSearchTerm;
  if (isBTCAddress(debouncedSearchTerm)) {
    q = fromBTCAddress(debouncedSearchTerm);
  } else if (isBech32Address(debouncedSearchTerm)) {
    q = fromBech32Address(debouncedSearchTerm);
  }

  const query = useApiQuery(isInscriptionId(debouncedSearchTerm) ? 'inscription_id_search' : 'quick_search', {
    queryParams: { q },
    queryOptions: { enabled: debouncedSearchTerm.trim().length > 0 },
  });

  const redirectCheckQuery = useApiQuery('search_check_redirect', {
    // on pages with regular search bar we check redirect on every search term change
    // in order to prepend its result to suggest list since this resource is much faster than regular search
    queryParams: { q: debouncedSearchTerm },
    queryOptions: { enabled: Boolean(debouncedSearchTerm) },
  });

  return React.useMemo(() => ({
    searchTerm,
    debouncedSearchTerm,
    handleSearchTermChange: setSearchTerm,
    query,
    redirectCheckQuery,
  }), [ debouncedSearchTerm, query, redirectCheckQuery, searchTerm ]);
}
