import React from 'react';
import classNames from 'classnames';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import type { PanelProps } from '../../../@types/components/panels';
import PanelAction from './panel-action';

function Panel(props: PanelProps) {
  const {
    className,
    title,
    titleClassName,
    titleStyle,
    onClose,
    actions,
    children,
    style,
    bordered,
    noPadding,
    transparent,
  } = props;
  const closable = typeof onClose === 'function';
  return (
    <div
      className={classNames('mw-panel', className, {
        'mw-panel-bordered': bordered,
        'mw-panel-no-padding': noPadding,
        'mw-panel-transparent': transparent,
      })}
      style={style}>
      {(title ?? closable ?? actions) && (
        <div className="mw-panel-header">
          <div
            className={classNames('mw-panel-title', titleClassName)}
            style={titleStyle}>
            {title}
          </div>
          <div className="mw-panel-actions">
            {(actions ?? []).map((action) => (
              <PanelAction
                className="mw-panel-action"
                key={action.key}
                action={action}
              />
            ))}
            {actions && actions.length > 0 && closable && (
              <div className="mw-panel-action-divider" />
            )}
            {closable && (
              <Button
                className="mw-panel-action mw-panel-close"
                type="text"
                onClick={onClose}>
                <CloseOutlined />
              </Button>
            )}
          </div>
        </div>
      )}
      <div className="mw-panel-content">{children}</div>
    </div>
  );
}

export default Panel;
