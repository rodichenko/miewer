/* eslint-disable @typescript-eslint/ban-types */
import ChainRenderer from './renderer';
import type { MutableRefObject } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { noop } from '../../helpers/rest';

export default function useRenderer(): [
  ChainRenderer | undefined,
  MutableRefObject<HTMLCanvasElement | null>,
] {
  const [renderer, setRenderer] = useState<ChainRenderer | undefined>(
    undefined,
  );
  useEffect(() => {
    const newRenderer = new ChainRenderer();
    setRenderer(newRenderer);
    return () => {
      newRenderer.destroy();
    };
  }, []);
  const renderCanvasRef = useRef<HTMLCanvasElement | null>(null);
  useLayoutEffect(() => {
    const { current: canvas } = renderCanvasRef;
    if (canvas && renderer) {
      renderer.setCanvases(canvas);
    }
    return noop;
  }, [renderer, renderCanvasRef, setRenderer]);
  return [renderer, renderCanvasRef];
}
