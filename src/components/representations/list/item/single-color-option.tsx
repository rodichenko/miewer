import React, { useCallback, useMemo } from 'react';
import type { SingleColorOptionProps } from '../../../../@types/components/representations';
import type {
  MiewPropertyOptions,
  MiewPropertyType,
} from '../../../../@types/miew';
import {
  getColorOptionsForProperty,
  getPropertyManifest,
  getPropertyOptionValue,
  setPropertyOptionValue,
} from '../../../../helpers/miew/properties';
import MiewerColorPicker from '../../../shared/miewer-color-picker';
import type { MiewerColor } from '../../../../@types/base';

function SingleColorOption<
  Type extends MiewPropertyType,
  Options extends MiewPropertyOptions,
>(props: SingleColorOptionProps<Type, Options>) {
  const { className, style, value, onChange, manifests, disabled } = props;
  const propertyManifest = useMemo(
    () => (value ? getPropertyManifest(value, manifests) : undefined),
    [value, manifests],
  );
  const propertyOptionsManifests = useMemo(
    () => (value ? getColorOptionsForProperty(value, manifests) : []),
    [value, manifests],
  );
  const optionManifest = propertyOptionsManifests.find((o) => o.main);
  const color = useMemo(() => {
    if (optionManifest && value) {
      const colorValue =
        getPropertyOptionValue(value, optionManifest) ?? optionManifest.default;
      if (colorValue !== undefined && colorValue >= 0) {
        return colorValue;
      }
    }
    return undefined;
  }, [optionManifest, value]);
  const onChangeColor = useCallback(
    (newColor?: MiewerColor) => {
      if (
        value &&
        optionManifest &&
        propertyManifest &&
        typeof onChange === 'function'
      ) {
        onChange(
          setPropertyOptionValue(
            value,
            propertyManifest,
            optionManifest,
            newColor,
          ),
        );
      }
    },
    [onChange, value, optionManifest, propertyManifest],
  );
  if (optionManifest) {
    return (
      <MiewerColorPicker
        disabled={disabled}
        className={className}
        style={style}
        color={color}
        onChange={onChangeColor}
      />
    );
  }
  return null;
}

export default SingleColorOption;
