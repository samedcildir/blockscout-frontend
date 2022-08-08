import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import React, { useState } from 'react';

import theme from 'theme';

function MyApp({ Component, pageProps }: AppProps) {
  const [ queryClient ] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={ queryClient }>
      <ChakraProvider theme={ theme }>
        <Component { ...pageProps }/>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
