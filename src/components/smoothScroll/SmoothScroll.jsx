import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
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
    delta: 0
}

export const getScrollValue = () => {
    return { scroll: config.previous, delta: config.delta }
}

const SmoothScroll = ({ children, reload, isMobile=false }) => {
    const isAnimating = useRef(false)
    const scrollableContainerRef = useRef()

    // Users who request reduced motion get native scrolling instead of the
    // lerped/RAF-driven smooth scroll effect.
    const prefersReducedMotion = typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const disableSmoothScroll = isMobile || prefersReducedMotion

    const obSize = useObserverSize(document.getElementById('scrollableContainer'))
    
    const setScrollerHeight = () => {
        const { height } = scrollableContainerRef.current.getBoundingClientRect()
        document.getElementById('root').style.height = `${ height }px`
    }

    // Driven by gsap's shared ticker instead of its own requestAnimationFrame
    // loop, so the easing amount is scaled by the real frame duration
    // (deltaRatio) rather than assuming a fixed 60fps step. This keeps the
    // catch-up speed visually consistent regardless of display refresh rate
    // or dropped frames, and gsap's built-in lag smoothing avoids a big
    // jump after the tab was throttled in the background.
    const smoothScrollingHandler = useCallback(() => {
        config.current = window.scrollY

        const ease = 1 - Math.pow(1 - config.velocity, gsap.ticker.deltaRatio())
        const previous = config.previous
        config.previous += (config.current - previous) * ease
        config.delta = config.previous - previous

        if (Math.abs(config.current - config.previous) < 0.05) {
            config.previous = config.current
            config.delta = 0

            gsap.ticker.remove(smoothScrollingHandler)
            isAnimating.current = false
        }

        scrollableContainerRef.current.style.transform = `translate3d(0, -${config.previous}px, 0)`
    }, [])
    
    const scrollHandler = useCallback(() => {
        if (isAnimating.current) return
        isAnimating.current = true
        gsap.ticker.add(smoothScrollingHandler)
    }, [smoothScrollingHandler])
    
    useEffect(() => {
        if (disableSmoothScroll) return
        
        window.addEventListener('scroll', scrollHandler, { passive: true })
        return () => {
            window.removeEventListener('scroll', scrollHandler)
            gsap.ticker.remove(smoothScrollingHandler)
            isAnimating.current = false
        }
    }, [scrollHandler, smoothScrollingHandler, isMobile]);

    useEffect(() => {
        setScrollerHeight()
    }, [obSize, reload])

    return (
        <div style={disableSmoothScroll ? null : parent_style}>
           <main id="scrollableContainer" ref={scrollableContainerRef} style={{willChange: disableSmoothScroll ? 'auto' : 'transform'}}>{children}</main>
        </div>
    )
}

export default SmoothScroll;
