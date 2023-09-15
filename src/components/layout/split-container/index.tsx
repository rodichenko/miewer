import React, { useMemo } from 'react';
import type { Key } from 'react';
import classNames from 'classnames';
import Container, { SpaceContainer } from '../container';
import { getDirection } from '../container/utilities';
import SplitContainerDivider from './divider';
import type {
  ContainerChild,
  ContainerChildSize,
  ContainerChildProps,
  ContainerProps,
} from '../../../@types/components/layout';
import { useChildrenSize } from '../container/hooks/use-children-sizes';
import { resizerContext } from './hooks/resize-context';

export type SplitContainerProps = ContainerProps & {
  dividerSize?: number;
};

function getChildKey(child: ContainerChild): Key | undefined {
  if (child && typeof child !== 'boolean') {
    return child.key ?? undefined;
  }
  return undefined;
}

function getChildSizeProps(child: ContainerChild): ContainerChildProps {
  if (child && typeof child !== 'boolean') {
    if (child.type === SpaceContainer) {
      return {
        flex: true,
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
      flex: true,
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
    React.Children.forEach(children, (child, index) => {
      if (child) {
        const key = getChildKey(child) ?? `child-${index}`;
        if (mapped.length > 0) {
          mapped.push(
            <SplitContainerDivider
              key={`divider-${key}`}
              size={dividerSize}
              minSize={dividerSize}
              direction={direction}
              previous={(index - 1) * 2}
              next={index * 2}
            />,
          );
        }
        mapped.push(
          <Container key={key} {...getChildSizeProps(child)}>
            {cloneChildElementWithoutProps(child)}
          </Container>,
        );
      }
    });
    return mapped;
  }, [children, direction]);
  const [sizes, setSizes] = useChildrenSize(childrenWithDividers);
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
        {childrenWithDividers}
      </Container>
    </resizerContext.Provider>
  );
}

export default SplitContainer;
