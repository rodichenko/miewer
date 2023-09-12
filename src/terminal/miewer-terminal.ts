import type { Miew } from 'miew';
import type { MiewerTerminalInterface } from './types';
import 'jquery.terminal';
import 'jquery.terminal/css/jquery.terminal.min.css';
import type EventDispatcher from 'miew/dist/utils/EventDispatcher';

declare type OnMiewResponse = (response: any) => void;
declare type MiewExec = (
  command: string,
  onSuccess: OnMiewResponse,
  onError: OnMiewResponse,
) => void;

class MiewerTerminal implements MiewerTerminalInterface {
  private readonly _container: HTMLElement;
  private _miew: Miew | undefined;
  private _terminal: JQueryTerminal | undefined;
  private _focused: boolean;

  constructor(container: HTMLElement) {
    this._container = container;
    this._miew = undefined;
    this._focused = false;
  }

  async initialize(): Promise<void> {
    const { default: $ } = await import('jquery');
    this._terminal = $(this._container).terminal(this.interpreter.bind(this), {
      greetings:
        'Miew - 3D Molecular Viewer\nCopyright © 2015-2023 EPAM Systems, Inc.\n',
      prompt: 'miew> ',
      scrollOnEcho: true,
      onFocus: this.onTerminalFocus,
      onBlur: this.onTerminalBlur,
    });
    this.onTerminalFocus();
  }

  attach(miew: Miew | undefined): void {
    if (this._miew !== miew) {
      this.detachMiew();
      this._miew = miew;
      this.attachMiew();
    }
  }

  dispose(): void {
    if (this._terminal) {
      this._terminal.destroy();
      this._terminal = undefined;
    }
  }

  private interpreter(command: string): void {
    if (this._miew) {
      const exec = (this._miew as any).script as MiewExec;
      exec.call(
        this._miew,
        command,
        this.onMiewResponse,
        this.onMiewResponseError,
      );
    }
  }

  private attachMiew(): void {
    this.detachMiew();
    if (this._miew) {
      const logger = (this._miew as any).logger as EventDispatcher;
      logger.addEventListener('message', this.onMiewMessage);
      this.manageMiewHotKeys();
    }
  }

  private detachMiew(): void {
    if (this._miew) {
      const logger = (this._miew as any).logger as EventDispatcher;
      logger.removeEventListener('message', this.onMiewMessage);
    }
  }

  private readonly onMiewMessage = (event: {
    message: string;
    level: string;
  }): void => {
    if (event.message && this._terminal) {
      switch (event.level) {
        case 'error':
          this._terminal.error(event.message);
          break;
        default:
          this._terminal.echo(event.message);
      }
    }
  };

  private readonly onMiewResponse = (message: string): void => {
    if (this._terminal) {
      this._terminal.echo(message);
    }
  };

  private readonly onMiewResponseError = (error: string): void => {
    if (this._terminal) {
      this._terminal.error(error);
    }
  };

  private readonly onTerminalFocus = (): void => {
    this._focused = true;
    this.manageMiewHotKeys();
  };

  private readonly onTerminalBlur = (): void => {
    this._focused = false;
    this.manageMiewHotKeys();
  };

  private manageMiewHotKeys(): void {
    if (this._miew) {
      this._miew.enableHotKeys(!this._focused);
    }
  }
}

export { MiewerTerminal };
