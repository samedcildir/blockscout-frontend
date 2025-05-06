import { Flex, HStack } from '@chakra-ui/react';
import React from 'react';

import type { AddressTokenBalance, AddressExternalTokenBalance } from 'types/api/address';
import type { TokenInfo } from 'types/api/token';

import getCurrencyValue from 'lib/getCurrencyValue';
import { getTokenTypeName } from 'lib/token/tokenTypes';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import Skeleton from 'ui/shared/chakra/Skeleton';
import Tag from 'ui/shared/chakra/Tag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

type Props = AddressTokenBalance & AddressExternalTokenBalance & { isLoading: boolean };

const ERC20TokensListItem = ({ token, value, external_value: externalValue, external_decimals: externalDecimals, isLoading }: Props) => {

  const {
    valueStr: tokenQuantity,
  } = getCurrencyValue({ value: value, exchangeRate: token.exchange_rate, decimals: token.decimals, accuracy: 8, accuracyUsd: 2 });

  const {
    valueStr: tokenExternalQuantity,
  } = getCurrencyValue({ value: externalValue, exchangeRate: token.exchange_rate, decimals: externalDecimals, accuracy: 8, accuracyUsd: 2 });

  return (
    <ListItemMobile rowGap={ 2 }>
      <Flex alignItems="center" width="100%">
        <TokenEntity
          token={ token }
          isLoading={ isLoading }
          noCopy
          jointSymbol
          fontWeight="700"
        />
        <Tag
          hint={ getHint(token) }
          isLoading={ isLoading }
        >
          { getTokenTypeName(token) }
        </Tag>
      </Flex>
      { token.address !== '' && (
        <Flex alignItems="center" pl={ 8 }>
          <AddressEntity
            address={{ hash: token.address }}
            isLoading={ isLoading }
            truncation="constant"
            noIcon
          />
          <AddressAddToWallet token={ token } ml={ 2 } isLoading={ isLoading }/>
        </Flex>
      ) }
      <HStack spacing={ 3 } alignItems="baseline">
        <Skeleton isLoaded={ !isLoading } fontSize="sm" fontWeight={ 500 }>Balance</Skeleton>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" color="text_secondary" whiteSpace="pre-wrap" wordBreak="break-word">
          <span>{ value !== '' ? tokenQuantity : tokenExternalQuantity }</span>
        </Skeleton>
      </HStack>
    </ListItemMobile>
  );
};

function getHint(token: TokenInfo) {
  if (token.address === '') {
    return 'Base BRC20 tokens: Ticker names are unique identifiers.';
  }
  if (token.icon_url != null) {
    return 'Wrapped BRC20 tokens: Ticker names are unique identifiers. These represent base BRC20 tokens inside the programmable module.';
  }
  return 'pBRC-20 tokens: Exist only within the programmable module. Contract addresses are unique; ticker names are not unique!';
}

export default ERC20TokensListItem;
