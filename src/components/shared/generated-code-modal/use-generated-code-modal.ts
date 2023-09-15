import { useCallback, useMemo, useState } from 'react';

export default function useGeneratedCodeModal(): {
  visible: boolean;
  onShow: () => void;
  onHide: () => void;
} {
  const [visible, setVisible] = useState(false);
  const onHide = useCallback(() => {
    setVisible(false);
  }, [setVisible]);
  const onShow = useCallback(() => {
    setVisible(true);
  }, [setVisible]);
  return useMemo(
    () => ({
      visible,
      onHide,
      onShow,
    }),
    [visible, onShow, onHide],
  );
}
