import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import useObserverSize from '@hooks/useObserverSize'

import 'lenis/dist/lenis.css'

const LENIS_OPTIONS = {
    autoRaf: true,
    lerp: 0.06,
    smoothWheel: true,
    syncTouch: false,
    respectReducedMotion: true,
    autoResize: true,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
}

// Imperative scroll snapshot for non-React consumers (e.g. marquee rAF loop).
const scrollState = { scroll: 0, delta: 0 }
let lenisInstance = null

export const getScrollValue = () => ({ ...scrollState })

/** Programmatic scroll that stays in sync with Lenis when it is active. */
export const scrollToImmediate = (top = 0) => {
    if (lenisInstance) {
        lenisInstance.scrollTo(top, { immediate: true })
    } 
    
    else {
        window.scrollTo({ top, behavior: 'auto' })
    }

    scrollState.scroll = top
    scrollState.delta = 0
}

const clearRootHeight = () => {
    document.getElementById('root')?.style.removeProperty('height')
}

const SmoothScroll = ({ children, reload, isMobile = false }) => {
    // Callback ref → state so ResizeObserver attaches after mount.
    const [contentNode, setContentNode] = useState(null)
    const contentSize = useObserverSize(contentNode)

    useEffect(() => {
        clearRootHeight()

        // Native scroll on mobile; Lenis also respects prefers-reduced-motion
        // (lerp → 1) when created on desktop.
        if (isMobile) {
            lenisInstance = null
            scrollState.scroll = window.scrollY
            scrollState.delta = 0

            const onScroll = () => {
                const scroll = window.scrollY
                scrollState.delta = scroll - scrollState.scroll
                scrollState.scroll = scroll
            }

            window.addEventListener('scroll', onScroll, { passive: true })
            return () => {
                window.removeEventListener('scroll', onScroll)
                scrollState.delta = 0
            }
        }

        const lenis = new Lenis(LENIS_OPTIONS)
        lenisInstance = lenis
        scrollState.scroll = lenis.scroll
        scrollState.delta = 0

        const onScroll = ({ scroll, velocity }) => {
            scrollState.scroll = scroll
            scrollState.delta = velocity
        }

        lenis.on('scroll', onScroll)

        return () => {
            lenis.off('scroll', onScroll)
            lenis.destroy()
            if (lenisInstance === lenis) lenisInstance = null
            scrollState.delta = 0
        }
    }, [isMobile])

    useEffect(() => {
        // Drop leftover jacked #root height from older navigations so
        // document flow + Lenis own the scroll length.
        clearRootHeight()
        lenisInstance?.resize()
    }, [contentSize, reload])

    return (
        <main className="smooth-scroll__content" ref={setContentNode}>
            {children}
        </main>
    )
}

export default SmoothScroll
