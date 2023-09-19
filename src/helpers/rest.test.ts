import { isCssNumberValue, parseCssNumberValue } from './rest';

const parseCssValueTestData: Array<[string, string[], number | undefined]> = [
  // [css value, [units], result]
  ['5px', ['px'], 5],
  ['5.12px', ['px'], 5.12],
  ['5%', ['%'], 5],
  ['5.12%', ['%'], 5.12],
  ['5*', ['*', 'fr'], 5],
  ['5.12*', ['*', 'fr'], 5.12],
  ['5fr', ['*', 'fr'], 5],
  ['5.12fr', ['*', 'fr'], 5.12],
  ['5*', ['px', '%', '*', 'fr'], 5],
  ['5.12*', ['px', '%', '*', 'fr'], 5.12],
  ['5', ['px', '%', '*', 'fr'], 5],
  ['5.12', ['px', '%', '*', 'fr'], 5.12],
  ['5pt', ['px', '%', '*', 'fr'], undefined],
  ['5.12pt', ['px', '%', '*', 'fr'], undefined],
];

describe('rest helpers', () => {
  describe('is css value helper', () => {
    parseCssValueTestData.forEach((config) => {
      test(`"${config[0]}" ${
        config[2] === undefined ? 'matches' : "doesn't match"
      } css value string with units: ${config[1].join(', ')}`, () => {
        expect(isCssNumberValue(config[0], ...config[1])).toBe(
          Boolean(config[2]),
        );
      });
    });
  });
  describe('parse css value helper', () => {
    parseCssValueTestData.forEach((config) => {
      test(`"${config[0]}" is parsed to "${
        config[2]
      }" (checking units: ${config[1].join(', ')})`, () => {
        expect(parseCssNumberValue(config[0], ...config[1])).toBe(config[2]);
      });
    });
  });
});
