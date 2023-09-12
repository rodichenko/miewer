import React from 'react';
import { createRoot } from 'react-dom/client';
import 'miew/dist/miew.min.css';
import './themes/index.scss';
import Miewer from './components/miewer';
import { ensureElementById } from './helpers/dom';

console.log('[Miewer] version:', PACKAGE_VERSION);
if (DEVELOPMENT) {
  console.log('[Miewer] Mode: development');
}
if (TEST) {
  console.log('[Miewer] mode: test');
}

const miewerContainer = ensureElementById('miewer', {
  classNames: ['miewer'],
});

const root = createRoot(miewerContainer, {
  identifierPrefix: 'miewer',
});
root.render(<Miewer />);
