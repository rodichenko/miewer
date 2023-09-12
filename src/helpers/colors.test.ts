import { hexString, colorValueToString } from './colors';
import type { MiewerColor } from '../types/base';

const testData: Array<[MiewerColor, number | undefined, string]> = [
  [0xabcdef, undefined, '#abcdef'],
  [0x000000, undefined, '#000000'],
  [0xabcdef, 0, '#abcdef00'],
  [0xabcdef, 1, '#abcdefff'],
  [0x000000, 0.5, '#0000007f'],
];

describe('color helpers', () => {
  test('hex number to hex string', () => {
    expect(hexString(0xa8)).toMatch(/^a8$/i);
  });
  test('hex number to hex string (adding leading zeros)', () => {
    expect(hexString(0x0f)).toMatch(/^0f$/i);
  });
  test('hex number to hex string (negative values)', () => {
    expect(hexString(-0x0f)).toMatch(/^0f$/i);
  });
});

describe('number to color string', () => {
  testData.forEach(([color, alpha, result]) => {
    const description = [
      `convert ${color}`,
      alpha === undefined ? false : `with alpha ${alpha}`,
      `to ${result}`,
    ]
      .filter(Boolean)
      .join(' ');
    test(description, () => {
      expect(colorValueToString(color, alpha)).toMatch(
        new RegExp(`^${result}$`, 'i'),
      );
    });
  });
});
