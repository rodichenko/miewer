import React from 'react';
import {
  CodeOutlined,
  EditOutlined,
  CodeFilled,
  EditFilled,
} from '@ant-design/icons';
import { Button } from 'antd';
import {
  isRepresentationsVisible,
  isTerminalVisible,
  useToggleRepresentations,
  useToggleTerminal,
} from '../../stores/miewer-panels-store';

function Header() {
  const showTerminal = isTerminalVisible();
  const showRepresentations = isRepresentationsVisible();
  const toggleTerminal = useToggleTerminal();
  const toggleRepresentations = useToggleRepresentations();
  return (
    <div className="mw-miewer-header mw-row mw-end">
      <Button
        type="text"
        className="mw-miewer-header-toggle"
        onClick={toggleTerminal}>
        {showTerminal ? <CodeFilled /> : <CodeOutlined />}
      </Button>
      <Button
        type="text"
        className="mw-miewer-header-toggle"
        onClick={toggleRepresentations}>
        {showRepresentations ? <EditFilled /> : <EditOutlined />}
      </Button>
    </div>
  );
}

export default Header;
