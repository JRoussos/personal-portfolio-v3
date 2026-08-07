import React, { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import useObserverSize from '../../hooks/useObserverSize'

const config = {
    scroll: 0,
    // Lenis per-tick delta (same value as lenis.velocity during smooth scroll).
    delta: 0,
}

let lenisInstance = null

export const getScrollValue = () => {
    return { scroll: config.scroll, delta: config.delta }
}

/** Programmatic scroll that stays in sync with Lenis when it is active. */
export const scrollToImmediate = (top = 0) => {
    if (lenisInstance) {
        lenisInstance.scrollTo(top, { immediate: true })
    } else {
        window.scrollTo({ top, behavior: 'auto' })
    }
    config.scroll = top
    config.delta = 0
}

const clearJackedRootHeight = () => {
    const root = document.getElementById('root')
    if (root) root.style.height = ''
}

const SmoothScroll = ({ children, reload, isMobile = false }) => {
    const contentRef = useRef()

    // Skip Lenis on mobile; Lenis itself also honors prefers-reduced-motion
    // (lerp forced to 1) when we do create an instance on desktop.
    const disableSmoothScroll = isMobile

    const obSize = useObserverSize(
        document.getElementById('scrollableContainer')
    )

    useEffect(() => {
        clearJackedRootHeight()

        if (disableSmoothScroll) {
            lenisInstance = null

            const onScroll = () => {
                const scroll = window.scrollY
                config.delta = scroll - config.scroll
                config.scroll = scroll
            }

            config.scroll = window.scrollY
            config.delta = 0
            window.addEventListener('scroll', onScroll, { passive: true })
            return () => {
                window.removeEventListener('scroll', onScroll)
                config.delta = 0
            }
        }

        // Native Lenis — no fixed shell, no translate3d jacking.
        // lerp: 0.06 matches the previous custom smooth-scroll feel.
        const lenis = new Lenis({
            autoRaf: true,
            lerp: 0.06,
            smoothWheel: true,
            syncTouch: false,
            respectReducedMotion: true,
            autoResize: true,
        })
        lenisInstance = lenis

        const onScroll = (instance) => {
            config.scroll = instance.scroll
            // Lenis.velocity is the per-tick scroll delta in px.
            config.delta = instance.velocity
        }

        lenis.on('scroll', onScroll)

        config.scroll = lenis.scroll
        config.delta = 0

        return () => {
            lenis.destroy()
            if (lenisInstance === lenis) lenisInstance = null
            config.delta = 0
        }
    }, [disableSmoothScroll])

    useEffect(() => {
        // Drop any leftover jacked #root height from older pages / navigations
        // so document flow + Lenis own the scroll length.
        clearJackedRootHeight()
        lenisInstance?.resize()
    }, [obSize, reload])

    return (
        <div>
            <main id="scrollableContainer" ref={contentRef}>
                {children}
            </main>
        </div>
    )
}

export default SmoothScroll
