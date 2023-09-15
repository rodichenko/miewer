import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { BasicComponentProps } from '../../@types/components/common';
import { useMiew } from '../../stores/miew-store';
import classNames from 'classnames';
import { noop } from '../../helpers/rest';
import type { MiewerTerminalInterface } from '../../@types/terminal';
import { initialize } from '../../terminal/initialize';

function Terminal(props: BasicComponentProps) {
  const { className, style } = props;
  const miew = useMiew();
  const [terminal, setTerminal] = useState<
    MiewerTerminalInterface | undefined
  >();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/ban-types
  const terminalRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    const { current: terminalDiv } = terminalRef;
    if (terminalDiv) {
      setLoading(true);
      initialize(terminalDiv)
        .then((aTerminal) => {
          setTerminal(aTerminal);
          setLoading(false);
        })
        .catch((reason: Error) => {
          setError(reason.message);
          setLoading(false);
        });
    }
  }, [terminalRef, setError, setLoading, setTerminal]);
  useEffect(() => {
    if (terminal) {
      return () => {
        terminal.dispose();
      };
    }
    return noop;
  }, [terminal]);
  useEffect(() => {
    if (terminal) {
      terminal.attach(miew);
    }
    return noop;
  }, [terminal, miew]);
  const errors: string[] = useMemo(() => {
    const result = [];
    if (!miew) {
      result.push('Miew is not initialized');
    }
    if (error) {
      result.push(error);
    }
    return result;
  }, [miew, error]);
  return (
    <div
      className={classNames(className, 'mw-miewer-terminal-container')}
      style={style}>
      <div
        ref={terminalRef}
        className={classNames('mw-full-size', 'mw-miewer-terminal')}
      />
      {(loading || errors.length > 0) && (
        <div
          className={classNames(
            'mw-full-size',
            'mw-centered',
            'mw-miewer-terminal-messages',
          )}>
          {loading && (
            <span
              className={classNames(
                'mw-text-faded',
                'mw-miewer-terminal-message',
              )}>
              Loading terminal...
            </span>
          )}
          {errors.map((error, idx) => (
            <span
              key={`error-${idx}`}
              className={classNames('mw-miew-terminal-message', 'mw-error')}>
              {error}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default Terminal;
