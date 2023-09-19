import React from 'react';
import type { CommonLayoutProps } from '../../@types/components/layout';
import { MiewerPanel } from '../layout';
import RepresentationsList from './index';
import useRepresentationsActions from './use-representations-actions';

function RepresentationsPanel(props: CommonLayoutProps) {
  const representationsActions = useRepresentationsActions();
  return (
    <MiewerPanel
      {...props}
      panel="representations"
      actions={representationsActions}>
      <RepresentationsList className="mw-full-size" />
    </MiewerPanel>
  );
}

export default RepresentationsPanel;
