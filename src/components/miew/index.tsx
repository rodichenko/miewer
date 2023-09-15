import React, { useLayoutEffect, useRef } from 'react';
import classNames from 'classnames';
import { initializeMiew } from '../../helpers/miew/lazy-initialization';
import type { BasicComponentProps } from '../../@types/components/common';
import {
  useMiewStore,
  useSynchronizedMiewOptions,
} from '../../stores/miew-store';
import useInitializationOptions from './use-initialization-options';

function MiewRenderer(props: BasicComponentProps) {
  useSynchronizedMiewOptions();
  const { className, style } = props;
  const ref = useRef<HTMLDivElement>(null);
  const { miew, error, setMiew, setError } = useMiewStore();
  const initializationOptions = useInitializationOptions(
    ref.current ?? undefined,
  );
  useLayoutEffect(() => {
    if (initializationOptions) {
      initializeMiew(initializationOptions)
        .then(setMiew)
        .catch((reason: Error) => {
          setError(reason.message);
        });
    }
  }, [setError, setMiew, initializationOptions]);
  return (
    <div className={className} style={style}>
      <div ref={ref} className="mw-full-size" />
      {!error && !miew && (
        <div className={classNames('mw-full-size', 'mw-centered')}>
          <span className={classNames('mw-miew-message', 'mw-text-faded')}>
            Initialization...
          </span>
        </div>
      )}
      {error && (
        <div className={classNames('mw-error', 'mw-full-size', 'mw-centered')}>
          <span className="mw-miew-message">{error}</span>
        </div>
      )}
    </div>
  );
}

export default MiewRenderer;
