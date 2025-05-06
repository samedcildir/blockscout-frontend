import { Show, Hide } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { AddressTokenBalance, AddressExternalTokenBalance, AddressExternalTokensResponse, AddressTokensResponseNextPageParams } from 'types/api/address';

import type { ResourceError } from 'lib/api/resources';
import useIsMobile from 'lib/hooks/useIsMobile';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

import ERC20TokensListItem from './ERC20TokensListItem';
import ERC20TokensTable from './ERC20TokensTable';

type Props = {
  tokensQuery: QueryWithPagesResult<'address_tokens'>;
  externalTokensQuery: UseQueryResult<AddressExternalTokensResponse, ResourceError<unknown>>;
};

function addExternalData(tokensData: Array<AddressTokenBalance>, nextPageParams: AddressTokensResponseNextPageParams | null
  , externalTokensData: Array<AddressExternalTokenBalance> | undefined):
  Array<AddressTokenBalance & AddressExternalTokenBalance> {
  if (externalTokensData == null) {
    return tokensData.map((token) => ({
      ...token,
      external_token_name: null,
      external_value: '',
      external_decimals: null,
    }));
  }

  const externalInfoAdded = tokensData.map((token) => {
    const externalToken: AddressExternalTokenBalance = {
      external_token_name: null,
      external_value: '',
      external_decimals: null,
    };

    /*if (token.token.icon_url != null) {
      const foundExternalToken = externalTokensData.find((externalTokenFound) => externalTokenFound.external_token_name === token.token.name);
      if (foundExternalToken) {
        externalToken = foundExternalToken;
      }
    }*/
    return {
      ...token,
      ...externalToken,
    };
  });

  const externalTokens: Array<AddressTokenBalance & AddressExternalTokenBalance> =
    nextPageParams == null ?
      externalTokensData./*filter((externalToken) => {
      return !tokensData.some((token) => token.token.name === externalToken.external_token_name);
    }).*/map((externalToken) => ({
          token: {
            address: '',
            type: 'ERC-20',
            symbol: externalToken.external_token_name,
            name: externalToken.external_token_name,
            decimals: externalToken.external_decimals,
            holders: null,
            exchange_rate: null,
            total_supply: null,
            icon_url: null,
            circulating_market_cap: null,
          },
          value: '',
          token_id: null,
          token_instance: null,
          external_token_name: externalToken.external_token_name,
          external_value: externalToken.external_value,
          external_decimals: externalToken.external_decimals,
        })) : [];

  return [ ...externalInfoAdded, ...externalTokens ];
}

const ERC20Tokens = ({ tokensQuery, externalTokensQuery }: Props) => {
  const isMobile = useIsMobile();

  const { isError, isPlaceholderData, data, pagination } = tokensQuery;
  const isLoading = isPlaceholderData || externalTokensQuery.isPlaceholderData;

  const actionBar = isMobile && pagination.isVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  const content = data?.items ? (
    <>
      <Hide below="lg" ssr={ false }><ERC20TokensTable data={ addExternalData(data.items, data.next_page_params, externalTokensQuery.data?.items) }
        top={ pagination.isVisible ? 72 : 0 } isLoading={ isLoading }/></Hide>
      <Show below="lg" ssr={ false }>{ addExternalData(data.items, data.next_page_params, externalTokensQuery.data?.items).map((item, index) => (
        <ERC20TokensListItem
          key={ item.token.address + item.token.name + (isPlaceholderData ? index : '') }
          { ...item }
          isLoading={ isPlaceholderData }
        />
      )) }</Show></>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      items={ data?.items }
      emptyText="There are no tokens of selected type."
      content={ content }
      actionBar={ actionBar }
    />
  );

};

export default ERC20Tokens;
