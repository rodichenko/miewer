export type MiewerColor = number;

export type Nullable<T> = {
  [P in keyof T]?: T[P] | undefined;
};
