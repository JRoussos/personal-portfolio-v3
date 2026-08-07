import React, { useEffect, useRef } from 'react'
import { getScrollValue } from '../smoothScroll/SmoothScroll'
import './marquee-style.scss'

// Pixels per second at playbackRate 1.
const BASE_SPEED = 60
// How quickly playbackRate eases toward the Lenis-driven target (per 60fps tick).
const RATE_SMOOTHING = 0.14
const MAX_PLAYBACK_RATE = 10

const Marquee = ({ text }) => {
    const containerRef = useRef(null)
    const trackRef = useRef(null)

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

        const syncAnimation = () => {
            const loopWidth = segment.offsetWidth
            if (!loopWidth) return

            const duration = (loopWidth / BASE_SPEED) * 1000
            const prevProgress =
                animation?.effect?.getComputedTiming?.()?.progress ?? 0

            animation?.cancel()
            // -50% is half the track (one segment). Keeps the loop seamless
            // without measuring or writing a pixel transform every frame —
            // the browser can run this on the compositor.
            animation = track.animate(
                [
                    { transform: 'translate3d(0, 0, 0)' },
                    { transform: 'translate3d(-50%, 0, 0)' },
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

        rafId = requestAnimationFrame(onFrame)

        return () => {
            resizeObserver.disconnect()
            intersectionObserver.disconnect()
            cancelAnimationFrame(rafId)
            animation?.cancel()
        }
    }, [text])

    const label = `${text} —`

    return (
        <div ref={containerRef} className='marquee-container'>
            <div ref={trackRef} className='marquee'>
                <div className='marquee__segment'>
                    <h1>{label}&nbsp;</h1>
                    <h1 aria-hidden='true'>{label}&nbsp;</h1>
                    <h1 aria-hidden='true'>{label}&nbsp;</h1>
                </div>
                <div className='marquee__segment' aria-hidden='true'>
                    <h1>{label}&nbsp;</h1>
                    <h1>{label}&nbsp;</h1>
                    <h1>{label}&nbsp;</h1>
                </div>
            </div>
        </div>
    )
}

export default Marquee
