import { useCallback } from 'react';
import type {
  FocusEventHandler,
  ComponentType,
  FocusEvent,
  FunctionComponent,
} from 'react';
import type { FocusableProps } from '../../../@types/components/common';
import {
  useDisableMiewHotKeys,
  useEnableMiewHotKeys,
} from '../../../stores/miew-store';

export function miewerInputHoc<P extends FocusableProps>(
  WrappedComponent: ComponentType<P>,
): FunctionComponent<P> {
  // eslint-disable-next-line react/display-name
  return function (props: P) {
    const { onBlur, onFocus } = props;
    const enableMiewHotKeys = useEnableMiewHotKeys();
    const disableMiewHotKeys = useDisableMiewHotKeys();
    const onFocusHoc: FocusEventHandler = useCallback(
      (event: FocusEvent) => {
        disableMiewHotKeys();
        if (typeof onFocus === 'function') {
          onFocus(event);
        }
      },
      [onFocus, disableMiewHotKeys],
    );
    const onBlurHoc: FocusEventHandler = useCallback(
      (event: FocusEvent) => {
        enableMiewHotKeys();
        if (typeof onBlur === 'function') {
          onBlur(event);
        }
      },
      [onBlur, enableMiewHotKeys],
    );
    return (
      <WrappedComponent {...props} onBlur={onBlurHoc} onFocus={onFocusHoc} />
    );
  };
}
