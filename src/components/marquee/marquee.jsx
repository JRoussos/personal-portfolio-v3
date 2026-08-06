import React, { useCallback, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { getScrollValue } from '../smoothScroll/SmoothScroll'
import './marquee-style.scss'

// Base scrolling speed, in pixels per second (equivalent to the original
// "1px per ~16.6ms frame" behaviour, but expressed as a rate so it stays
// correct regardless of the display's refresh rate).
const BASE_SPEED = 60

const Marquee = ({ text }) => {
    const marqueeRef = useRef()
    
    const currentPosition = useRef(0)
    const width = useRef(0)

    // Driven by gsap's shared ticker (same one used by SmoothScroll) and
    // using its real deltaTime for the movement, instead of a hand-rolled
    // Date.now()/modulo frame gate racing against requestAnimationFrame.
    // That double-timing was the main source of visible stutter, since the
    // gate would arbitrarily skip or double up frames whenever the manual
    // clock drifted from the browser's actual vsync timing.
    const animate = useCallback((time, deltaTime) => {
        if (!marqueeRef.current || !width.current) return

        const { delta } = getScrollValue()
        const dt = deltaTime / 1000

        currentPosition.current += BASE_SPEED * dt + Math.abs(delta)
        if (currentPosition.current > width.current) currentPosition.current -= width.current

        marqueeRef.current.style.transform = `translate3d(-${currentPosition.current}px, 0, 0)`
    }, [])

    useEffect(() => {
        if (!marqueeRef.current) return

        const element = marqueeRef.current

        const resizeObserver = new ResizeObserver(() => {
            width.current = element.clientWidth / 2
        })
        resizeObserver.observe(element)

        gsap.ticker.add(animate)

        return () => {
            resizeObserver.disconnect()
            gsap.ticker.remove(animate)
        }
    }, [animate])

    return (
        <div className='marquee-container'>
            <div ref={marqueeRef} className='marquee'>
                <h1>{`${text} —`}&nbsp;</h1>
                <h1>{`${text} —`}&nbsp;</h1>
                <h1>{`${text} —`}&nbsp;</h1>
                <h1>{`${text} —`}&nbsp;</h1>
                <h1>{`${text} —`}&nbsp;</h1>
                <h1>{`${text} —`}&nbsp;</h1>
            </div>
        </div>
    )
}

export default Marquee;
