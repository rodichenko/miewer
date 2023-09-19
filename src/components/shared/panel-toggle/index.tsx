import React from 'react';
import { Button } from 'antd';
import type { PanelToggleProps } from '../../../@types/components/panels';
import {
  miewerPanelNames,
  miewerPanelShortNames,
} from '../../../@types/components/panels';
import {
  usePanelVisible,
  useTogglePanel,
} from '../../../stores/miewer-panels-store';
import { miewerPanelIconsSets } from './panel-icons';

function PanelToggle(props: PanelToggleProps) {
  const { panel, className, style, displayName } = props;
  const { iconOff, iconOn } = miewerPanelIconsSets[panel] ?? {};
  const visible = usePanelVisible(panel);
  const toggle = useTogglePanel(panel);
  const IconChild = visible ? iconOn : iconOff;
  return (
    <Button
      type={visible ? 'primary' : 'text'}
      className={className}
      style={style}
      onClick={toggle}>
      {<IconChild className="mw-panel-toggle-icon" />}
      {displayName && IconChild ? ' ' : null}
      {displayName && (
        <span>
          {displayName === 'short'
            ? miewerPanelShortNames[panel]
            : miewerPanelNames[panel]}
        </span>
      )}
    </Button>
  );
}

export default PanelToggle;
