import type { MiewerColor } from '../base';
export { type DisplayColor } from './display-color';
export { type DisplayMode } from './display-mode';
export { type Material } from './material';

export type MiewBackgroundSetting = {
  color: MiewerColor;
  transparent?: boolean;
};

export enum MiewShadowType {
  random = 'random',
  basic = 'basic',
  pcf = 'pcf',
}

export type MiewShadowSetting = {
  on: boolean;
  type?: MiewShadowType;
  radius?: number;
};

export enum Palette {
  jm = 'JM',
  jmol = 'JMOL',
}

export type MiewSettings = {
  bg?: MiewBackgroundSetting;
  palette?: Palette;
  shadow?: MiewShadowSetting;
  ao?: boolean;
  aromatic?: boolean;
  autobuild?: boolean;
  autoRotation?: number;
  autoRotationAxisFixed?: boolean;
  axes?: boolean;
  colorers?: Record<any, any>;
  editing?: boolean;
  fbxprec?: number;
  fox?: boolean;
  fogFarFactor?: number;
  fogNearFactor?: number;
  fps?: boolean;
  fxaa?: boolean;
  interpolateViews?: boolean;
  maxfps?: number;
  modes?: Record<any, any>;
  outline?: boolean;
  pick?: string;
  picking?: boolean;
  singleUnit?: boolean;
  stereo?: string;
  suspendRender?: boolean;
  translationSpeed?: number;
  transparency?: string;
  zooming?: boolean;
  zSprite?: boolean;
};
