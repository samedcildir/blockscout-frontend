import { Flex, HStack, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import config from 'configs/app';
import getItemIndex from 'lib/getItemIndex';
import { getTokenTypeName } from 'lib/token/tokenTypes';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import Skeleton from 'ui/shared/chakra/Skeleton';
import Tag from 'ui/shared/chakra/Tag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

type Props = {
  token: TokenInfo;
  index: number;
  page: number;
  isLoading?: boolean;
};

const bridgedTokensFeature = config.features.bridgedTokens;

const TokensTableItem = ({
  token,
  page,
  index,
  isLoading,
}: Props) => {

  const {
    address,
    filecoin_robust_address: filecoinRobustAddress,
    holders,
    origin_chain_id: originalChainId,
  } = token;

  const bridgedChainTag = bridgedTokensFeature.isEnabled ?
    bridgedTokensFeature.chains.find(({ id }) => id === originalChainId)?.short_title :
    undefined;

  return (
    <ListItemMobile rowGap={ 3 }>
      <Grid
        width="100%"
        gridTemplateColumns="minmax(0, 1fr)"
      >
        <GridItem display="flex">
          <TokenEntity
            token={ token }
            isLoading={ isLoading }
            jointSymbol
            noCopy
            w="auto"
            fontSize="sm"
            fontWeight="700"
          />
          <Flex ml={ 3 } flexShrink={ 0 } columnGap={ 1 }>
            <Tag
              hint={ getHint(token) }
              isLoading={ isLoading }
            >{ getTokenTypeName(token) }</Tag>
            { bridgedChainTag && <Tag isLoading={ isLoading }>{ bridgedChainTag }</Tag> }
          </Flex>
          <Skeleton isLoaded={ !isLoading } fontSize="sm" ml="auto" color="text_secondary" minW="24px" textAlign="right" lineHeight={ 6 }>
            <span>{ getItemIndex(index, page) }</span>
          </Skeleton>
        </GridItem>
      </Grid>
      { address !== '' && (
        <Flex justifyContent="space-between" alignItems="center" width="150px" ml={ 7 } mt={ -2 }>
          <AddressEntity
            address={{ hash: address, filecoin: { robust: filecoinRobustAddress } }}
            isLoading={ isLoading }
            truncation="constant"
            noIcon
          />
          <AddressAddToWallet token={ token } isLoading={ isLoading }/>
        </Flex>
      ) }
      <HStack spacing={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" fontWeight={ 500 }>Holders</Skeleton>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" color="text_secondary"><span>{ Number(holders).toLocaleString() }</span></Skeleton>
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

export default TokensTableItem;
