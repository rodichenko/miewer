import React from 'react';
import classNames from 'classnames';
import type { BasicComponentProps } from '../../@types/components/common';
import {
  useChangeMiewRepresentation,
  useMiewRepresentations,
  useRemoveMiewRepresentation,
} from '../../stores/miew-store';
import RepresentationItem from './list-item';

function RepresentationsList(props: BasicComponentProps) {
  const { className, style } = props;
  const changeRep = useChangeMiewRepresentation();
  const removeRep = useRemoveMiewRepresentation();
  const reps = useMiewRepresentations();
  return (
    <div className={classNames(className, 'mw-representations')} style={style}>
      {reps.map((representation, idx) => (
        <RepresentationItem
          key={`rep-${idx}`}
          className="mw-list-item"
          repIndex={idx}
          representation={representation}
          onRemove={removeRep}
          onEdit={changeRep}
          displayColorer
          displayMode
        />
      ))}
    </div>
  );
}

export default RepresentationsList;
