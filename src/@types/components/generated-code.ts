import type { BasicComponentProps, ModalProps } from './common';
import type { MiewOptionsToCodeGenerator } from '../miew';

export type GeneratedCodeModalProps = ModalProps &
  BasicComponentProps & {
    generator: MiewOptionsToCodeGenerator;
  };
