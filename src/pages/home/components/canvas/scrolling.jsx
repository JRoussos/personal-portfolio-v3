import React, { useEffect, useRef } from 'react'

import { useFrame } from '@react-three/fiber'

import normalizeWheel from 'normalize-wheel';
import { gsap } from 'gsap'

import Tiles from './tiles/tiles';
import Texts from './texts/texts';

const Scrolling = () => {    
    const tilesRef = useRef()
    const textsRef = useRef()

    const currentScroll = useRef(1.0)
    const prevScroll = useRef(0)
    const rounded = useRef(0)
    
    const scrollIndexValue = useRef(0)
    const scrollDeltaProgress = useRef(0)

    const delta = useRef(0)
    const uAlpha = useRef(1)

    const tileHeight = 32
    const textHeight = 11

    const config = {
        scale: 1,
        pointerPosition: 0
    }

    const touchProps = useRef({
        touchStart: 0,
        touchCurrent: 0,
        isDragging: false,
    })

    const lerp = (a, b, t) => (1 - t) * a + t * b

    // const asterisk = document.getElementById('asterisk-icon')

    useFrame(({ clock }) => {
        scrollDeltaProgress.current = lerp(prevScroll.current, currentScroll.current, 0.07)
        
        scrollIndexValue.current += scrollDeltaProgress.current
        currentScroll.current *= 0.4

        rounded.current = Math.round(scrollIndexValue.current)
        prevScroll.current = scrollDeltaProgress.current

        delta.current += (prevScroll.current / 0.006 - delta.current) * 0.1

        let diff = (rounded.current - scrollIndexValue.current)

        scrollIndexValue.current += Math.sign(diff) * Math.pow(Math.abs(diff), 0.7) * 0.02
        scrollIndexValue.current = Math.round(scrollIndexValue.current * 10000) / 10000
        scrollIndexValue.current %= 4
        rounded.current %= 4

        config.pointerPosition = rounded.current

        if (scrollIndexValue.current < 0) scrollIndexValue.current += 4 //number of indicators

        tilesRef.current.children.forEach((mesh, index) => {
            mesh.position.y = (scrollIndexValue.current * tileHeight) - (tileHeight * 7) + (tileHeight * index) // tileHeight * 7 to correct position and order

            mesh.material.uniforms.uDelta.value = delta.current
            mesh.material.uniforms.uTime.value = clock.elapsedTime
            mesh.material.uniforms.uAlpha.value = uAlpha.current
        })

        textsRef.current.children.forEach((textMesh, index) => {
            const t = textMesh.children[0].children[0].children[0]

            t.position.y = (scrollIndexValue.current * textHeight) - (textHeight * 7) + (textHeight * index) // tileHeight * 7 to correct position and order
            
            // t.material.uniforms.uDelta.value = delta.current
            // t.material.uniforms.uTime.value = clock.elapsedTime

            const distance = Math.fround(1.0 - Math.abs(t.position.y / 8))
            t.material.opacity = Math.max(distance * 0.75, 0.02)
            // t.material.uniforms.uAlpha.value = Math.max(distance * 0.75, 0.02)
        })

        // asterisk.style.transform = `rotate(${(scrollIndexValue.current/4) * 180}deg)`
    })

    useEffect(() => {
        const handleWheel = event => {
            const normalized = normalizeWheel(event)
            currentScroll.current += normalized.pixelY * 0.003
        }

        const handleTouchDown = event => {
            touchProps.current.touchStart = event.clientY || event.touches[0].clientY
            touchProps.current.isDragging = true
        }

        const handleTouchUp = () => {
            touchProps.current.isDragging = false
        }

        const handleTouchMove = event => {
            if (!touchProps.current.isDragging) return

            touchProps.current.touchCurrent = event.clientY || event.touches[0].clientY

            currentScroll.current -= (
                touchProps.current.touchCurrent -
                touchProps.current.touchStart) * 0.0045

            touchProps.current.touchStart = touchProps.current.touchCurrent
        }

        gsap.to([currentScroll, uAlpha], { duration: 1.5, current: 0, ease: 'sine.out' })
        
        document.addEventListener('mousedown', handleTouchDown)
        document.addEventListener('mousemove', handleTouchMove)
        document.addEventListener('mouseup', handleTouchUp)
        
        document.addEventListener('touchstart', handleTouchDown)
        document.addEventListener('touchmove', handleTouchMove)
        document.addEventListener('touchend', handleTouchUp)
        
        document.addEventListener('wheel', handleWheel)

        return () => {
            document.removeEventListener('mousedown', handleTouchDown)
            document.removeEventListener('mousemove', handleTouchMove)
            document.removeEventListener('mouseup', handleTouchUp)

            document.removeEventListener('touchstart', handleTouchDown)
            document.removeEventListener('touchmove', handleTouchMove)
            document.removeEventListener('touchend', handleTouchUp)

            document.removeEventListener('wheel', handleWheel)
        } 
    }, [])

    return (
        <React.Fragment>
            <Tiles ref={tilesRef} tileHeight={tileHeight} touchProps={touchProps}/>
            <Texts ref={textsRef}/>
        </React.Fragment>
    )
}

export default Scrolling
