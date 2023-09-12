import React from 'react';
import type { CSSProperties } from 'react';
import type { BasicComponentProps } from '../../../types/ui';
import type {
  ContainerChild,
  ContainerChildSize,
  ContainerProps,
} from '../types';
import { getFlexStyle } from '../utilities';
import {
  getDirection,
  getGridTemplateProperty,
  getSizeGridIndex,
} from './utilities';

export function mapContainerChild<P extends BasicComponentProps>(
  child: ContainerChild<P>,
  props: ContainerProps,
  size: ContainerChildSize | undefined,
): ContainerChild<P> {
  const { grid } = props;
  const direction = getDirection(props);
  if (!child) {
    return null;
  }
  if (typeof child === 'boolean') {
    return child;
  }
  const { style, ...rest } = child.props;
  const modifiedStyle = ((): CSSProperties | undefined => {
    if (size) {
      if (grid) {
        return {
          ...(style ?? {}),
          [getGridTemplateProperty(direction)]: getSizeGridIndex(size),
        };
      }
      return {
        ...(style ?? {}),
        ...(getFlexStyle(size) ?? {}),
      };
    }
    return style;
  })();
  return React.cloneElement(child, {
    ...(rest as Partial<P>),
    style: modifiedStyle,
  });
}
