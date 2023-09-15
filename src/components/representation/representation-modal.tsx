import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Modal } from 'antd';
import type { RepresentationFormModalProps } from '../../@types/components/representations';
import type { Representation } from '../../@types/miew';
import RepresentationForm from './representation-form';
import { representationsEqual } from '../../helpers/miew/representations';

function RepresentationFormModal(props: RepresentationFormModalProps) {
  const {
    className,
    style,
    disabled,
    representation,
    repIndex,
    onRemove,
    onEdit,
    visible,
    onClose,
  } = props;
  const [draft, setDraft] = useState(representation);
  useEffect(() => {
    setDraft(representation);
  }, [representation, setDraft, visible]);
  const onEditDraft = useCallback(
    (index: number, draftRep: Representation) => {
      setDraft(draftRep);
    },
    [setDraft],
  );
  const equals = useMemo(
    () => representationsEqual(draft, representation),
    [draft, representation, representationsEqual],
  );
  const onSubmit = useCallback(() => {
    if (typeof onEdit === 'function') {
      onEdit(repIndex, draft);
    }
  }, [onEdit, repIndex, draft]);
  const onRemoveClick = useCallback(() => {
    if (typeof onRemove === 'function') {
      onRemove(repIndex);
    }
  }, [onRemove, repIndex]);
  return (
    <Modal
      className={className}
      style={style}
      open={visible}
      onCancel={onClose}
      closeIcon={false}
      footer={
        <div className="mw-row mw-space-between">
          <div>
            {onRemove && (
              <Button
                disabled={disabled}
                danger
                type="primary"
                onClick={onRemoveClick}>
                Remove
              </Button>
            )}
          </div>
          <div>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              disabled={disabled ?? equals}
              type="primary"
              onClick={onSubmit}>
              Save
            </Button>
          </div>
        </div>
      }
      title={false}>
      <RepresentationForm
        repIndex={repIndex}
        representation={draft}
        onEdit={onEditDraft}
        disabled={disabled}
      />
    </Modal>
  );
}

export default RepresentationFormModal;
