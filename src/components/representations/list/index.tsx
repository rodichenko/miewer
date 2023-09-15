import React from 'react';
import classNames from 'classnames';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { BasicComponentProps } from '../../../@types/components/common';
import {
  useChangeMiewRepresentation,
  useCreateMiewRepresentation,
  useMiewRepresentations,
  useRemoveMiewRepresentation,
} from '../../../stores/miew-store';
import RepresentationItem from './item';

function RepresentationsList(props: BasicComponentProps) {
  const { className, style } = props;
  const createRep = useCreateMiewRepresentation();
  const changeRep = useChangeMiewRepresentation();
  const removeRep = useRemoveMiewRepresentation();
  const reps = useMiewRepresentations();
  return (
    <div className={classNames(className, 'mw-representations')} style={style}>
      <div className="mw-row mw-title-row">
        <span className="mw-title">Layers</span>
        <div className="mw-actions">
          <Button onClick={createRep}>
            <PlusOutlined />
          </Button>
        </div>
      </div>
      <div className="mw-representations-list">
        {reps.map((representation, idx) => (
          <RepresentationItem
            key={`rep-${idx}`}
            repIndex={idx}
            representation={representation}
            onRemove={removeRep}
            onEdit={changeRep}
            displayColorer
            displayMode
          />
        ))}
      </div>
    </div>
  );
}

export default RepresentationsList;
