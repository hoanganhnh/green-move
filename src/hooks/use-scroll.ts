'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * A React hook that detects whether the user has scrolled past a specific threshold
 * on the page and returns the current scroll state.
 *
 * @param {number} threshold - The pixel threshold to consider scrolled.
 * When the scroll position is greater than this value, the hook returns `true`.
 * @returns {boolean} A flag indicating whether the user has scrolled past the
 * specified threshold.
 *
 * @example
 * ```jsx
 * import React from 'react';
 * import useScroll from './useScroll';
 *
 * function MyComponent() {
 *   const isScrolled = useScroll(100); // Scrolled past 100px
 *
 *   return (
 *     <div onScroll={isScrolled ? () => console.log('Scrolled!') : null}>
 *        ...
 *     </div>
 *   );
 * }
 */
export default function useScroll(threshold: number) {
  const [scrolled, setScrolled] = useState(false);

  const onScroll = useCallback(() => {
    setScrolled(window.scrollY > threshold);
  }, [threshold]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  return scrolled;
}
