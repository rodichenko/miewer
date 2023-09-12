import React from 'react';
import classNames from 'classnames';
import type { PanelProps } from './types';

function Panel(props: PanelProps) {
  const { className, children, style, bordered, noPadding, transparent } =
    props;
  return (
    <div
      className={classNames('mw-panel', className, {
        'mw-panel-bordered': bordered,
        'mw-panel-no-padding': noPadding,
        'mw-panel-transparent': transparent,
      })}
      style={style}>
      {children}
    </div>
  );
}

export default Panel;
