/* eslint-disable no-bitwise */
import type { MiewerColor } from '../@types/base';

export function hexString(hex: number): string {
  const abs = Math.abs(hex);
  if (abs < 16) {
    return '0'.concat(Number(abs).toString(16));
  }
  return Number(abs).toString(16);
}

export function stringToHex(string: string): number {
  return Number(`0x${string}`);
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

export function colorValueToChannels(
  color: MiewerColor,
  alpha?: number,
): { r: number; g: number; b: number; a: number } {
  const positiveValue = Math.abs(color);
  const r = ((positiveValue >> channelBits) >> channelBits) & 0xff;
  const g = (positiveValue >> channelBits) & 0xff;
  const b = positiveValue & 0xff;
  return {
    r,
    g,
    b,
    a: alpha ?? 255,
  };
}

export function stringToColorValue(color: string): MiewerColor {
  if (/^#[0-9a-f]{3}$/i.test(color)) {
    // Shorthand color notation
    const getChannel = (index: number) =>
      color[index + 1].concat(color[index + 1]);
    const r = stringToHex(getChannel(0));
    const g = stringToHex(getChannel(1));
    const b = stringToHex(getChannel(2));
    return b | (g << channelBits) | ((r << channelBits) << channelBits);
  }
  if (/^#[0-9a-f]{6,8}$/i.test(color)) {
    // Shorthand color notation
    const getChannel = (index: number) =>
      color[index * 2 + 1].concat(color[index * 2 + 2]);
    const r = stringToHex(getChannel(0));
    const g = stringToHex(getChannel(1));
    const b = stringToHex(getChannel(2));
    return b | (g << channelBits) | ((r << channelBits) << channelBits);
  }
  const rgb =
    /^rgba?\(\s*(\d+)\s*[,\s]\s*(\d+)\s*[,\s]\s*(\d+)\s*([,\s/]\s*[\d.]+%?)?\s*\)$/i.exec(
      color,
    );
  if (rgb) {
    const r = Math.min(255, Number(rgb[1]));
    const g = Math.min(255, Number(rgb[2]));
    const b = Math.min(255, Number(rgb[3]));
    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
      return b | (g << channelBits) | ((r << channelBits) << channelBits);
    }
  }
  return 0x0;
}

/**
 * Returns byte value of the alpha channel of the color
 * @param {string} color - color string in hex format (#AABBCC or #AABBCCDD)
 */
export function extractAlphaChannelFromHexColor(color: string): number {
  if (/^#[0-9a-f]{8}$/i.test(color)) {
    // Shorthand color notation
    const getChannel = (index: number) =>
      color[2 * index + 1].concat(color[2 * index + 2]);
    return stringToHex(getChannel(3));
  }
  return 255;
}
