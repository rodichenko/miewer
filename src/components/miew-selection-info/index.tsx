import React, { useMemo } from 'react';
import type { BasicComponentProps } from '../../@types/components/common';
import { useMiewSelectionStore } from '../../stores/miew-selection-store';
import {
  isMiewAtom,
  isMiewChain,
  isMiewMolecule,
  isMiewResidue,
} from '../../helpers/miew/entity';
import {
  getAtomDescription,
  getAtomPositionDescription,
  getChainDescription,
  getMoleculeDescription,
  getResidueDescription,
} from '../../helpers/miew/selection';
import classNames from 'classnames';

export function useMiewSelectionInfoVisible(): boolean {
  const { lastPick, selectedAtomsCount } = useMiewSelectionStore();
  return selectedAtomsCount > 0 || Boolean(lastPick);
}

function MiewSelectionInfo(props: BasicComponentProps) {
  const { className, style } = props;
  const { lastPick, selectedAtomsCount: count } = useMiewSelectionStore();
  const lastPickDescription = useMemo<string | undefined>(() => {
    if (!lastPick && count === 0) {
      return undefined;
    }
    if (!lastPick) {
      return `${count} atom${count === 1 ? '' : 's'} selected`;
    }
    const base = `${count} atom${count === 1 ? '' : 's'} selected, last pick:`;
    const info = [];
    if (isMiewAtom(lastPick)) {
      info.push(
        getAtomDescription(lastPick.entity),
        getAtomPositionDescription(lastPick.entity).toLowerCase(),
      );
    }
    if (isMiewResidue(lastPick)) {
      info.push(getResidueDescription(lastPick.entity));
    }
    if (isMiewChain(lastPick)) {
      info.push(getChainDescription(lastPick.entity));
    }
    if (isMiewMolecule(lastPick)) {
      info.push(getMoleculeDescription(lastPick.entity));
    }
    return base.concat(' ').concat(info.join(', '));
  }, [lastPick, count]);
  if (lastPickDescription) {
    return (
      <div
        className={classNames(className, 'mw-panel', 'mw-miew-selection-info')}
        style={style}>
        {lastPickDescription}
      </div>
    );
  }
  return null;
}

export default MiewSelectionInfo;
