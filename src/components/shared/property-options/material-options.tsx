import React from 'react';
import { displayMaterialOptionsManifests } from '../../../@types/miew';
import type { MiewPropertyOptions } from '../../../@types/miew';
import type { MaterialOptionsProps } from '../../../@types/components/representations';
import PropertyOptions from './property-options';

function MaterialOptions<Options extends MiewPropertyOptions>(
  props: MaterialOptionsProps<Options>,
) {
  return (
    <PropertyOptions {...props} manifests={displayMaterialOptionsManifests} />
  );
}

export default MaterialOptions;
