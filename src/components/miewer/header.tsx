import React from 'react';
import PanelToggle from '../shared/panel-toggle';
import { MiewerPanel } from '../../@types/components/panels';
import type { MiewerHeaderProps } from '../../@types/components/panels';
import Menu from './menu';
import Search from './search';

function Header(props: MiewerHeaderProps) {
  const { panelTogglesDisplayName } = props;
  return (
    <div className="mw-miewer-header mw-row mw-end">
      <Menu />
      <Search className="mw-control mw-input-as-text" />
      <PanelToggle
        className="mw-miewer-header-toggle"
        panel={MiewerPanel.terminal}
        displayName={panelTogglesDisplayName}
      />
      <PanelToggle
        className="mw-miewer-header-toggle"
        panel={MiewerPanel.sequences}
        displayName={panelTogglesDisplayName}
      />
      <PanelToggle
        className="mw-miewer-header-toggle"
        panel={MiewerPanel.representations}
        displayName={panelTogglesDisplayName}
      />
    </div>
  );
}

export default Header;
