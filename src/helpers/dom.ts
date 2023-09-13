import type { Nullable } from '../@types/base';
import type { EnsureElementOptions } from '../@types/ui';

const emptyOptions: Nullable<EnsureElementOptions> = {};

function getElementOptions(
  options?: Nullable<EnsureElementOptions>,
): EnsureElementOptions {
  const {
    tag = 'div',
    parent = document.body,
    classNames = [],
  } = options ?? emptyOptions;
  return {
    tag,
    parent,
    classNames,
  };
}

export function ensureElementById<T extends HTMLElement>(
  id: string,
  options?: Nullable<EnsureElementOptions>,
): T {
  const { tag, parent, classNames } = getElementOptions(options);
  let element = document.getElementById(id);
  if (!element) {
    element = document.createElement(tag);
    parent.appendChild(element);
  }
  for (const className of classNames) {
    element.classList.add(className);
  }
  return element as T;
}
