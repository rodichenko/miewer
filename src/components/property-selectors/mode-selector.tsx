import React from 'react';
import {
  displayModeNames,
  displayModes,
  displayModesOptionsManifests,
} from '../../@types/miew';
import type { ModeSelectorProps } from '../../@types/components/property-selectors';
import MiewPropertySelector from './miew-property-selector';

function ModeSelector(props: ModeSelectorProps) {
  return (
    <MiewPropertySelector
      {...props}
      items={displayModes}
      titles={displayModeNames}
      manifests={displayModesOptionsManifests}
    />
  );
}

export default ModeSelector;
