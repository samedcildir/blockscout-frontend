/* eslint-disable @next/next/no-img-element */
import { Box } from '@chakra-ui/react';
import Script from 'next/script';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';

const CapybaraRunner = () => {
  const [ , setHasReachedHighScore ] = React.useState(false);

  const isMobile = useIsMobile();

  React.useEffect(() => {
    const preventDefaultKeys = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault();
      }
    };

    const handleHighScore = () => {
      setHasReachedHighScore(true);
    };

    window.addEventListener('reachedHighScore', handleHighScore);
    window.addEventListener('keydown', preventDefaultKeys);

    return () => {
      window.removeEventListener('keydown', preventDefaultKeys);
      window.removeEventListener('reachedHighScore', handleHighScore);
    };
  }, []);

  return (
    <>
      <Box mb={ 4 }>{ isMobile ? 'Tap below to start' : 'Press space to start' }</Box>
      <Script strategy="lazyOnload" src="/static/capibara/index.js"/>
      <Box width={{ base: '100%', lg: '600px' }} height="300px" p="50px 0">
        <div id="main-frame-error" className="interstitial-wrapper" style={{ marginTop: '20px' }}>
          <div id="main-content"></div>
          <div id="offline-resources" style={{ display: 'none' }}>
            <img id="offline-resources-1x" src="/static/capibara/capybaraSprite.png"/>
            <img id="offline-resources-2x" src="/static/capibara/capybaraSpriteX2.png"/>
          </div>
        </div>
      </Box>
    </>
  );
};

export default CapybaraRunner;
