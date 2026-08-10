import { useEffect } from "react";
import { scrollToImmediate } from '@components/smoothScroll/SmoothScroll';

const Topper = ({ children }) => {
  useEffect(() => {
    
    if (window.history?.scrollRestoration) {
        window.history.scrollRestoration = 'manual'
    }

    scrollToImmediate(0)
  }, [])

  return children
}

export default Topper;