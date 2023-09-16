import React, { useMemo } from 'react';
import type { Key } from 'react';
import classNames from 'classnames';
import Container, { SpaceContainer } from '../container';
import { getDirection } from '../container/utilities';
import SplitContainerDivider from './divider';
import type {
  ContainerChild,
  ContainerChildSize,
  CommonLayoutProps,
  ContainerProps,
  LayoutSizeInfo,
} from '../../../@types/components/layout';
import { useChildrenSize } from '../container/hooks/use-children-sizes';
import { resizerContext } from './hooks/resize-context';
import { getSizeInfo } from '../utilities';

export type SplitContainerProps = ContainerProps & {
  dividerSize?: number;
};

function getChildKey(child: ContainerChild): Key | undefined {
  if (child && typeof child !== 'boolean') {
    return child.key ?? undefined;
  }
  return undefined;
}

function getChildProps(child: ContainerChild): CommonLayoutProps {
  if (child && typeof child !== 'boolean') {
    if (child.type === SpaceContainer) {
      return {
        className: 'mw-space-container',
        stretch: true,
        minSize: 0,
      };
    }
    return child.props as ContainerChildSize;
  }
  return {};
}

function cloneChildElementWithoutProps(child: ContainerChild): ContainerChild {
  if (child && typeof child !== 'boolean') {
    return React.cloneElement(child, {
      size: undefined,
      minSize: undefined,
      stretch: true,
    });
  }
  return child;
}

function SplitContainer(props: SplitContainerProps) {
  const { children, className, dividerSize = 4, ...containerProps } = props;
  const splitContainerClassName = classNames(className, 'mw-split-container');
  const direction = getDirection(props);
  const childrenWithDividers = useMemo(() => {
    const mapped: ContainerChild[] = [];
    let previousInfo: LayoutSizeInfo | undefined;
    React.Children.forEach(children, (child, index) => {
      if (child) {
        const key = getChildKey(child) ?? `child-${index}`;
        const childProps = getChildProps(child);
        const info = getSizeInfo(childProps.size);
        if (previousInfo) {
          const disabled = previousInfo.auto && info.auto;
          mapped.push(
            <SplitContainerDivider
              key={`divider-${key}`}
              disabled={disabled}
              size={disabled ? 0 : dividerSize}
              minSize={disabled ? 0 : dividerSize}
              direction={direction}
              previous={(index - 1) * 2}
              next={index * 2}
            />,
          );
        }
        previousInfo = info;
        mapped.push(
          <Container key={key} {...childProps}>
            {cloneChildElementWithoutProps(child)}
          </Container>,
        );
      }
    });
    return mapped;
  }, [children, direction]);
  const [sizes, synchronizedChildren, setSizes] =
    useChildrenSize(childrenWithDividers);
  const context = useMemo(
    () => ({
      sizes,
      setSizes,
    }),
    [sizes, setSizes],
  );
  return (
    <resizerContext.Provider value={context}>
      <Container
        className={splitContainerClassName}
        grid
        {...containerProps}
        gridSizes={sizes}>
        {synchronizedChildren}
      </Container>
    </resizerContext.Provider>
  );
}

export default SplitContainer;
