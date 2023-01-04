import { useState, useLayoutEffect } from "react";
import useResizeObserver from '@react-hook/resize-observer'; 

export default function useObserverSize( element ) {
    const [ size, setSize ] = useState()
      
    useLayoutEffect(() => {
        element && setSize( element.getBoundingClientRect() )
    }, [ element ])
    
    useResizeObserver( element, entry => setSize(entry.contentRect) )
    return size
}

