import {
  hexString,
  colorValueToString,
  stringToColorValue,
  extractAlphaChannelFromHexColor,
} from './colors';
import type { MiewerColor } from '../@types/base';

const testDataNumberToColor: Array<[MiewerColor, number | undefined, string]> =
  [
    [0xabcdef, undefined, '#abcdef'],
    [0x000000, undefined, '#000000'],
    [0xabcdef, 0, '#abcdef00'],
    [0xabcdef, 1, '#abcdefff'],
    [0x000000, 0.5, '#0000007f'],
  ];

const testDataColorToNumber: Array<[string, MiewerColor]> = [
  ['#000', 0x0],
  ['#123', 0x112233],
  ['#999', 0x999999],
  ['#fff', 0xffffff],
  ['#abcdef', 0xabcdef],
  ['#010001', 0x010001],
  ['rgb(255, 255, 255)', 0xffffff],
  ['rgb(1000, 1000, 1000)', 0xffffff],
  ['rgba(255, 255, 255, 0)', 0xffffff],
  ['rgba( 255 255 255 0)', 0xffffff],
  ['unknown', 0x0],
  ['#ffff', 0x0],
];

const testDataExtractAlpha: Array<[string, number]> = [
  ['#000', 255],
  ['#999', 255],
  ['#fff', 255],
  ['#abcdef', 255],
  ['#010001', 255],
  ['#abcdefff', 255],
  ['#01000105', 5],
  ['#01000100', 0],
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
  testDataNumberToColor.forEach(([color, alpha, result]) => {
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

describe('css color to number', () => {
  testDataColorToNumber.forEach(([color, result]) => {
    test(`convert ${color} to ${result}`, () => {
      expect(stringToColorValue(color)).toBe(result);
    });
  });
});

describe('extract alpha channel', () => {
  testDataExtractAlpha.forEach(([color, result]) => {
    test(`extract alpha value from ${color}: ${result}`, () => {
      expect(extractAlphaChannelFromHexColor(color)).toBe(result);
    });
  });
});
