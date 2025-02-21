import { createListCollection } from '@chakra-ui/react';
import React from 'react';

import type { StatsInterval, StatsIntervalIds } from 'types/client/stats';

import { SelectContent, SelectControl, SelectItem, SelectRoot, SelectValueText } from 'toolkit/chakra/select';
import { Skeleton } from 'toolkit/chakra/skeleton';
import type { TagProps } from 'toolkit/chakra/tag';
import TagGroupSelect from 'ui/shared/tagGroupSelect/TagGroupSelect';
import { STATS_INTERVALS } from 'ui/stats/constants';

const intervalCollection = createListCollection({
  items: Object.keys(STATS_INTERVALS).map((id: string) => ({
    value: id,
    label: STATS_INTERVALS[id as StatsIntervalIds].shortTitle,
  })),
});

const intervalListShort = Object.keys(STATS_INTERVALS).map((id: string) => ({
  id: id,
  title: STATS_INTERVALS[id as StatsIntervalIds].shortTitle,
})) as Array<StatsInterval>;

type Props = {
  interval: StatsIntervalIds;
  onIntervalChange: (newInterval: StatsIntervalIds) => void;
  isLoading?: boolean;
  selectTagSize?: TagProps['size'];
};

const ChartIntervalSelect = ({ interval, onIntervalChange, isLoading, selectTagSize }: Props) => {

  const handleItemSelect = React.useCallback(({ value }: { value: Array<string> }) => {
    onIntervalChange(value[0] as StatsIntervalIds);
  }, [ onIntervalChange ]);

  return (
    <>
      <Skeleton hideBelow="lg" borderRadius="base" loading={ isLoading }>
        <TagGroupSelect<StatsIntervalIds> items={ intervalListShort } onChange={ onIntervalChange } value={ interval } tagSize={ selectTagSize }/>
      </Skeleton>
      <SelectRoot
        collection={ intervalCollection }
        variant="outline"
        defaultValue={ [ interval ] }
        onValueChange={ handleItemSelect }
        hideFrom="lg"
        w="100%"
      >
        <SelectControl loading={ isLoading }>
          <SelectValueText placeholder="Select interval"/>
        </SelectControl>
        <SelectContent>
          { intervalCollection.items.map((item) => (
            <SelectItem item={ item } key={ item.value }>
              { item.label }
            </SelectItem>
          )) }
        </SelectContent>
      </SelectRoot>
    </>
  );
};

export default React.memo(ChartIntervalSelect);
