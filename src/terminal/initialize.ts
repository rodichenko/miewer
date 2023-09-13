import type { MiewerTerminalInterface } from '../@types/miewer/terminal';

export async function initialize(
  terminalDiv: HTMLElement,
): Promise<MiewerTerminalInterface> {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { MiewerTerminal } = await import(
    /* webpackChunkName: "miewer-terminal" */ './miewer-terminal'
  );
  const terminal = new MiewerTerminal(terminalDiv);
  await terminal.initialize();
  return terminal;
}
