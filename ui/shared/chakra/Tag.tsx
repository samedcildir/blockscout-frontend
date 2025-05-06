import { Tag as ChakraTag, Flex } from '@chakra-ui/react';
import type { TagProps } from '@chakra-ui/react';
import React from 'react';

import Skeleton from 'ui/shared/chakra/Skeleton';
import Hint from 'ui/shared/Hint';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

export interface Props extends TagProps {
  hint?: React.ReactNode;
  isLoading?: boolean;
}

const Tag = ({ hint, isLoading, ...props }: Props, ref: React.ForwardedRef<HTMLDivElement>) => {

  if (props.isTruncated && typeof props.children === 'string') {
    if (!props.children) {
      return null;
    }

    return (
      <Skeleton isLoaded={ !isLoading } display="inline-block" borderRadius="sm" maxW="100%">
        <TruncatedTextTooltip label={ props.children }>
          <ChakraTag { ...props } ref={ ref }/>
        </TruncatedTextTooltip>
      </Skeleton>
    );
  }
  return (
    <Flex columnGap={ 2 } alignItems="flex-start">
      { hint &&
          <Hint label={ hint } isLoading={ isLoading } my={{ lg: '2px' }}/>
      }
      <Skeleton isLoaded={ !isLoading } display="inline-block" borderRadius="sm" maxW="100%">
        <ChakraTag { ...props } ref={ ref }/>
      </Skeleton>
    </Flex>
  );
};

export default React.memo(React.forwardRef(Tag));
