import React, { useRef, useLayoutEffect, useCallback } from 'react';
import { gsap } from 'gsap';

const cursor_styles = {
    position: 'fixed',
    top: '-109px',
    left: '-109px',
    opacity: 0,
    pointerEvents: 'none',
    willChange: 'transform',
    mixBlendMode: 'difference',
    zIndex: 200
}

// export const mouseListeners = handle => {
//     const handleActive = () => {
//         gsap.to('#rect', { duration: 0.3, fillOpacity: 0.8 })
//     }

//     const handleDeactive = () => {
//         gsap.to('#rect', { duration: 0.3, fillOpacity: 0 })
//     }

//     document.querySelectorAll('a').forEach( element => {
//             element.addEventListener('mouseenter', handleActive )
//             element.addEventListener('mouseleave', handleDeactive )
//         }
//     )
// }

const Mouse = ({ isMobile=false }) => {
    const mousePreviousPosition = useRef({x: 0, y: 0})
    const mouseCurrentPosition = useRef({x: 0, y: 0})

    const isMouseOffScreen = useRef(true)

    const quickSet = useRef({x: null, y: null, rotate: null, scaleX: null, scaleY: null})
    
    const onTick = useCallback(() => {
        const getRotation = (x, y) => Math.atan2(y, x) * 180 / Math.PI // return the angle converted in degrees from radians
        const getDistance = (x, y) => Math.min(Math.hypot(x, y), 40) //Math.min(Math.hypot(x, y) / 100, 0.4) // return the distance between the x and y value of the previous position 
        // Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) - As it turns out there is a deicated math function for than 

        const rotation = getRotation(mousePreviousPosition.current.x, mousePreviousPosition.current.y)
        const distance = getDistance(mousePreviousPosition.current.x, mousePreviousPosition.current.y)

        quickSet.current.x(mouseCurrentPosition.current.x)
        quickSet.current.y(mouseCurrentPosition.current.y)

        quickSet.current.width(60 + distance)
        quickSet.current.rotate(rotation)
    }, [])

    const handleMouseLeave = useCallback( event => {
        event.stopPropagation()

        isMouseOffScreen.current = true
        gsap.to('#cursor', { id: 'hideCursor', duration: 0.5, delay: 1, opacity: 0 })
    }, [])

    const handleMouseMove = useCallback( ({ clientX, clientY }) => {
        if( isMouseOffScreen.current ) {
            mouseCurrentPosition.current.x = clientX
            mouseCurrentPosition.current.y = clientY
            
            isMouseOffScreen.current = false 
            
            gsap.getById('hideCursor')?.kill()
            gsap.to('#cursor', { duration: 0.5, opacity: 1 })
            return
        }

        gsap.to(mouseCurrentPosition.current, { duration: 1.2, x: clientX, y: clientY, ease: 'expo.out', onUpdate: () => {
            mousePreviousPosition.current.x = clientX - mouseCurrentPosition.current.x // distance from the actual x position to the current position one
            mousePreviousPosition.current.y = clientY - mouseCurrentPosition.current.y // distance from the actual y position to the current position one
        }})
    }, [])

    useLayoutEffect(() => {
        quickSet.current.x      = gsap.quickSetter('#cursor', 'x', 'px')
        quickSet.current.y      = gsap.quickSetter('#cursor', 'y', 'px')

        quickSet.current.rotate = gsap.quickSetter('#cursor', 'rotate', 'deg')
        quickSet.current.width  = gsap.quickSetter('#rect', 'width')

        gsap.ticker.add(onTick)
        
        document.documentElement.addEventListener('mousemove', handleMouseMove)
        document.documentElement.addEventListener('mouseleave', handleMouseLeave)

        // mouseListeners()

        return () => {
            document.documentElement.removeEventListener('mousemove', handleMouseMove)
            document.documentElement.removeEventListener('mouseleave', handleMouseLeave)                
        }

    }, [onTick, handleMouseMove, handleMouseLeave])

    return isMobile ? null : (
        <svg id="cursor" width="220" height="220" viewBox="0 0 220 220" fill="none" style={cursor_styles}>
            <rect id="rect" x="80" y="80" width="60" height="60" rx="30" stroke="white" strokeOpacity="0.8" strokeWidth="2px" fillOpacity="0" fill="white"/>
        </svg>
    )
}

export default Mouse