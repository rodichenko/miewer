import React, { useMemo } from 'react';
import type { Key } from 'react';
import classNames from 'classnames';
import Container from '../container';
import {
  getDirection,
  extractChildSizeConfiguration,
} from '../container/utilities';
import SplitContainerDivider from './divider';
import type {
  ContainerChild,
  CommonLayoutProps,
  ContainerProps,
  LayoutSizeInfo,
} from '../../../@types/components/layout';
import { useChildrenSize } from '../container/hooks/use-children-sizes';
import { resizerContext } from './hooks/resize-context';
import { getSizeInfo } from '../utilities';

const splitContainerDefaultChildSize = '*';

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
    return {
      ...(child.props ?? {}),
      ...extractChildSizeConfiguration(child, splitContainerDefaultChildSize),
    };
  }
  return extractChildSizeConfiguration(child, splitContainerDefaultChildSize);
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

declare type LayoutSizeInfoWithIndex = LayoutSizeInfo & { index: number };

function SplitContainer(props: SplitContainerProps) {
  const { children, className, dividerSize = 4, ...containerProps } = props;
  const splitContainerClassName = classNames(className, 'mw-split-container');
  const direction = getDirection(props);
  const childrenWithDividers = useMemo(() => {
    const mapped: ContainerChild[] = [];
    let previousInfo: LayoutSizeInfo | undefined;
    let previousResizableInfo: LayoutSizeInfoWithIndex | undefined;
    let childIndex = -1;
    React.Children.forEach(children, (child, index) => {
      if (child) {
        const key = getChildKey(child) ?? `child-${index}`;
        const childProps = getChildProps(child);
        const info = getSizeInfo(childProps.size);
        const resizable = !info.auto;
        if (previousResizableInfo && resizable) {
          childIndex += 1;
          mapped.push(
            <SplitContainerDivider
              key={`divider-${key}`}
              size={dividerSize}
              minSize={dividerSize}
              direction={direction}
              previous={previousResizableInfo.index}
              next={childIndex + 1}
            />,
          );
        }
        childIndex += 1;
        if (resizable) {
          previousResizableInfo = { ...info, index: childIndex };
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
  const [sizes, synchronizedChildren, setSizes] = useChildrenSize(
    childrenWithDividers,
    splitContainerDefaultChildSize,
  );
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
        defaultChildSize={splitContainerDefaultChildSize}
        gridSizes={sizes}>
        {synchronizedChildren}
      </Container>
    </resizerContext.Provider>
  );
}

export default SplitContainer;
