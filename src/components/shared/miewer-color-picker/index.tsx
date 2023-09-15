import React, { useCallback, useMemo } from 'react';
import { Button, ColorPicker } from 'antd';
import type { Color } from 'antd/es/color-picker/color';
import type { MiewerColorPickerProps } from '../../../@types/components/color-picker';
import {
  colorValueToString,
  extractAlphaChannel,
  stringToColorValue,
} from '../../../helpers/colors';
import classNames from 'classnames';

function MiewerColorPicker(props: MiewerColorPickerProps) {
  const {
    className,
    style,
    disabled,
    color,
    onChange,
    visible = true,
    type = 'text',
    opened,
    onOpenedChanged,
    size = 20,
    showValue,
  } = props;
  const colorIsUnset = !color || color < 0;
  const pickerColor = useMemo<string>(
    () => colorValueToString(color && color >= 0 ? color : 0x0),
    [color],
  );
  const onChangeColor = useCallback(
    (changed: Color) => {
      if (typeof onChange === 'function') {
        const hex = changed.toHexString();
        const parsed = stringToColorValue(hex);
        if (extractAlphaChannel(hex) === 0) {
          onChange(-1);
        } else {
          onChange(parsed);
        }
      }
    },
    [onChange],
  );
  const displayStyle = useMemo(
    () => ({
      fill: colorIsUnset ? 'transparent' : pickerColor,
      width: size,
      height: size,
    }),
    [colorIsUnset, pickerColor, size],
  );
  if (visible) {
    return (
      <>
        {showValue && (
          <span className="mw-color-picker-display-value">
            {color && color >= 0 ? colorValueToString(color) : 'not set'}
          </span>
        )}
        <ColorPicker
          disabled={disabled}
          value={pickerColor}
          onChangeComplete={onChangeColor}
          open={opened}
          disabledAlpha
          onOpenChange={onOpenedChanged}>
          <Button
            type={type}
            disabled={disabled}
            className={classNames(className, 'mw-color-picker')}
            style={style}>
            <svg viewBox="0 0 20 20" style={displayStyle}>
              <circle cx="10" cy="10" r="8" strokeWidth="1"></circle>
            </svg>
          </Button>
        </ColorPicker>
      </>
    );
  }
  return null;
}

export default MiewerColorPicker;
