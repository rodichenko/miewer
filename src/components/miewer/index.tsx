import React from 'react';
import type { ThemeConfig } from 'antd';
import { ConfigProvider } from 'antd';
import MiewRenderer from '../miew';
import { useAntdThemes, useThemes } from '../../stores/themes-store';
import { MiewerPanel as MiewerPanelType } from '../../@types/components/panels';
import {
  Container,
  MiewerPanel,
  SpaceContainer,
  SplitContainer,
} from '../layout';
import Terminal from '../terminal';
import { usePanelVisible } from '../../stores/miewer-panels-store';
import RepresentationsList from '../representations';
import Header from './header';
import MiewSelectionInfo from '../miew-selection-info';
import ChainSequencesPanel, {
  useShowChainSequences,
} from '../chain-sequences/panel';
import RepresentationsPanel from '../representations/panel';

function Miewer() {
  useThemes();
  const showTerminal = usePanelVisible(MiewerPanelType.terminal);
  const showRepresentations = usePanelVisible(MiewerPanelType.representations);
  const showChainSequences = usePanelVisible(MiewerPanelType.sequences);
  const hasChainSequences = useShowChainSequences();
  const antdTheme: ThemeConfig = useAntdThemes();
  return (
    <ConfigProvider componentSize="small" theme={antdTheme}>
      <MiewRenderer className="mw-miew" />
      <Container
        key="root"
        className="mw-full-size overflow-hidden"
        direction="vertical">
        <Header key="header" />
        <SplitContainer key="body" stretch direction="horizontal">
          <SplitContainer key="main" direction="vertical" stretch>
            {showChainSequences && hasChainSequences && (
              <ChainSequencesPanel key="structure" size="auto" />
            )}
            <SpaceContainer />
            <Container
              key="selection-info"
              direction="horizontal"
              size="auto"
              flex="center">
              <MiewSelectionInfo />
            </Container>
            {showTerminal && (
              <MiewerPanel
                key="terminal"
                panel="terminal"
                titleClassName="mw-terminal-title"
                size="20%"
                minSize={150}
                noPadding>
                <Terminal className="mw-full-size" />
              </MiewerPanel>
            )}
          </SplitContainer>
          {showRepresentations && (
            <SplitContainer
              key="right"
              direction="vertical"
              size={300}
              minSize={300}>
              <RepresentationsPanel />
            </SplitContainer>
          )}
        </SplitContainer>
      </Container>
    </ConfigProvider>
  );
}

export default Miewer;
