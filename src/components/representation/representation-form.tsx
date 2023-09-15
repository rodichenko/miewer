import React, { useCallback } from 'react';
import classNames from 'classnames';
import type { RepresentationFormProps } from '../../@types/components/representations';
import { Input } from '../shared/antd-overrides';
import ModeSelector from '../property-selectors/mode-selector';
import useChangeRepresentation from './hooks/use-change-representation';
import ColorerSelector from '../property-selectors/colorer-selector';
import MaterialSelector from '../property-selectors/material-selector';
import ModeOptions from '../property-options/mode-options';
import ColorerOptions from '../property-options/colorer-options';
import MaterialOptions from '../property-options/material-options';
import { noop } from '../../helpers/rest';
import { Button } from 'antd';

function RepresentationForm(props: RepresentationFormProps) {
  const {
    className,
    style,
    disabled: formDisabled,
    representation,
    repIndex,
    onRemove,
    onEdit,
  } = props;
  const rowClassName = classNames('mw-row', 'mw-representation-row');
  const rowDetailsClassName = classNames(
    'mw-representation-row',
    'mw-representation-row-details',
  );
  const { colorer, material, mode, name, selector } = representation;
  const disabled = formDisabled ?? !onEdit;
  const {
    changeColorer,
    changeMaterial,
    changeMode,
    changeNameEvent,
    changeSelectorEvent,
  } = useChangeRepresentation(representation, repIndex, onEdit ?? noop);
  const onRemoveCallback = useCallback(() => {
    if (typeof onRemove === 'function') {
      onRemove(repIndex);
    }
  }, [onRemove, repIndex]);
  return (
    <div
      className={classNames(className, 'mw-representation-form')}
      style={style}>
      <div className={rowClassName}>
        <span className="mw-representation-property">Name:</span>
        <Input
          disabled={disabled}
          className="mw-control"
          value={name}
          onChange={changeNameEvent}
          placeholder="Representation alias"
        />
      </div>
      <div className={rowClassName}>
        <span className="mw-representation-property">Selector:</span>
        <Input
          disabled={disabled}
          className="mw-control"
          value={selector}
          onChange={changeSelectorEvent}
          placeholder="Representation selector"
        />
      </div>
      <div className={rowClassName}>
        <span className="mw-representation-property">Mode:</span>
        <ModeSelector
          disabled={disabled}
          className="mw-control"
          value={mode}
          onChange={changeMode}
          type="select"
        />
      </div>
      <ModeOptions
        className={rowDetailsClassName}
        property={mode}
        onChange={changeMode}
      />
      <div className={rowClassName}>
        <span className="mw-representation-property">Colorer:</span>
        <ColorerSelector
          disabled={disabled}
          className="mw-control"
          value={colorer}
          onChange={changeColorer}
          type="select"
        />
      </div>
      <ColorerOptions
        className={rowDetailsClassName}
        property={colorer}
        onChange={changeColorer}
      />
      <div className={rowClassName}>
        <span className="mw-representation-property">Material:</span>
        <MaterialSelector
          disabled={disabled}
          className="mw-control"
          value={material}
          onChange={changeMaterial}
          type="select"
        />
      </div>
      <MaterialOptions
        className={rowDetailsClassName}
        property={material}
        onChange={changeMaterial}
      />
      {onRemove && (
        <div className="mw-row mw-end">
          <Button type="primary" danger onClick={onRemoveCallback}>
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}

export default RepresentationForm;
