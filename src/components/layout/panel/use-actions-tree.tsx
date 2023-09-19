import React, { useMemo } from 'react';
import type { MenuProps } from 'antd';
import type {
  PanelActionContainerConfig,
  PanelActionItem,
} from '../../../@types/components/panels';
import {
  isPanelActionConfig,
  isPanelActionDivider,
} from '../../../helpers/panels';
import { CheckOutlined } from '@ant-design/icons';

function reduceActionsTree(
  trees: Array<MenuProps['items']>,
): MenuProps['items'] {
  return trees.reduce<MenuProps['items']>(
    (result, items) => [...(result ?? []), ...(items ?? [])],
    [],
  );
}

function extractActionsTree(action: PanelActionItem): MenuProps['items'] {
  if (isPanelActionDivider(action)) {
    return [{ type: 'divider' }];
  }
  if (isPanelActionConfig(action)) {
    const { icon: Icon, key, title, checked, disabled } = action;
    return [
      {
        key,
        label: (
          <span className="mw-panel-action-menu-item">
            <span className="mw-panel-action-menu-item-title">
              {Icon && <Icon style={{ marginRight: 5, fontSize: 'larger' }} />}
              {title}
            </span>
            <span>
              {checked && <CheckOutlined style={{ marginLeft: 5 }} />}
            </span>
          </span>
        ),
        disabled,
      },
    ];
  }
  const { actions, icon: Icon, title, key } = action;
  if (actions.length > 0) {
    return [
      {
        key,
        label: title,
        icon: Icon && <Icon />,
        children: reduceActionsTree(actions.map(extractActionsTree)),
      },
    ];
  }
}

export default function useActionsTree(rootAction: PanelActionContainerConfig) {
  return useMemo<MenuProps['items']>(
    () => reduceActionsTree(rootAction.actions.map(extractActionsTree)),
    [rootAction],
  );
}
