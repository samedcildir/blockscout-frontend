import React from 'react';

import TestnetWarning from 'ui/shared/alerts/TestnetWarning';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import TxInfo from './details/TxInfo';
import type { TxQuery, TxHashInscriptionIdQuery } from './useTxQuery';

interface Props {
  txQuery: TxQuery;
  txHashInscriptionIdQuery: TxHashInscriptionIdQuery;
}

const TxDetails = ({ txQuery, txHashInscriptionIdQuery }: Props) => {
  if (txQuery.isError) {
    return <DataFetchAlert/>;
  }

  return (
    <>
      <TestnetWarning mb={ 6 } isLoading={ txQuery.isPlaceholderData || txHashInscriptionIdQuery.isPlaceholderData }/>
      <TxInfo data={ txQuery.data } dataInscriptionId={ txHashInscriptionIdQuery.data }
        isLoading={ txQuery.isPlaceholderData || txHashInscriptionIdQuery.isPlaceholderData }
        socketStatus={ txQuery.socketStatus }/>
    </>
  );
};

export default React.memo(TxDetails);
