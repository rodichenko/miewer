import React from 'react';
import { displayColorOptionsManifests } from '../../../@types/miew';
import type { MiewPropertyOptions } from '../../../@types/miew';
import type { ColorerOptionsProps } from '../../../@types/components/representations';
import PropertyOptions from './property-options';

function ColorerOptions<Options extends MiewPropertyOptions>(
  props: ColorerOptionsProps<Options>,
) {
  return (
    <PropertyOptions {...props} manifests={displayColorOptionsManifests} />
  );
}

export default ColorerOptions;
