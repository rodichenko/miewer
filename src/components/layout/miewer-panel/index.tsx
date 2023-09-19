import React, { useMemo } from 'react';
import type { ReactNode } from 'react';
import Panel from '../panel';
import type {
  MiewerPanel as MiewerPanelType,
  MiewerPanelProps,
} from '../../../@types/components/panels';
import { miewerPanelNames } from '../../../@types/components/panels';
import { useClosePanel } from '../../../stores/miewer-panels-store';

function MiewerPanel(props: MiewerPanelProps) {
  const { panel, children, title, ...rest } = props;
  const closePanel = useClosePanel(panel as MiewerPanelType);
  const panelTitle = useMemo<ReactNode>(() => {
    if (title) {
      return title;
    }
    return miewerPanelNames[panel];
  }, [panel, title]);
  return (
    <Panel {...rest} title={panelTitle} onClose={closePanel}>
      {children}
    </Panel>
  );
}

export default MiewerPanel;
