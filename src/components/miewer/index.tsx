import React from 'react';
import { ConfigProvider } from 'antd';
import type { ThemeConfig } from 'antd';
import MiewRenderer from '../miew';
import { useAntdThemes, useThemes } from '../../stores/themes-store';
import SplitContainer from '../layout/split-container';
import Container, { SpaceContainer } from '../layout/container';
import Panel from '../layout/panel';
import Terminal from '../terminal';
import {
  isRepresentationsVisible,
  isTerminalVisible,
} from '../../stores/miewer-panels-store';
import RepresentationsList from '../representations';
import Header from './header';
import MiewSelectionInfo from '../miew-selection-info';

function Miewer() {
  useThemes();
  const showTerminal = isTerminalVisible();
  const showRepresentations = isRepresentationsVisible();
  const antdTheme: ThemeConfig = useAntdThemes();
  return (
    <ConfigProvider componentSize="small" theme={antdTheme}>
      <MiewRenderer className="mw-miew" />
      <Container key="root" className="mw-full-size" direction="vertical">
        <Header key="header" />
        <SplitContainer key="body" stretch direction="horizontal">
          <SplitContainer key="main" direction="vertical" stretch>
            <SpaceContainer />
            <Container key="test" direction="horizontal" flex="center">
              <MiewSelectionInfo />
            </Container>
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
          {showRepresentations && (
            <SplitContainer
              key="right"
              direction="vertical"
              size={300}
              minSize={300}>
              <Panel>
                <RepresentationsList className="mw-full-size" />
              </Panel>
            </SplitContainer>
          )}
        </SplitContainer>
      </Container>
    </ConfigProvider>
  );
}

export default Miewer;
