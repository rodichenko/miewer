import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import type { RepresentationItemProps } from '../../../../@types/components/representations';
import { Button } from 'antd';
import { DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import ModeSelector from '../../../shared/property-selectors/mode-selector';
import ColorerSelector from '../../../shared/property-selectors/colorer-selector';
import MaterialSelector from '../../../shared/property-selectors/material-selector';
import SingleColorOption from './single-color-option';
import type { Representation } from '../../../../@types/miew';
import { displayColorOptionsManifests } from '../../../../@types/miew';
import RepresentationFormModal from '../../form-modal';
import useChangeRepresentation from '../../hooks/use-change-representation';
import { noop } from '../../../../helpers/rest';

function RepresentationItem(props: RepresentationItemProps) {
  const {
    className,
    style,
    disabled: itemDisabled,
    repIndex,
    representation,
    onRemove,
    onEdit,
    displayColorer,
    displayMode,
    displayMaterial,
  } = props;
  const disabled = itemDisabled ?? !onEdit;
  const { changeColorer, changeMaterial, changeMode } = useChangeRepresentation(
    representation,
    repIndex,
    onEdit ?? noop,
  );
  const onRemoveCallback = useCallback(() => {
    if (typeof onRemove === 'function') {
      onRemove(repIndex);
    }
  }, [repIndex, onRemove]);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const openModal = useCallback(() => {
    setFormModalVisible(true);
  }, [setFormModalVisible]);
  const closeModal = useCallback(() => {
    setFormModalVisible(false);
  }, [setFormModalVisible]);
  const onModalEditCallback = useCallback(
    (index: number, rep: Representation): void => {
      if (typeof onEdit === 'function') {
        onEdit(index, rep);
      }
      closeModal();
    },
    [onEdit, closeModal],
  );
  const { colorer, mode, material } = representation;
  return (
    <div
      className={classNames(className, 'mw-representation-control')}
      style={style}>
      <div className="mw-row">
        <span>{representation.selector}</span>
        <div className="mw-actions">
          {displayColorer && (
            <SingleColorOption
              value={colorer}
              disabled={disabled}
              onChange={changeColorer}
              className={classNames(
                'mw-representation-selector',
                'mw-representation-action',
              )}
              manifests={displayColorOptionsManifests}
            />
          )}
          {displayMode && (
            <ModeSelector
              disabled={disabled}
              value={mode}
              onChange={changeMode}
              className={classNames(
                'mw-representation-selector',
                'mw-representation-action',
              )}
              type="button"
            />
          )}
          {displayColorer && (
            <ColorerSelector
              disabled={disabled}
              value={colorer}
              onChange={changeColorer}
              className={classNames(
                'mw-representation-selector',
                'mw-representation-action',
              )}
              type="button"
            />
          )}
          {displayMaterial && (
            <MaterialSelector
              disabled={disabled}
              value={material}
              onChange={changeMaterial}
              className={classNames(
                'mw-representation-selector',
                'mw-representation-action',
              )}
              type="button"
            />
          )}
          {!disabled && (
            <>
              <Button
                type="text"
                className="mw-representation-action"
                onClick={openModal}>
                <SettingOutlined />
              </Button>
              {onRemove && (
                <Button
                  danger
                  type="text"
                  className="mw-representation-action"
                  onClick={onRemoveCallback}>
                  <DeleteOutlined />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      <RepresentationFormModal
        repIndex={repIndex}
        representation={representation}
        onRemove={onRemove}
        onEdit={onEdit ? onModalEditCallback : undefined}
        visible={formModalVisible}
        onClose={closeModal}
      />
    </div>
  );
}

export default RepresentationItem;
