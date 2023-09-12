/* eslint-disable no-bitwise */
import type { MiewerColor } from '../types/base';

export function hexString(hex: number): string {
  const abs = Math.abs(hex);
  if (abs < 16) {
    return '0'.concat(Number(abs).toString(16));
  }
  return Number(abs).toString(16);
}

const channelBits = 0x8;

export function colorValueToString(color: MiewerColor, alpha?: number): string {
  const positiveValue = Math.abs(color);
  const r = ((positiveValue >> channelBits) >> channelBits) & 0xff;
  const g = (positiveValue >> channelBits) & 0xff;
  const b = positiveValue & 0xff;
  if (alpha === undefined) {
    return `#${hexString(r)}${hexString(g)}${hexString(b)}`;
  }
  return `#${hexString(r)}${hexString(g)}${hexString(b)}${hexString(
    Math.floor(0xff * alpha),
  )}`;
}
