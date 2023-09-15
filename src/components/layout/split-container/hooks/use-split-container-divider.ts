/* eslint-disable @typescript-eslint/ban-types */
import { useLayoutEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';
import type {
  ContainerDirection,
  DividerCallbacks,
} from '../../../../@types/components/layout';
import { noop } from '../../../../helpers/rest';

declare type Point = {
  x: number;
  y: number;
};

export default function useSplitContainerDivider(
  dividerDirection: ContainerDirection,
  callbacks: DividerCallbacks,
): MutableRefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null);
  const { onDrag, onDragFinish, onDragStart } = callbacks;
  useLayoutEffect(() => {
    const { current } = ref;
    if (current) {
      let moving: Point | undefined;
      const onMouseDown = (event: MouseEvent) => {
        if (event.button === 0 && onDragStart(current)) {
          moving = {
            x: event.clientX,
            y: event.clientY,
          };
          current.classList.add('mw-divider-moving');
        }
      };
      const onMouseMove = (event: MouseEvent) => {
        if (moving) {
          event.preventDefault();
          const deltaPoint: Point = {
            x: event.clientX - moving.x,
            y: event.clientY - moving.y,
          };
          onDrag(
            current,
            dividerDirection === 'horizontal' ? deltaPoint.x : deltaPoint.y,
          );
        }
      };
      const onMouseUp = (event: MouseEvent) => {
        if (moving) {
          onMouseMove(event);
          current.classList.remove('mw-divider-moving');
          moving = undefined;
          onDragFinish(current);
        }
      };
      current.addEventListener('mousedown', onMouseDown);
      // We need to capture mousemove / mouseup, because Miew stops propagation of
      // this events
      window.addEventListener('mouseup', onMouseUp, { capture: true });
      window.addEventListener('mousemove', onMouseMove, { capture: true });
      return () => {
        current.addEventListener('mousedown', onMouseDown);
        window.removeEventListener('mouseup', onMouseUp, { capture: true });
        window.removeEventListener('mousemove', onMouseMove, { capture: true });
      };
    }
    return noop;
  }, [ref, dividerDirection, onDrag, onDragFinish, onDragStart]);
  return ref;
}
