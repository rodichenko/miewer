import React from 'react';
import { ConfigProvider } from 'antd';
import type { ThemeConfig } from 'antd';
import MiewRenderer from '../miew';
import { useAntdThemes, useThemes } from '../../stores/themes-store';
import SplitContainer from '../layout/split-container';
import Container from '../layout/container';
import Panel from '../layout/panel';
import Terminal from '../terminal';
import {
  isRepresentationsVisible,
  isTerminalVisible,
} from '../../stores/miewer-panels-store';
import RepresentationsList from '../representations/list';
import Header from './header';
import { useSynchronizedMiewOptions } from '../../stores/miew-store';

function Miewer() {
  useThemes();
  // Todo: move `useSynchronizedMiewOptions` elsewhere
  useSynchronizedMiewOptions();
  const showTerminal = isTerminalVisible();
  const showRepresentations = isRepresentationsVisible();
  const antdTheme: ThemeConfig = useAntdThemes();
  return (
    <ConfigProvider componentSize="small" theme={antdTheme}>
      <MiewRenderer className="mw-miew" />
      <Container key="root" className="mw-full-size" direction="vertical">
        <Header key="header" />
        <SplitContainer key="body" flex direction="horizontal">
          <SplitContainer direction="vertical" flex>
            <Container key="space" flex />
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
            <Panel key="right" size={300} minSize={300}>
              <RepresentationsList className="mw-full-size" />
            </Panel>
          )}
        </SplitContainer>
      </Container>
    </ConfigProvider>
  );
}

export default Miewer;
