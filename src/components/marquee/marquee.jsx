import React, { useCallback, useEffect, useRef } from 'react'
import { getScrollValue } from '../smoothScroll/SmoothScroll'
import './marquee-style.scss'

const Marquee = ({ text }) => {
    const animationFrameID = useRef()
    const marqueeRef = useRef()
    
    const current_position = useRef(0)
    const width = useRef(0)

    let then = new Date().getTime()
    let interval = 16.667
    
    const animate = useCallback(() => {
        if (!marqueeRef.current) return
        animationFrameID.current = requestAnimationFrame(animate)

        let now = new Date().getTime()
        let diff = now - then

        if(diff > interval) {
            then = now - (diff % interval)

            const { delta } = getScrollValue()
            
            current_position.current += 1 + Math.abs(delta)
            if (current_position.current > width.current ) current_position.current = 0
    
            marqueeRef.current.style.transform = `translate3d(-${current_position.current}px, 0, 0)`
        }

    }, [])

    
    useEffect(() => {
        const initializePositions = () => {
            width.current = marqueeRef.current.clientWidth/2
            // console.log(width.current);
        }
        
        window.addEventListener('resize', initializePositions)
        setTimeout(initializePositions, 100)
        
        animate()
        return () => {
            window.removeEventListener('resize', initializePositions)
            cancelAnimationFrame(animationFrameID.current)
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