import React, { forwardRef, type ForwardedRef } from 'react';
import type { ContainerProps } from '../../../@types/components/layout';
import {
  getChildSizeConfigGenerator,
  getContainerClassName,
  mapContainerChild,
} from './utilities';
import { useContainerStyle } from './hooks/use-container-style';

function renderContainer(
  props: ContainerProps,
  ref?: ForwardedRef<HTMLDivElement>,
) {
  const { children } = props;
  const className = getContainerClassName(props);
  const [style, sizes] = useContainerStyle(props);
  const getChildSize = getChildSizeConfigGenerator(sizes);
  return (
    <div ref={ref} className={className} style={style}>
      {React.Children.map(children, (child, index) =>
        mapContainerChild(child, props, getChildSize(child, index)),
      )}
    </div>
  );
}

function Container(props: ContainerProps) {
  return renderContainer(props);
}

const ContainerForwardRef = forwardRef(renderContainer);

export { ContainerForwardRef };

Container.Forwarded = ContainerForwardRef;

export default Container;
