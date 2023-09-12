import React, { useEffect } from 'react';
import MiewRenderer from '../miew';
import { useThemes } from '../../themes/general';
import SplitContainer from '../layout/split-container';
import Container from '../layout/container';
import Panel from '../layout/panel';
import Terminal from '../terminal';
import { isTerminalVisible, useSetTerminalVisible } from './panels';

function Miewer() {
  useThemes();
  const showTerminal = isTerminalVisible();
  const setTerminalVisible = useSetTerminalVisible();
  useEffect(() => {
    setTimeout(() => {
      setTerminalVisible(true);
    }, 2000);
  }, [setTerminalVisible]);
  return (
    <>
      <MiewRenderer className="mw-miew" />
      <SplitContainer
        key="root"
        className="mw-full-size"
        direction="horizontal">
        <SplitContainer direction="vertical" size="*">
          <Container key="space" size="*" />
          {showTerminal && (
            <Panel
              key="terminal"
              size="20%"
              minSize={150}
              noPadding
              transparent>
              <Terminal className="mw-full-size" />
            </Panel>
          )}
        </SplitContainer>
        <Panel key="right" size={300} minSize={300}>
          Miew panel
        </Panel>
      </SplitContainer>
    </>
  );
}

export default Miewer;
