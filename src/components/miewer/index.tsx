import React, { useMemo } from 'react';
import { ConfigProvider, theme } from 'antd';
import type { ThemeConfig } from 'antd';
import MiewRenderer from '../miew';
import { useThemeConfig, useThemes } from '../../stores/themes-store';
import SplitContainer from '../layout/split-container';
import Container from '../layout/container';
import Panel from '../layout/panel';
import Terminal from '../terminal';
import {
  isPresentationsVisible,
  isTerminalVisible,
} from '../../stores/miewer-panels-store';
import RepresentationsList from '../representations/list';
import { colorValueToString } from '../../helpers/colors';
import { useSynchronizedMiewOptions } from '../../stores/miew-store';
import type { MapToken, SeedToken } from 'antd/es/theme/interface';

function dropDownDarkAlgorithm(seedToken: SeedToken): MapToken {
  const mapToken = theme.darkAlgorithm(seedToken);
  mapToken.colorPrimary = mapToken.colorText;
  mapToken.colorPrimaryBg = mapToken.colorFillTertiary;
  mapToken.colorPrimaryBgHover = mapToken.colorFillSecondary;
  return mapToken;
}

function Miewer() {
  useThemes();
  // Todo: move `useSynchronizedMiewOptions` elsewhere
  useSynchronizedMiewOptions();
  const themeConfig = useThemeConfig();
  const showTerminal = isTerminalVisible();
  const showPresentations = isPresentationsVisible();
  const antdTheme: ThemeConfig = useMemo(
    () => ({
      algorithm: themeConfig.dark
        ? [theme.darkAlgorithm]
        : [theme.defaultAlgorithm],
      token: {
        borderRadiusOuter: 0,
        borderRadius: 0,
        colorError: colorValueToString(themeConfig.error),
        fontFamily: themeConfig.fontFamily,
        fontSize: themeConfig.fontSize,
      },
      components: {
        Dropdown: {
          algorithm: themeConfig.dark
            ? [dropDownDarkAlgorithm]
            : [theme.defaultAlgorithm],
        },
        Select: {
          algorithm: themeConfig.dark
            ? [dropDownDarkAlgorithm]
            : [theme.defaultAlgorithm],
        },
      },
    }),
    [themeConfig, theme],
  );
  return (
    <ConfigProvider componentSize="small" theme={antdTheme}>
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
        {showPresentations && (
          <Panel key="right" size={300} minSize={300}>
            <RepresentationsList className="mw-full-size" />
          </Panel>
        )}
      </SplitContainer>
    </ConfigProvider>
  );
}

export default Miewer;
