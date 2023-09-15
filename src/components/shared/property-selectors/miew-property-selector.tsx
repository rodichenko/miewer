import React, { useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { MenuProps } from 'antd';
import { Button, Divider, Dropdown, Select } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import type { MiewPropertySelectorProps } from '../../../@types/components/property-selectors';
import type { MiewProperty, MiewPropertyType } from '../../../@types/miew';
import {
  getPropertyValue,
  initializeMiewProperty,
} from '../../../helpers/miew/properties';

const configureKey = '__configure__';

declare type ItemOption<T> = {
  key: string;
  value: T | typeof configureKey;
  title: string;
  label: ReactNode;
};

declare type ItemDivider = {
  type: 'divider';
};

declare type SimpleItem<T> = ItemOption<T> | ItemDivider;

function isDivider<T>(o: SimpleItem<T>): o is ItemDivider {
  return 'type' in o && o.type === 'divider';
}

function MiewPropertySelector<T extends MiewPropertyType>(
  props: MiewPropertySelectorProps<T>,
) {
  const {
    className,
    style,
    disabled,
    value,
    titles,
    items,
    manifests,
    onChange,
    onConfigure,
    displayFullName,
    type = 'select',
  } = props;
  const itemKey = useCallback(
    (item: MiewProperty<T>): string => getPropertyValue(item).toString(),
    [],
  );
  const onChangeCallback = useCallback(
    (e: T | typeof configureKey) => {
      if (e === configureKey) {
        if (typeof onConfigure === 'function') {
          onConfigure();
        }
        return;
      }
      const getItemByValue = (itemValue: string): T | undefined =>
        items.find((o) => itemKey(o) === itemValue);
      const newValue = getItemByValue(e);
      if (newValue) {
        onChange(initializeMiewProperty(newValue, manifests));
      }
    },
    [onChange, onConfigure, items, manifests, itemKey],
  );
  const onClick = useCallback(
    (e: { key: string }) => {
      onChangeCallback(e.key as T | typeof configureKey);
    },
    [onChangeCallback],
  );
  const options = useMemo<Array<SimpleItem<T>>>(() => {
    const result: Array<SimpleItem<T>> = items.map((item) => ({
      key: itemKey(item),
      value: item,
      title: titles[item],
      label: (
        <span className="mw-property-selector-item-text">
          {titles[item]}
          {value && itemKey(item) === itemKey(value) && (
            <CheckOutlined style={{ marginLeft: 5 }} />
          )}
        </span>
      ),
    }));
    if (typeof onConfigure === 'function') {
      result.push({ type: 'divider' });
      result.push({
        key: configureKey,
        title: 'Configure',
        value: configureKey,
        label: <span>Configure</span>,
      });
    }
    return result;
  }, [itemKey, items, value, onConfigure]);
  const menu = useMemo<MenuProps>(
    () => ({
      items: options,
      onClick,
      selectedKeys: value ? [itemKey(value)] : [],
    }),
    [onClick, itemKey, options, value],
  );
  const itemValue = useMemo(
    () => (value ? getPropertyValue(value) : undefined),
    [value, getPropertyValue],
  );
  const displayName = useMemo(() => {
    if (itemValue) {
      return (displayFullName ? titles[itemValue] : undefined) ?? itemValue;
    }
    return null;
  }, [displayFullName, itemValue]);
  if (type === 'button') {
    return (
      <Dropdown
        disabled={disabled}
        menu={menu}
        trigger={['click']}
        overlayClassName="mw-property-selector-container">
        <Button className={className} style={style} type="text">
          {displayName}
        </Button>
      </Dropdown>
    );
  }
  if (type === 'select') {
    return (
      <Select
        className={className}
        style={style}
        disabled={disabled}
        onChange={onChangeCallback}
        value={itemValue}
        popupClassName="mw-property-selector-container"
        popupMatchSelectWidth={false}>
        {options.map((option) => {
          if (isDivider(option)) {
            return <Divider key="divider" />;
          }
          return (
            <Select.Option
              key={option.key}
              title={option.title}
              value={option.value}>
              {option.title}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
  return null;
}

export default MiewPropertySelector;
