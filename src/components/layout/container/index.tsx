import React from 'react';
import type { ContainerProps } from '../../../@types/components/layout';
import {
  getChildSizeConfigGenerator,
  getContainerClassName,
  mapContainerChild,
} from './utilities';
import SpaceContainer from './space-container';
import { useContainerStyle } from './hooks/use-container-style';

function Container(props: ContainerProps) {
  const { children } = props;
  const className = getContainerClassName(props);
  const [style, sizes] = useContainerStyle(props);
  const getChildSize = getChildSizeConfigGenerator(sizes);
  return (
    <div className={className} style={style}>
      {React.Children.map(children, (child, index) =>
        mapContainerChild(child, props, getChildSize(child, index)),
      )}
    </div>
  );
}

export { SpaceContainer };

export default Container;
