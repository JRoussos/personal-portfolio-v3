import React, { useEffect, useRef } from 'react'
import { isMobile } from 'react-device-detect'
import { getScrollValue } from '@components/smoothScroll/SmoothScroll'

import '@styles/components/_marquee.scss'

// Pixels per second at playbackRate 1.
const BASE_SPEED = 60
// How quickly playbackRate eases toward the Lenis-driven target (per 60fps tick).
const RATE_SMOOTHING = 0.14
const MAX_PLAYBACK_RATE = 10

const Marquee = ({ text }) => {
    const offsetRef = useRef(null)
    const containerRef = useRef(null)
    const trackRef = useRef(null)

    // Break out of parent horizontal inset so the marquee spans the full viewport.
    useEffect(() => {
        const offsetRoot = offsetRef.current
        if (!offsetRoot) return

        const setOffset = () => {
            const { x } = offsetRoot.getBoundingClientRect()
            offsetRoot.children[0].style.transform = `translate3d(-${Math.abs(x)}px, 0, 0)`
        }

        setOffset()
        window.addEventListener('resize', setOffset)
        return () => window.removeEventListener('resize', setOffset)
    }, [])

    useEffect(() => {
        const container = containerRef.current
        const track = trackRef.current
        if (!container || !track) return

        const prefersReducedMotion =
            window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        if (prefersReducedMotion) return

        const segment = track.children[0]
        let animation = null
        let playbackRate = 1
        let visible = true
        let rafId = 0
        let lastTs = performance.now()
        // Mobile uses native scroll (no Lenis) — keep a steady speed instead of
        // coupling playbackRate to scroll velocity.
        const scrollLinked = !isMobile

        const syncAnimation = () => {
            const loopWidth = segment.offsetWidth
            if (!loopWidth) return

            const duration = (loopWidth / BASE_SPEED) * 1000
            // Prefer currentTime over getComputedTiming().progress — more reliable
            // across Safari when recreating the animation.
            const prevTime = animation?.currentTime ?? 0
            const prevDuration = animation?.effect?.getTiming?.()?.duration || duration
            const prevProgress =
                typeof prevTime === 'number' && prevDuration
                    ? (prevTime / prevDuration) % 1
                    : 0

            animation?.cancel()
            // Pixel translate (not -50%): Safari iOS Web Animations often fail to
            // resolve percentage transforms, so the track never moves.
            animation = track.animate(
                [
                    { transform: 'translate3d(0, 0, 0)' },
                    { transform: `translate3d(${-loopWidth}px, 0, 0)` },
                ],
                {
                    duration,
                    iterations: Infinity,
                    easing: 'linear',
                }
            )
            animation.currentTime = prevProgress * duration
            animation.playbackRate = playbackRate
            if (!visible) animation.pause()
        }

        const onFrame = (now) => {
            rafId = requestAnimationFrame(onFrame)
            if (!animation) return

            const dt = Math.max((now - lastTs) / 1000, 0.001)
            lastTs = now

            // Lenis delta is the per-tick scroll change (lenis.velocity).
            const { delta } = getScrollValue()
            const scrollSpeed = visible ? Math.abs(delta) / dt : 0

            const targetRate = Math.min(1 + scrollSpeed / BASE_SPEED, MAX_PLAYBACK_RATE)
            const alpha = 1 - Math.pow(1 - RATE_SMOOTHING, dt * 60)

            playbackRate += (targetRate - playbackRate) * alpha
            animation.playbackRate = playbackRate
        }

        const resizeObserver = new ResizeObserver(syncAnimation)
        resizeObserver.observe(segment)
        syncAnimation()
        // Web fonts often resolve after first layout on iOS; rebuild once metrics are ready.
        document.fonts?.ready?.then?.(syncAnimation)

        const intersectionObserver = new IntersectionObserver(
            ([entry]) => {
                visible = entry.isIntersecting
                if (!animation) return
                if (visible) {
                    lastTs = performance.now()
                    animation.play()
                } else {
                    animation.pause()
                }
            },
            { rootMargin: '15% 0px' }
        )
        intersectionObserver.observe(container)

        if (scrollLinked) rafId = requestAnimationFrame(onFrame)

        return () => {
            resizeObserver.disconnect()
            intersectionObserver.disconnect()
            cancelAnimationFrame(rafId)
            animation?.cancel()
        }
    }, [text])

    const label = `${text} —`

    return (
        <div ref={offsetRef} className='marquee-offset'>
            <div className='marquee-offset__inner'>
                <div ref={containerRef} className='marquee'>
                    <div ref={trackRef} className='marquee__track'>
                        <div className='marquee__segment'>
                            <h1 className='marquee__title'>{label}&nbsp;</h1>
                            <h1 className='marquee__title' aria-hidden='true'>{label}&nbsp;</h1>
                            <h1 className='marquee__title' aria-hidden='true'>{label}&nbsp;</h1>
                        </div>
                        <div className='marquee__segment' aria-hidden='true'>
                            <h1 className='marquee__title'>{label}&nbsp;</h1>
                            <h1 className='marquee__title'>{label}&nbsp;</h1>
                            <h1 className='marquee__title'>{label}&nbsp;</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Marquee
