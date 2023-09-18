import type {
  AnimationAbortCallback,
  AnimationCallback,
  AnimationConfig,
} from '../@types/rest';
import { noop } from './rest';

export function animate(
  config: AnimationConfig,
  callback?: AnimationCallback,
): AnimationAbortCallback {
  const { from, to, durationMs, reportLastValueOnAborted = true } = config;
  const report = (value: number): void => {
    if (typeof callback === 'function') {
      callback(value);
    }
  };
  if (durationMs <= 0) {
    report(to);
    return noop;
  }
  let raf = 0;
  let start: number | undefined;
  const tick = (time: number) => {
    if (start) {
      const elapsed = time - start;
      if (elapsed >= durationMs) {
        report(to);
      } else {
        const ratio = elapsed / durationMs;
        report(from + (to - from) * ratio);
        raf = requestAnimationFrame(tick);
      }
    } else {
      start = time;
      raf = requestAnimationFrame(tick);
    }
  };
  raf = requestAnimationFrame(tick);
  return () => {
    if (reportLastValueOnAborted) {
      report(to);
    }
    cancelAnimationFrame(raf);
  };
}

export function stopAnimation(animation: AnimationAbortCallback | undefined) {
  if (typeof animation === 'function') {
    animation();
  }
}
