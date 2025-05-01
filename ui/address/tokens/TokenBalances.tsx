import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import IconSvg from 'ui/shared/IconSvg';

import { getTokensTotalInfo } from '../utils/tokenUtils';
import useFetchTokens from '../utils/useFetchTokens';
import TokenBalancesItem from './TokenBalancesItem';

const TokenBalances = () => {
  const router = useRouter();

  const hash = router.query.hash?.toString();

  const addressQuery = useApiQuery('address', {
    pathParams: { hash },
    queryOptions: { enabled: Boolean(hash), refetchOnMount: false },
  });

  const tokenQuery = useFetchTokens({ hash });

  if (addressQuery.isError || tokenQuery.isError) {
    return <DataFetchAlert/>;
  }

  const tokensInfo = getTokensTotalInfo(tokenQuery.data);
  const prefix = tokensInfo.isOverflow ? '>' : '';
  const tokensNumText = tokensInfo.num > 0 ?
    `${ prefix }${ tokensInfo.num } ${ tokensInfo.num > 1 ? 'tokens' : 'token' }` :
    '0';

  return (
    <Flex columnGap={ 3 } rowGap={ 3 } mt={{ base: '6px', lg: 0 }} flexDirection={{ base: 'column', lg: 'row' }}>
      <TokenBalancesItem
        name="Tokens"
        value={ tokensNumText }
        isLoading={ addressQuery.isPending || tokenQuery.isPending }
        icon={ <IconSvg name="tokens" boxSize="20px" flexShrink={ 0 } color="text_secondary"/> }
      />
    </Flex>
  );
};

export default TokenBalances;
