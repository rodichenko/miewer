import React, { useCallback, useMemo } from 'react';
import { Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import type { PanelActionProps } from '../../../@types/components/panels';
import { findActionByKey, isPanelActionConfig } from '../../../helpers/panels';
import useActionsTree from './use-actions-tree';

function PanelAction(props: PanelActionProps) {
  const { className, style, action } = props;
  if (isPanelActionConfig(action)) {
    const { key, title, disabled, icon: Icon, onAction } = action;
    return (
      <Button
        disabled={disabled}
        type="text"
        className={className}
        style={style}
        onClick={onAction}>
        {Icon && <Icon />}
        {title}
        {(!Icon && !title) ?? key}
      </Button>
    );
  }
  const items = useActionsTree(action);
  const onAction = useCallback(
    (event: { key: string }) => {
      const execute = findActionByKey(event.key, [action]);
      if (execute) {
        execute.onAction();
      }
    },
    [action],
  );
  const menu = useMemo<MenuProps>(
    () => ({
      items,
      onClick: onAction,
    }),
    [items, onAction],
  );
  const { key, disabled, icon: Icon, title } = action;
  return (
    <Dropdown
      disabled={action.disabled}
      menu={menu}
      trigger={['click']}
      overlayClassName="mw-panel-action-menu-container">
      <Button
        disabled={disabled}
        type="text"
        className={className}
        style={style}>
        {Icon && <Icon />}
        {title}
        {(!Icon && !title) ?? key}
      </Button>
    </Dropdown>
  );
}

export default PanelAction;
