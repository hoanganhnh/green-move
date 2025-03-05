import * as React from 'react';

/**
 * A React hook that listens for changes to a CSS media query and returns the
 * current match state.
 *
 * @param {string} query - The CSS media query string to listen for changes to.
 * @returns {boolean} The current match state of the media query.
 *
 * @example
 * ```jsx
 * import React from 'react';
 * import useMediaQuery from './useMediaQuery';
 *
 * function MyComponent() {
 *   const isLargeScreen = useMediaQuery('(min-width: 768px)');
 *
 *   return (
 *     <div>
 *       {isLargeScreen ? (
 *         <p>This content is displayed on large screens only.</p>
 *       ) : (
 *         <p>This content is displayed on small screens.</p>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export default function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener('change', onChange);
    setValue(result.matches);

    return () => result.removeEventListener('change', onChange);
  }, [query]);

  return value;
}
