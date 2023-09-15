import React, { useMemo } from 'react';
import type { PropertyOptionProps } from '../../../@types/components/representations';
import classNames from 'classnames';
import type {
  MiewPropertyOptions,
  MiewPropertyType,
} from '../../../@types/miew';
import type { PropertyOptionsProps } from '../../../@types/components/representations';
import {
  getOptionsForProperty,
  getPropertyManifest,
} from '../../../helpers/miew/properties';
import PropertyOption from '../property-option';

function PropertyOptions<
  Type extends MiewPropertyType,
  Options extends MiewPropertyOptions,
>(props: PropertyOptionsProps<Type, Options>) {
  const {
    className,
    optionClassName,
    style,
    optionStyle,
    property,
    disabled,
    manifests,
    onChange,
  } = props;
  const propertyManifest = useMemo(
    () => (property ? getPropertyManifest(property, manifests) : undefined),
    [property, manifests],
  );
  const options = useMemo(
    () => (property ? getOptionsForProperty(property, manifests) : []),
    [property, manifests],
  );
  if (options.length === 0 || !propertyManifest) {
    return null;
  }
  return (
    <div className={classNames(className, 'mw-property-options')} style={style}>
      {options.map((option) => (
        <PropertyOption
          key={option.name.toString()}
          className={optionClassName}
          style={optionStyle}
          option={option}
          propertyManifest={propertyManifest}
          property={property}
          disabled={disabled}
          onChange={onChange}
        />
      ))}
    </div>
  );
}

export default PropertyOptions;
