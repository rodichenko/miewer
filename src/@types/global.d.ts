/* eslint-disable @typescript-eslint/naming-convention */
declare const PACKAGE_VERSION: string;
declare const DEVELOPMENT: boolean;
declare const TEST: boolean;
declare const TITLE: string;

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare type OnMiewResponse = (response: any) => void;
declare type MiewExec = (
  command: string,
  onSuccess: OnMiewResponse,
  onError: OnMiewResponse,
) => void;
