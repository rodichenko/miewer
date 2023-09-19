import type {
  PanelActionConfig,
  PanelActionContainerConfig,
  PanelActionDividerConfig,
  PanelActionItem,
} from '../@types/components/panels';

export function isPanelActionDivider(
  action: PanelActionItem,
): action is PanelActionDividerConfig {
  return 'type' in action && action.type === 'divider';
}

export function isPanelActionContainer(
  action: PanelActionItem,
): action is PanelActionContainerConfig {
  return (
    !isPanelActionDivider(action) &&
    Boolean(action.title) &&
    'actions' in action &&
    Array.isArray(action.actions)
  );
}

export function isPanelActionConfig(
  action: PanelActionItem,
): action is PanelActionConfig {
  return !isPanelActionDivider(action) && !isPanelActionContainer(action);
}

export function findActionByKey(
  key: string,
  actions: PanelActionItem[],
): PanelActionConfig | undefined {
  for (const action of actions) {
    if (isPanelActionConfig(action) && action.key === key) {
      return action;
    }
    if (isPanelActionContainer(action)) {
      if (action.key === key) {
        return undefined;
      }
      const child = findActionByKey(key, action.actions);
      if (child) {
        return child;
      }
    }
  }
  return undefined;
}
