import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../i18n/hooks/useTranslation';

/**
 * Horizontal scroll carousel logic that works in both LTR and RTL.
 *
 * RTL scroll convention (modern browsers): scrollLeft starts at 0 at the
 * start edge (right) and goes negative toward the end edge (left), so the
 * distance from the start edge is always Math.abs(scrollLeft).
 *
 * Returns:
 *  - containerRef: attach to the scrollable element
 *  - canScrollStart / canScrollEnd: edge booleans for disabling arrows
 *  - activeIndex: approximate visible item index (clamped to itemCount - 1)
 *  - scrollByStep(direction): scroll by roughly one item ('start' | 'end')
 *  - scrollToIndex(index): jump to an item by index
 */
export const useHorizontalScroll = ({ itemCount = 0, gap = 24 } = {}) => {
  const { isArabic } = useTranslation();
  const containerRef = useRef(null);
  const [canScrollStart, setCanScrollStart] = useState(false);
  const [canScrollEnd, setCanScrollEnd] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const isRtl = isArabic;

  const getItemWidth = useCallback(() => {
    const el = containerRef.current;
    const child = el ? el.firstElementChild : null;
    return child ? child.clientWidth + gap : 360;
  }, [gap]);

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const distance = Math.abs(el.scrollLeft);
    const maxDistance = el.scrollWidth - el.clientWidth;

    setCanScrollStart(distance > 15);
    setCanScrollEnd(distance < maxDistance - 15);

    if (itemCount > 0) {
      const itemWidth = getItemWidth();
      const index = Math.round(distance / itemWidth);
      setActiveIndex(Math.min(itemCount - 1, Math.max(0, index)));
    }
  }, [itemCount, getItemWidth]);

  useEffect(() => {
    measure();
    const el = containerRef.current;
    if (!el) return undefined;

    const onScroll = () => measure();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [measure]);

  const scrollByStep = useCallback(
    (direction) => {
      const el = containerRef.current;
      if (!el) return;
      const sign = isRtl ? -1 : 1;
      const step = direction === 'start' ? -getItemWidth() : getItemWidth();
      el.scrollBy({ left: step * sign, behavior: 'smooth' });
    },
    [isRtl, getItemWidth],
  );

  const scrollToIndex = useCallback(
    (index) => {
      const el = containerRef.current;
      if (!el) return;
      el.scrollTo({
        left: (isRtl ? -1 : 1) * index * getItemWidth(),
        behavior: 'smooth',
      });
    },
    [isRtl, getItemWidth],
  );

  return {
    containerRef,
    canScrollStart,
    canScrollEnd,
    activeIndex,
    scrollByStep,
    scrollToIndex,
  };
};
