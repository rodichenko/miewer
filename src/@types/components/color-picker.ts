import type { BasicComponentProps } from './common';
import type { MiewerColor } from '../base';
import type { ButtonType } from 'antd/es/button';

export type MiewerColorPickerProps = BasicComponentProps & {
  disabled?: boolean;
  color?: MiewerColor | undefined;
  onChange?: (color: MiewerColor | undefined) => void;
  type?: ButtonType;
  visible?: boolean;
  opened?: boolean;
  onOpenedChanged?: (opened: boolean) => void;
  size?: number;
  showValue?: boolean;
};
