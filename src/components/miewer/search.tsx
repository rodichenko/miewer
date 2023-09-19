import React, { useCallback, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Input } from '../shared/antd-overrides';
import type { BasicComponentProps } from '../../@types/components/common';
import { useSelectionByCodes } from '../../stores/miew-selection-store';

function Search(props: BasicComponentProps) {
  const { className, style } = props;
  const [search, setSearch] = useState<string | undefined>();
  const selectionByCodes = useSelectionByCodes();
  const onSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
    },
    [setSearch],
  );
  const onPressEnter = useCallback(() => {
    selectionByCodes(search ?? '');
  }, [search, selectionByCodes]);
  return (
    <Input
      className={className}
      allowClear
      style={style}
      placeholder="Search residues"
      value={search}
      onChange={onSearchChange}
      onPressEnter={onPressEnter}
    />
  );
}

export default Search;
