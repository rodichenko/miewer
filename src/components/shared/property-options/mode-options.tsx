import React from 'react';
import { displayModesOptionsManifests } from '../../../@types/miew';
import type { MiewPropertyOptions } from '../../../@types/miew';
import type { ModeOptionsProps } from '../../../@types/components/representations';
import PropertyOptions from './property-options';

function ModeOptions<Options extends MiewPropertyOptions>(
  props: ModeOptionsProps<Options>,
) {
  return (
    <PropertyOptions {...props} manifests={displayModesOptionsManifests} />
  );
}

export default ModeOptions;
