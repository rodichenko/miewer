import React, { useCallback, useMemo } from 'react';
import type { ChangeEvent } from 'react';
import classNames from 'classnames';
import { Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type {
  MiewPropertyOptions,
  MiewPropertyOptionType,
  MiewPropertyType,
} from '../../@types/miew';
import type { PropertyOptionProps } from '../../@types/components/representations';
import type { MiewerColor } from '../../@types/base';
import { MiewPropertyOptionKind } from '../../@types/miew';
import {
  getPropertyOptionValue,
  setPropertyOptionValue,
} from '../../helpers/miew/properties';
import MiewerColorPicker from '../shared/miewer-color-picker';
import { Input, InputNumber } from '../shared/antd-overrides';

function PropertyOption<
  Type extends MiewPropertyType,
  OptionType extends MiewPropertyOptionType,
  Options extends MiewPropertyOptions,
>(props: PropertyOptionProps<Type, OptionType, Options>) {
  const {
    className,
    style,
    option,
    property,
    propertyManifest,
    disabled: controlDisabled,
    onChange,
  } = props;
  const disabled = controlDisabled ?? !onChange;
  const value = useMemo(() => {
    if (property && option) {
      return getPropertyOptionValue(property, option) ?? option.default;
    }
    return undefined;
  }, [property, option]);
  const { kind } = option;
  const onEditOption = useCallback(
    (newValue: any) => {
      if (property && onChange) {
        onChange(
          setPropertyOptionValue(property, propertyManifest, option, newValue),
        );
      }
    },
    [option, property, propertyManifest, onChange],
  );
  const onEditTextOption = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onEditOption(event.target.value);
    },
    [onEditOption],
  );
  const onEditNumberOption = useCallback(
    (number: any) => {
      if (!Number.isNaN(Number(number))) {
        onEditOption(Number(number));
      }
    },
    [onEditOption],
  );
  const onEditBooleanOption = useCallback(
    (event: CheckboxChangeEvent) => {
      onEditOption(event.target.checked);
    },
    [onEditOption],
  );
  const placeholder = useMemo(
    () => option?.default?.toString() ?? undefined,
    [option],
  );
  const title = useMemo(
    () => (option?.title ?? option?.name ?? '').toString(),
    [option],
  );
  return (
    <div
      className={classNames(className, 'mw-row', 'mw-property-option')}
      style={style}>
      <span className="mw-property-option-name">{title}</span>
      {kind === MiewPropertyOptionKind.color && (
        <MiewerColorPicker
          disabled={disabled}
          showValue
          color={value as MiewerColor}
          onChange={onEditOption}
        />
      )}
      {kind === MiewPropertyOptionKind.string && (
        <Input
          disabled={disabled}
          className="mw-control"
          value={value as string}
          onChange={onEditTextOption}
          placeholder={placeholder}
        />
      )}
      {kind === MiewPropertyOptionKind.number && (
        <InputNumber
          disabled={disabled}
          className="mw-control"
          value={value as number}
          onChange={onEditNumberOption}
          placeholder={placeholder}
        />
      )}
      {kind === MiewPropertyOptionKind.boolean && (
        <Checkbox
          disabled={disabled}
          checked={value as boolean}
          onChange={onEditBooleanOption}
        />
      )}
    </div>
  );
}

export default PropertyOption;
