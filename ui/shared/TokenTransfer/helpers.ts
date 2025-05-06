import type { TokenInfo } from 'types/api/token';
import type { TokenTransfer } from 'types/api/tokenTransfer';

export const getTokenTransferTypeText = (type: TokenTransfer['type'], token: TokenInfo | null) => {
  if (token && token.type === 'ERC-20' && token.address !== '' && token.icon_url != null) {
    switch (type) {
      case 'token_minting':
        return 'Depositing';
      case 'token_burning':
        return 'Withdrawing';
      case 'token_spawning':
        return 'Creating';
      case 'token_transfer':
        return 'Transfer';
    }
  }
  switch (type) {
    case 'token_minting':
      return 'Minting';
    case 'token_burning':
      return 'Burning';
    case 'token_spawning':
      return 'Creating';
    case 'token_transfer':
      return 'Transfer';
  }
};
