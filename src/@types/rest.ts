export type QueryStringEntry = {
  key: string;
  value: string;
};

export type AnimationConfig = {
  from: number;
  to: number;
  durationMs: number;
  reportLastValueOnAborted?: boolean;
};

export type AnimationCallback = (value: number) => void;
export type AnimationAbortCallback = () => void;

export type ReadSettingsCallback<T> = () => T;
export type SaveSettingsCallback<T> = (value: T | undefined) => void;

export type LocalSettings<T> = {
  read: ReadSettingsCallback<T>;
  save: SaveSettingsCallback<T>;
};
