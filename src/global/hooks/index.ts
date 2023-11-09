import { useCallback, useEffect, useRef, useState } from "react";

const useSticky = (offset: number) => {
  const stickyRef = useRef<HTMLElement>(null);
  const [sticky, setSticky] = useState<boolean>(false);

  const handleScroll = useCallback(() => {
    if (!stickyRef.current) {
      return;
    }
    setSticky(window.scrollY > offset);
  }, [offset]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, setSticky, stickyRef]);
  return { stickyRef, sticky };
};

export default useSticky;
