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
export const useHorizontalScroll = ({
  itemCount = 0,
  gap = 24,
  autoScroll = false,
  autoScrollSpeed = 35,
} = {}) => {
  const { isArabic } = useTranslation();
  const containerRef = useRef(null);
  const [canScrollStart, setCanScrollStart] = useState(false);
  const [canScrollEnd, setCanScrollEnd] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoScrollPaused, setAutoScrollPaused] = useState(false);

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

  // Continuous marquee loop. Requires the DOM to contain two identical copies
  // of the item list (duplicates marked aria-hidden) so we can wrap the scroll
  // position by the width of one copy without a visible jump.
  useEffect(() => {
    if (!autoScroll || autoScrollPaused || itemCount <= 1) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const el = containerRef.current;
    if (!el) return undefined;

    const prevBehavior = el.style.scrollBehavior;
    el.style.scrollBehavior = 'auto';
    const sign = isRtl ? -1 : 1;
    let rafId;
    let last = performance.now();
    let loopWidth = 0;
    let lastMeasured = 0;

    const measureLoopWidth = () => {
      const children = el.children;
      if (children.length >= itemCount * 2) {
        loopWidth = Math.abs(children[itemCount].offsetLeft - children[0].offsetLeft);
      } else {
        loopWidth = el.scrollWidth / 2;
      }
    };

    const tick = (now) => {
      if (now - lastMeasured > 1000) {
        measureLoopWidth();
        lastMeasured = now;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!document.hidden && loopWidth > 0) {
        let next = el.scrollLeft + sign * autoScrollSpeed * dt;
        if (sign > 0 && next >= loopWidth) next -= loopWidth;
        if (sign < 0 && next <= -loopWidth) next += loopWidth;
        el.scrollLeft = next;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      el.style.scrollBehavior = prevBehavior;
    };
  }, [autoScroll, autoScrollPaused, itemCount, autoScrollSpeed, isRtl]);

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
    autoScrollPaused,
    setAutoScrollPaused,
    scrollByStep,
    scrollToIndex,
  };
};
