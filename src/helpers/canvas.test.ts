import { getDprValue, getUnDprValue } from './canvas';

describe('canvas helpers', () => {
  const originalDpr = window.devicePixelRatio;
  beforeEach(() => {
    window.devicePixelRatio = originalDpr;
  });
  afterEach(() => {
    window.devicePixelRatio = originalDpr;
  });
  test('get value considering DPR', () => {
    window.devicePixelRatio = 3;
    expect(getDprValue(2)).toBe(6);
  });
  test('get original value', () => {
    window.devicePixelRatio = 3;
    expect(getUnDprValue(6)).toBe(2);
  });
});
