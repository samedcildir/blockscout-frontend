import { Tr, Td, Flex } from '@chakra-ui/react';
import React from 'react';

import type { AddressTokenBalance, AddressExternalTokenBalance } from 'types/api/address';

import getCurrencyValue from 'lib/getCurrencyValue';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import Skeleton from 'ui/shared/chakra/Skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

type Props = AddressTokenBalance & AddressExternalTokenBalance & { isLoading: boolean };

const ERC20TokensTableItem = ({
  token,
  value,
  externalValue,
  externalDecimals,
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
          <AddressEntity
            address={{ hash: token.address }}
            isLoading={ isLoading }
            truncation="constant"
            noIcon
          />
          <AddressAddToWallet token={ token } ml={ 4 } isLoading={ isLoading } opacity="0" _groupHover={{ opacity: 1 }}/>
        </Flex>
      </Td>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline">
          { token.icon_url ? 'WRAPPED BRC-20' : 'pBRC-20' }
        </Skeleton>
      </Td>
      <Td isNumeric verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline">
          { tokenQuantity }
        </Skeleton>
      </Td>
      <Td isNumeric verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline">
          { externalDecimals ? tokenExternalQuantity : '-' }
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default React.memo(ERC20TokensTableItem);
