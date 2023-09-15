import React from 'react';
import {
  displayMaterials,
  displayMaterialNames,
  displayMaterialOptionsManifests,
} from '../../../@types/miew';
import type { MaterialSelectorProps } from '../../../@types/components/property-selectors';
import MiewPropertySelector from './miew-property-selector';

function MaterialSelector(props: MaterialSelectorProps) {
  return (
    <MiewPropertySelector
      {...props}
      items={displayMaterials}
      titles={displayMaterialNames}
      manifests={displayMaterialOptionsManifests}
    />
  );
}

export default MaterialSelector;
