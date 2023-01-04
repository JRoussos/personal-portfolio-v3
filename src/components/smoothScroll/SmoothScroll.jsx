import React, { useEffect, useRef, useCallback } from "react";
import useObserverSize from '../../hooks/useObserverSize';

const parent_style = {    
    position: 'fixed',
    overflow: 'hidden',
    height: '100%',
    width: '100%'
}

const config = {
    velocity: 0.06,
    current: 0,
    previous: 0,
    requestScrollEvent: 0
}

export const getScrollValue = () => {
    const delta = (config.current - config.previous) * config.velocity
    return {
        scroll: config.previous + delta, 
        delta
    }
}

const SmoothScroll = ({ children, reload, isMobile=false }) => {
    const SCROLL_ID  = useRef(null)
    const scrollableContainerRef = useRef()

    const obSize = useObserverSize(document.getElementById('scrollableContainer'))
    
    const setScrollerHeight = () => {
        document.getElementById('root').style.height = `${scrollableContainerRef.current.getBoundingClientRect().height}px`
    }

    const smoothScrollingHandler = useCallback( () => {
        config.current = window.scrollY
        config.previous += (config.current - config.previous) * config.velocity

        if (Math.abs(config.current - config.previous) < 0.05) {
            config.previous = config.current
            config.requestScrollEvent = 0
        }

        scrollableContainerRef.current.style.transform = `translate3d(0, -${config.previous}px, 0)`

        SCROLL_ID.current = config.requestScrollEvent > 0 ? requestAnimationFrame(smoothScrollingHandler) : null
    }, [SCROLL_ID])
    
    const scrollHandler = useCallback(() => {
        config.requestScrollEvent++;
        if (!SCROLL_ID.current) SCROLL_ID.current = requestAnimationFrame(smoothScrollingHandler)
    }, [SCROLL_ID, smoothScrollingHandler])
    
    useEffect(() => {
        if (isMobile) return
        
        window.addEventListener('scroll', scrollHandler)
    }, [scrollHandler, isMobile]);

    useEffect(() => {
        setScrollerHeight();
    }, [obSize, reload])

    return (
        <div style={isMobile ? null : parent_style}>
           <main id="scrollableContainer" ref={scrollableContainerRef} style={{willChange: "transform"}}>{children}</main>
        </div>
    )
}

export default SmoothScroll;
