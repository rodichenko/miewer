import type { Miew } from 'miew';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface MiewerTerminalInterface {
  attach(miew: Miew | undefined): void;
  dispose(): void;
}
