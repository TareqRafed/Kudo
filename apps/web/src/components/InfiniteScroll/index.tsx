'use client';

import { useEffect, useRef } from 'react';
import { Loader } from '@kudo/ui';

type Props = {
  isLoadingIntial: boolean;
  isLoadingMore: boolean;
  children: React.ReactNode;
  loadMore: () => void;
};

function InfiniteScroll(props: Props) {
  const observerElement = useRef<HTMLDivElement | null>(null);
  const { isLoadingIntial, isLoadingMore, children, loadMore } = props;

  useEffect(() => {
    // is element in view?
    function handleIntersection(entries: IntersectionObserverEntry[]) {
      for (const entry of entries) {
        if (entry.isIntersecting && (!isLoadingMore || !isLoadingIntial)) {
          loadMore();
        }
      }
    }

    // create observer instance
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    });

    if (observerElement.current) {
      observer.observe(observerElement.current);
    }

    // cleanup function
    return () => observer.disconnect();
  }, [isLoadingMore, isLoadingIntial, loadMore]);

  return (
    <>
      {children}
      <div ref={observerElement} id="obs">
        {isLoadingMore && !isLoadingIntial && (
          <div className="wrapper flex justify-center items-center h-20">
            <Loader size={'sm'} />
          </div>
        )}
      </div>
    </>
  );
}

export default InfiniteScroll;
