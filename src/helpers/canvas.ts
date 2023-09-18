export function getDprValue(value: number): number {
  return value * window.devicePixelRatio;
}

export function getUnDprValue(value: number): number {
  return value / window.devicePixelRatio;
}
