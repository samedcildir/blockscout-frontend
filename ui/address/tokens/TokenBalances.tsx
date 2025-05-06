import { Flex } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

import TokenBalancesItem from './TokenBalancesItem';

type Props = {
  count: number | null;
};

const TokenBalances = ({ count }: Props) => {
  const tokensNumText = count ?
    `${ count } ${ count > 1 ? 'tokens' : 'token' }` :
    '0';

  return (
    <Flex columnGap={ 3 } rowGap={ 3 } mt={{ base: '6px', lg: 0 }} flexDirection={{ base: 'column', lg: 'row' }}>
      <TokenBalancesItem
        name="Tokens"
        value={ tokensNumText }
        isLoading={ count == null }
        icon={ <IconSvg name="tokens" boxSize="20px" flexShrink={ 0 } color="text_secondary"/> }
      />
    </Flex>
  );
};

export default TokenBalances;
