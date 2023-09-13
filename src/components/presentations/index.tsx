import React from 'react';
import { Button, Input } from 'antd';
import type { BasicComponentProps } from '../../@types/ui';
import {
  useDisableMiewHotKeys,
  useEnableMiewHotKeys,
} from '../../stores/miew-store';

function Presentations(props: BasicComponentProps) {
  const { className, style } = props;
  const onFocus = useDisableMiewHotKeys();
  const onBlur = useEnableMiewHotKeys();
  return (
    <div className={className} style={style}>
      <div className="mw-row">
        <Input onFocus={onFocus} onBlur={onBlur} />
      </div>
      <div className="mw-row">
        <Button type="primary">Primary</Button>
        <Button type="dashed">Dashed</Button>
        <Button type="link">Link</Button>
        <Button danger>Danger</Button>
        <Button danger type="primary">
          Danger Primary
        </Button>
        <span>This is text</span>
      </div>
    </div>
  );
}

export default Presentations;
