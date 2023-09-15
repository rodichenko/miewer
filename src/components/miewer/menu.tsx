import React, { useCallback, useMemo } from 'react';
import type { ComponentType } from 'react';
import { Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import {
  AppstoreOutlined,
  CheckOutlined,
  ExportOutlined,
  LaptopOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import type { BasicComponentProps } from '../../@types/components/common';
import { MiewerPanel, miewerPanelNames } from '../../@types/components/panels';
import { useMiewerPanelsStore } from '../../stores/miewer-panels-store';
import { miewerPanelIconsSets } from '../shared/panel-toggle/panel-icons';
import { useScriptGenerator, useUrlGenerator } from '../../stores/miew-store';
import useGeneratedCodeModal from '../shared/generated-code-modal/use-generated-code-modal';
import GeneratedCodeModal from '../shared/generated-code-modal';
import { useThemesStore } from '../../stores/themes-store';

const trigger: ['click'] = ['click'];

function renderIcon(Icon: ComponentType<BasicComponentProps>) {
  return <Icon className="mw-header-menu-item-icon" />;
}

function Menu(props: BasicComponentProps) {
  const { className, style } = props;
  const panels = useMemo(() => Object.values(MiewerPanel), []);
  const { panels: visiblePanels, togglePanel } = useMiewerPanelsStore();
  const { themes, theme, setTheme } = useThemesStore();
  const urlGenerator = useUrlGenerator();
  const scriptGenerator = useScriptGenerator();
  const {
    visible: urlVisible,
    onShow: urlShow,
    onHide: urlHide,
  } = useGeneratedCodeModal();
  const {
    visible: scriptVisible,
    onShow: scriptShow,
    onHide: scriptHide,
  } = useGeneratedCodeModal();
  const handleKey = useCallback(
    (event: { key: string }) => {
      const { key } = event;
      if (key === 'url') {
        urlShow();
        return;
      }
      if (key === 'script') {
        scriptShow();
        return;
      }
      const panelKeyE = /^panels\/(.+)$/i.exec(key);
      if (panelKeyE?.[1]) {
        togglePanel(panelKeyE[1] as MiewerPanel);
      }
      const themeKeyE = /^theme\/(.+)$/i.exec(key);
      if (themeKeyE?.[1]) {
        setTheme(themeKeyE[1]);
      }
    },
    [urlShow, scriptShow, togglePanel, setTheme],
  );
  const options = useMemo<MenuProps['items']>(
    () => [
      {
        key: 'panels',
        label: 'Panels',
        icon: <AppstoreOutlined />,
        children: panels.map((panel) => ({
          key: `panels/${panel}`,
          label: (
            <div className="mw-header-menu-item-text">
              {renderIcon(miewerPanelIconsSets[panel].icon)}
              <span>{miewerPanelNames[panel]}</span>
              {visiblePanels.has(panel) && (
                <CheckOutlined style={{ marginLeft: 'auto' }} />
              )}
            </div>
          ),
        })),
      },
      {
        type: 'divider',
      },
      {
        key: 'appearance',
        label: 'Appearance',
        icon: <LaptopOutlined />,
        children: themes.map((aTheme) => ({
          key: `theme/${aTheme.id}`,
          label: (
            <div className="mw-header-menu-item-text">
              <span>{aTheme.title}</span>
              {theme.id === aTheme.id && (
                <CheckOutlined style={{ marginLeft: 'auto' }} />
              )}
            </div>
          ),
        })),
      },
      {
        type: 'divider',
      },
      {
        key: 'url',
        label: 'Generate URL',
        icon: <ExportOutlined />,
      },
      {
        key: 'script',
        label: 'Generate script',
        icon: <ExportOutlined />,
      },
    ],
    [panels, visiblePanels, themes, theme],
  );
  const menu = useMemo<MenuProps>(
    () => ({
      items: options,
      onClick: handleKey,
    }),
    [options, handleKey],
  );
  return (
    <>
      <Dropdown menu={menu} trigger={trigger} overlayClassName="mw-header-menu">
        <Button className={className} style={style} type="text">
          <MenuOutlined />
        </Button>
      </Dropdown>
      <GeneratedCodeModal
        title="URL"
        visible={urlVisible}
        onClose={urlHide}
        generator={urlGenerator}
      />
      <GeneratedCodeModal
        title="Script"
        visible={scriptVisible}
        onClose={scriptHide}
        generator={scriptGenerator}
      />
    </>
  );
}

export default Menu;
