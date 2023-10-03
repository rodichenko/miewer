import {
  arraysShallowEquals,
  createLocalSettings,
  escapeRegExp,
  escapeRegExpCharacters,
  getGreatestCommonDivisor,
  getObjectsShallowDifferences,
  getQueryStringEntries,
  getQueryStringFromEntries,
  getRangesFromNumberArray,
  isCssNumberValue,
  noop,
  objectsEquals,
  parseCssNumberValue,
  readSetting,
  saveSetting,
} from './rest';

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

declare type GcdTest = [number[], number];

const gcdTests: GcdTest[] = [
  [[], 1],
  [[0], 1],
  [[4], 4],
  [[2, 4], 2],
  [[2, 4, 6, 8, 10], 2],
  [[2, 4, 6, 8, 11], 1],
  [[11 * 13 * 17, 17 * 7], 17],
  [
    [
      11 * 13 * 17 * 43,
      17 * 19 * 23 * 43,
      23 * 29 * 31 * 43,
      31 * 37 * 41 * 43,
    ],
    43,
  ],
];

function extendGcdTestWithNegativeTests(tests: GcdTest[]): GcdTest[] {
  return tests.reduce<GcdTest[]>(
    (r, c) => [
      ...r,
      ...(c[0].length
        ? [c, [c[0].map((o) => -o), c[1]] satisfies GcdTest]
        : [c]),
    ],
    [],
  );
}

function extendGcdTestWithFloatTests(tests: GcdTest[]): GcdTest[] {
  return tests.reduce<GcdTest[]>(
    (r, c) => [
      ...r,
      ...(c[0].length
        ? [c, [c[0].map((o) => o + 0.1), 1] satisfies GcdTest]
        : [c]),
    ],
    [],
  );
}

declare type ObjectShallowDiffTestPrototype = {
  s: string;
  n: number;
  b: boolean;
};

declare type ObjectShallowDiffTest<T> = {
  original: T;
  comparing: T;
  difference: Partial<T>;
};

const objectShallowDiffTests: Array<
  ObjectShallowDiffTest<ObjectShallowDiffTestPrototype>
> = [
  {
    original: { s: 'a', n: 1, b: true },
    comparing: { s: 'a', n: 1, b: true },
    difference: {},
  },
  {
    original: { s: 'a', n: 1, b: true },
    comparing: { s: 'a', n: 2, b: true },
    difference: { n: 2 },
  },
  {
    original: { s: 'a', n: 1, b: true },
    comparing: { s: 'a', n: 1, b: false },
    difference: { b: false },
  },
  {
    original: { s: 'a', n: 1, b: true },
    comparing: { s: 'b', n: 1, b: true },
    difference: { s: 'b' },
  },
  {
    original: { s: 'a', n: 1, b: true },
    comparing: { s: 'b', n: 2, b: false },
    difference: { s: 'b', n: 2, b: false },
  },
];

declare type ObjectsEqualTest<T = any, U = any> = {
  original: T;
  comparing: U;
  equals: boolean;
};

const obj = {};

const arraysShallowEqualTests: Array<ObjectsEqualTest<any[], any[]>> = [
  {
    original: [1, 2, 3],
    comparing: [1, 2, 3],
    equals: true,
  },
  {
    original: [1, 2, 3],
    comparing: [3, 2, 1],
    equals: false,
  },
  {
    original: [1, 2, 3],
    comparing: [1, 2],
    equals: false,
  },
  {
    original: [1, 2, 3],
    comparing: ['1', '2', '3'],
    equals: false,
  },
  {
    original: [obj],
    comparing: [obj],
    equals: true,
  },
];

const objectsEqualTests: ObjectsEqualTest[] = [
  {
    original: { s: 'a', n: 4, b: true, o: { s: 'b' }, a: [1, 2, {}] },
    comparing: { s: 'a', n: 4, b: true, o: { s: 'b' }, a: [1, 2, {}] },
    equals: true,
  },
  {
    original: { s: 'a', n: 4, b: true, o: { s: 'b' }, a: [1, 2, {}] },
    comparing: { s: 'a', n: 4, b: true, o: { s: 'a' }, a: [1, 2, {}] },
    equals: false,
  },
  {
    original: { s: 'a', n: 4, b: true, o: { s: 'b' }, a: [1, 2, {}] },
    comparing: { s: 'a', n: 4, b: true, o: { s: 'b' }, a: [1, {}] },
    equals: false,
  },
  {
    original: { s: 'aa', n: 4, b: true, o: { s: 'a' }, a: [1, 2, {}] },
    comparing: { s: 'a', n: 4, b: true, o: { s: 'a' }, a: [1, 2, {}] },
    equals: false,
  },
  {
    original: { s: 'a', n: 3, b: true, o: { s: 'a' }, a: [1, 2, {}] },
    comparing: { s: 'a', n: 4, b: true, o: { s: 'a' }, a: [1, 2, {}] },
    equals: false,
  },
  {
    original: { s: 'a', n: 4, b: false, o: { s: 'a' }, a: [1, 2, {}] },
    comparing: { s: 'a', n: 4, b: true, o: { s: 'a' }, a: [1, 2, {}] },
    equals: false,
  },
  {
    original: { s: 'a', n: 4, b: false, o: { s: 'a' }, a: [1, 2, {}] },
    comparing: { s: 'a', n: 4, b: false, o: { s: 'a' }, a: [1, 2, {}] },
    equals: true,
  },
  {
    original: { s: 'a', n: 4, b: false, o: { s: 'a' }, a: [1, 2, { s: 's' }] },
    comparing: { s: 'a', n: 4, b: false, o: { s: 'a' }, a: [1, 2, { s: 'b' }] },
    equals: false,
  },
  {
    original: {},
    comparing: {},
    equals: true,
  },
  {
    original: 'string',
    comparing: 5,
    equals: false,
  },
  {
    original: 'string',
    comparing: 'string',
    equals: true,
  },
  {
    original: 'string',
    comparing: 'string-2',
    equals: false,
  },
  {
    original: 21.1,
    comparing: 21.1,
    equals: true,
  },
  {
    original: 21.1,
    comparing: 21.2,
    equals: false,
  },
  {
    original: false,
    comparing: false,
    equals: true,
  },
  {
    original: false,
    comparing: true,
    equals: false,
  },
  {
    original: undefined,
    comparing: null,
    equals: true,
  },
  {
    original: { key1: 1 },
    comparing: { key2: 1 },
    equals: false,
  },
  {
    original: { key1: 1 },
    comparing: { key1: 1, key2: 1 },
    equals: false,
  },
  {
    original: noop,
    comparing: noop,
    equals: true,
  },
  {
    original() {
      // Empty
    },
    comparing() {
      // Empty
    },
    equals: false,
  },
];

declare type RangesFromNumbersTest = {
  numbers: number[];
  ranges: Array<[number, number]>;
};

const rangesFromNumbersTests: RangesFromNumbersTest[] = [
  {
    numbers: [],
    ranges: [],
  },
  {
    numbers: [1],
    ranges: [[1, 1]],
  },
  {
    numbers: [1, 3],
    ranges: [
      [1, 1],
      [3, 3],
    ],
  },
  {
    numbers: [3, 1, 2],
    ranges: [[1, 3]],
  },
  {
    numbers: [3, 1, 2, -1, -2, 0],
    ranges: [[-2, 3]],
  },
  {
    numbers: [3, 1, 2, -1, -2],
    ranges: [
      [-2, -1],
      [1, 3],
    ],
  },
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
  describe('greatest common divisor', () => {
    const arrayDescription = (array: number[]): string =>
      array.length ? '['.concat(array.join(',')).concat(']') : 'empty array';
    extendGcdTestWithNegativeTests(
      extendGcdTestWithFloatTests(gcdTests),
    ).forEach((config) => {
      test(`gcd of ${arrayDescription(config[0])} is ${config[1]}`, () => {
        expect(getGreatestCommonDivisor(...config[0])).toBe(config[1]);
      });
    });
  });
  describe('objects shallow difference', () => {
    objectShallowDiffTests.forEach((config, idx) => {
      test(`test #${idx + 1}`, () => {
        expect(
          getObjectsShallowDifferences(config.original, config.comparing),
        ).toMatchObject(config.difference);
      });
    });
  });
  describe('arrays shallow equal', () => {
    arraysShallowEqualTests.forEach((config, idx) => {
      test(`test #${idx + 1}`, () => {
        expect(arraysShallowEquals(config.original, config.comparing)).toBe(
          config.equals,
        );
      });
    });
  });
  describe('objects deep equal', () => {
    objectsEqualTests.forEach((config, idx) => {
      test(`test #${idx + 1}`, () => {
        expect(objectsEquals(config.original, config.comparing)).toBe(
          config.equals,
        );
      });
    });
  });
  describe('url query string parsing', () => {
    const s = 'string with spaces';
    const o = '{ %21 }';
    const n = 12.1;
    const testString = `s=${encodeURIComponent(s)}&o=${encodeURIComponent(
      o,
    )}&n=${encodeURIComponent(n)}`;
    const query = `?${testString}`;
    const result = [
      { key: 's', value: s },
      { key: 'o', value: o },
      { key: 'n', value: n.toString() },
    ];
    beforeEach(() => {
      window.history.pushState({}, '', `/${query}`);
    });
    afterEach(() => {
      window.history.pushState({}, '', '/');
    });
    test('from document.location', () => {
      expect(getQueryStringEntries()).toEqual(result);
    });
    test('from string', () => {
      expect(getQueryStringEntries(query)).toEqual(result);
    });
    test('from string (starting with "?")', () => {
      expect(getQueryStringEntries(testString)).toEqual(result);
    });
  });
  describe('url query string building', () => {
    const s = 'string with spaces';
    const o = '{ %21 }';
    const n = 12.1;
    const entries = [
      { key: 'key with space', value: s },
      { key: 'o', value: o },
      { key: 'n', value: n.toString() },
    ];
    const resultString = `?${encodeURIComponent(
      'key with space',
    )}=${encodeURIComponent(s)}&o=${o}&n=${n}`;
    test('specifying encoded keys as strings', () => {
      expect(getQueryStringFromEntries(entries, 'key with space', 'n')).toEqual(
        resultString,
      );
    });
    test('specifying encoded keys as reg exp', () => {
      expect(getQueryStringFromEntries(entries, /^[^o]+$/i)).toEqual(
        resultString,
      );
    });
    test('building empty query string', () => {
      expect(getQueryStringFromEntries([])).toEqual('');
    });
  });
  describe('ranges from numbers array', () => {
    const describeTest = (config: RangesFromNumbersTest): string =>
      `${JSON.stringify(config.numbers)} to ranges ${config.ranges
        .map((range) => `${range[0]}-${range[1]}`)
        .join(', ')}`;
    rangesFromNumbersTests.forEach((config, idx) => {
      test(describeTest(config), () => {
        expect(getRangesFromNumberArray(config.numbers)).toEqual(config.ranges);
      });
    });
  });
  describe('escaping RegExp string', () => {
    test('default escaping characters', () => {
      expect(escapeRegExp(escapeRegExpCharacters.join(''))).toEqual(
        escapeRegExpCharacters.map((c) => `\\${c}`).join(''),
      );
    });
    test('custom escaping characters', () => {
      expect(escapeRegExp('.*{}', ['.', '*'])).toEqual('\\.\\*{}');
    });
  });
  describe('local settings', () => {
    beforeEach(() => {
      saveSetting('setting', undefined);
    });
    afterEach(() => {
      saveSetting('setting', undefined);
    });
    test('read default', () => {
      expect(readSetting('setting', 'set')).toBe('set');
      localStorage.setItem('setting', 'wrong json value');
      expect(readSetting('setting', 'set')).toBe('set');
    });
    test('read and write', () => {
      expect(readSetting('setting', 'set')).toBe('set');
      saveSetting('setting', 'set1');
      expect(readSetting('setting', 'set')).toBe('set1');
      saveSetting('setting', 14);
      expect(readSetting('setting', 'set')).toBe(14);
    });
    test('read and write using wrappers', () => {
      const { read, save } = createLocalSettings('setting', 'set');
      expect(read()).toBe('set');
      save('set1');
      expect(read()).toBe('set1');
      save(undefined);
      expect(read()).toBe('set');
    });
  });
  test('noop', () => {
    expect(noop).not.toThrow();
  });
});
