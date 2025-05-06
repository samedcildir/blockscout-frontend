import { Tr, Td, Flex } from '@chakra-ui/react';
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

type Props = AddressTokenBalance & AddressExternalTokenBalance & { isLoading: boolean };

const ERC20TokensTableItem = ({
  token,
  value,
  external_value: externalValue,
  external_decimals: externalDecimals,
  isLoading,
}: Props) => {

  const {
    valueStr: tokenQuantity,
  } = getCurrencyValue({ value: value, exchangeRate: token.exchange_rate, decimals: token.decimals, accuracy: 8, accuracyUsd: 2 });

  const {
    valueStr: tokenExternalQuantity,
  } = getCurrencyValue({ value: externalValue, exchangeRate: token.exchange_rate, decimals: externalDecimals, accuracy: 8, accuracyUsd: 2 });

  return (
    <Tr
      role="group"
    >
      <Td verticalAlign="middle">
        <TokenEntity
          token={ token }
          isLoading={ isLoading }
          noCopy
          jointSymbol
          fontWeight="700"
        />
      </Td>
      <Td verticalAlign="middle">
        <Flex alignItems="center" width="150px" justifyContent="space-between">
          { (token.address !== '' && (
            <>
              <AddressEntity
                address={{ hash: token.address }}
                isLoading={ isLoading }
                truncation="constant"
                noIcon
              />
              <AddressAddToWallet token={ token } ml={ 4 } isLoading={ isLoading } opacity="0" _groupHover={{ opacity: 1 }}/>
            </>
          )) }
        </Flex>
      </Td>
      <Td verticalAlign="middle">
        <Tag
          hint={ getHint(token) }
          isLoading={ isLoading }
        >
          { getTokenTypeName(token) }
        </Tag>
      </Td>
      <Td isNumeric verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline">
          { value !== '' ? tokenQuantity : tokenExternalQuantity }
        </Skeleton>
      </Td>
    </Tr>
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

export default React.memo(ERC20TokensTableItem);
