import React, { useEffect, useState } from 'react';
import { Button, Input, Modal } from 'antd';
import type { GeneratedCodeModalProps } from '../../../@types/components/generated-code';

function GeneratedCodeModal(props: GeneratedCodeModalProps) {
  const { className, style, visible, title, onClose, generator } = props;
  const [code, setCode] = useState<string | undefined>();
  useEffect(() => {
    if (visible) {
      setCode(generator());
    }
  }, [setCode, visible, generator]);
  return (
    <Modal
      className={className}
      style={style}
      onCancel={onClose}
      title={title}
      open={visible}
      closeIcon={false}
      footer={
        <>
          <Button onClick={onClose}>Close</Button>
        </>
      }>
      <Input.TextArea readOnly rows={6} value={code} />
    </Modal>
  );
}

export default GeneratedCodeModal;
