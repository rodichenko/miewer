import React, { useState } from 'react';
import {
  CodeOutlined,
  EditOutlined,
  CodeFilled,
  EditFilled,
  ExportOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import {
  isRepresentationsVisible,
  isTerminalVisible,
  useToggleRepresentations,
  useToggleTerminal,
} from '../../stores/miewer-panels-store';
import useGeneratedCodeModal from '../shared/generated-code-modal/use-generated-code-modal';
import GeneratedCodeModal from '../shared/generated-code-modal';
import { useScriptGenerator, useUrlGenerator } from '../../stores/miew-store';
import { Input } from '../shared/antd-overrides';

function Header() {
  const showTerminal = isTerminalVisible();
  const showRepresentations = isRepresentationsVisible();
  const toggleTerminal = useToggleTerminal();
  const urlGenerator = useUrlGenerator();
  const scriptGenerator = useScriptGenerator();
  const toggleRepresentations = useToggleRepresentations();
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
  return (
    <div className="mw-miewer-header mw-row mw-end">
      <Input className="mw-control mw-input-as-text" placeholder="Search" />
      <Button type="text" className="mw-miewer-header-toggle" onClick={urlShow}>
        <ExportOutlined className="mw-button-icon" /> URL
      </Button>
      <Button
        type="text"
        className="mw-miewer-header-toggle"
        onClick={scriptShow}>
        <ExportOutlined className="mw-button-icon" /> Script
      </Button>
      <Button
        type={showTerminal ? 'primary' : 'text'}
        className="mw-miewer-header-toggle"
        onClick={toggleTerminal}>
        {showTerminal ? (
          <CodeFilled className="mw-button-icon" />
        ) : (
          <CodeOutlined className="mw-button-icon" />
        )}{' '}
        Terminal
      </Button>
      <Button
        type={showRepresentations ? 'primary' : 'text'}
        className="mw-miewer-header-toggle"
        onClick={toggleRepresentations}>
        {showRepresentations ? (
          <EditFilled className="mw-button-icon" />
        ) : (
          <EditOutlined className="mw-button-icon" />
        )}{' '}
        Layers
      </Button>
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
    </div>
  );
}

export default Header;
