import type { MiewerPanelIconsSet } from '../../../@types/components/panels';
import { MiewerPanel } from '../../../@types/components/panels';
import {
  CodeFilled,
  CodeOutlined,
  EditFilled,
  EditOutlined,
  FontColorsOutlined,
} from '@ant-design/icons';
import React from 'react';

export const miewerPanelIconsSets: Record<MiewerPanel, MiewerPanelIconsSet> = {
  [MiewerPanel.terminal]: {
    icon: CodeOutlined,
    iconOn: CodeFilled,
    iconOff: CodeOutlined,
  },
  [MiewerPanel.representations]: {
    icon: EditOutlined,
    iconOn: EditFilled,
    iconOff: EditOutlined,
  },
  [MiewerPanel.sequences]: {
    icon: FontColorsOutlined,
    iconOn: FontColorsOutlined,
    iconOff: FontColorsOutlined,
  },
};
