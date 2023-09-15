import React from 'react';
import {
  displayColors,
  displayColorNames,
  displayColorOptionsManifests,
} from '../../../@types/miew';
import type { ColorerSelectorProps } from '../../../@types/components/property-selectors';
import MiewPropertySelector from './miew-property-selector';

function ColorerSelector(props: ColorerSelectorProps) {
  return (
    <MiewPropertySelector
      {...props}
      items={displayColors}
      titles={displayColorNames}
      manifests={displayColorOptionsManifests}
    />
  );
}

export default ColorerSelector;
