import React from 'react';
import { Input } from '../shared/antd-overrides';
import PanelToggle from '../shared/panel-toggle';
import { MiewerPanel } from '../../@types/components/panels';
import Menu from './menu';

function Header() {
  return (
    <div className="mw-miewer-header mw-row mw-end">
      <Menu />
      <Input className="mw-control mw-input-as-text" placeholder="Search" />
      <PanelToggle
        className="mw-miewer-header-toggle"
        panel={MiewerPanel.terminal}
        displayName
      />
      <PanelToggle
        className="mw-miewer-header-toggle"
        panel={MiewerPanel.representations}
        displayName
      />
    </div>
  );
}

export default Header;
