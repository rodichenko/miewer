import React, { useCallback, useContext, useMemo, useRef } from 'react';
import classNames from 'classnames';
import type {
  ContainerDirection,
  ContainerProps,
  ContainerSizes,
} from '../types';
import useSplitContainerDivider from './hooks/use-split-container-divider';
import { resizerContext } from './hooks/resize-context';
import { setGridStyle, getDirection } from '../container/utilities';
import {
  getResizeSession,
  getResizeSessionFinalSizes,
  getResizeSessionSizesAfterDrag,
} from './utilities';
import type { GetDirectionSize, ResizeSession } from './types';

export type SplitContainerDividerProps = ContainerProps & {
  previous: number;
  next: number;
};

function getSizeGenerator(direction: ContainerDirection): GetDirectionSize {
  return (element: HTMLElement): number => {
    switch (direction) {
      case 'vertical':
        return element.offsetHeight;
      case 'horizontal':
      default:
        return element.offsetWidth;
    }
  };
}

function SplitContainerDivider(props: SplitContainerDividerProps) {
  const { className, style, previous, next } = props;
  const { sizes, setSizes } = useContext(resizerContext);
  const session = useRef<ResizeSession | undefined>(undefined);
  const direction = getDirection(props);
  const getSize: GetDirectionSize = useMemo(
    () => getSizeGenerator(direction),
    [direction],
  );
  const setGrid = useCallback(
    (element: HTMLElement, newSizes: ContainerSizes) =>
      setGridStyle(element, newSizes, direction),
    [direction],
  );
  const onDragStart = useCallback(
    (divider: HTMLElement): boolean => {
      session.current = getResizeSession(divider, sizes, getSize);
      return Boolean(session.current);
    },
    [session, sizes, getSize, direction],
  );
  const onDrag = useCallback(
    (divider: HTMLElement, delta: number) => {
      const { current } = session;
      if (current) {
        current.sizes = getResizeSessionSizesAfterDrag(current, delta);
        setGrid(current.grid, current.sizes);
      }
    },
    [session, setGrid],
  );
  const onDragFinish = useCallback(() => {
    const { current } = session;
    if (current) {
      const result = getResizeSessionFinalSizes(current, getSize);
      setSizes(result);
    }
    session.current = undefined;
  }, [session, getSize, setSizes]);
  const ref = useSplitContainerDivider(direction, {
    onDrag,
    onDragStart,
    onDragFinish,
  });
  return (
    <div
      ref={ref}
      className={classNames(
        'mw-split-container-divider',
        {
          horizontal: direction === 'horizontal',
          vertical: direction === 'vertical',
        },
        className,
      )}
      style={style}
      data-previous={previous}
      data-next={next}>
      <div className="mw-split-container-divider-content">{'\u00A0'}</div>
    </div>
  );
}

export default SplitContainerDivider;
