import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { initializeMiew } from '../../helpers/miew';
import classNames from 'classnames';
import { noop } from '../../helpers/rest';
import { useThemeConfig } from '../../themes/general';
import type { BasicComponentProps } from '../../types/ui';
import { useMiewStore } from './context';

function MiewRenderer(props: BasicComponentProps) {
  const { className, style } = props;
  const ref = useRef<HTMLDivElement>(null);
  const { miew, error, setMiew, setError } = useMiewStore();
  useLayoutEffect(() => {
    initializeMiew(ref.current)
      .then(setMiew)
      .catch((reason: Error) => {
        setError(reason.message);
      });
  }, [setError, setMiew]);
  const theme = useThemeConfig();
  useEffect(() => {
    if (miew) {
      miew.set('bg.color', theme.background);
    }
  }, [theme, miew]);
  useEffect(() => {
    if (miew) {
      setTimeout(() => {
        // Miew instance created. We need to initialize it
        if (!miew.init()) {
          setError('Error initializing Miew');
          return noop;
        }
        miew.run();
        miew.setOptions({ load: '1crn' });
      }, 2000);
      return () => {
        miew.term();
      };
    }
    return noop;
  }, [miew, setError]);
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
