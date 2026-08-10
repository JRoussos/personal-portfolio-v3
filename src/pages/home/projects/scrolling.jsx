import React, { useEffect, useRef } from 'react'

import { useFrame } from '@react-three/fiber'

import normalizeWheel from 'normalize-wheel';
import { gsap } from 'gsap'

import Tiles from './tiles/tiles';
import Texts from './texts/texts';

import { lerp } from '@utils/lerp'

import {
    PROJECT_COUNT,
    circularDelta,
    clearScrollTarget,
    getScrollTarget,
} from './scrollBridge'

const Scrolling = () => {    
    const tilesRef = useRef()
    const textsRef = useRef()

    const currentScroll = useRef(0.24)
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

    // const asterisk = document.getElementById('asterisk-icon')

    useFrame(({ clock }) => {
        // Tab-focused project link → ease the infinite scroller to that tile
        const scrollTarget = getScrollTarget()
        if (scrollTarget !== null) {
            const current = ((scrollIndexValue.current % PROJECT_COUNT) + PROJECT_COUNT) % PROJECT_COUNT
            const keyboardDiff = circularDelta(current, scrollTarget)

            // Kill residual wheel/drag momentum while keyboard is driving
            currentScroll.current = 0
            prevScroll.current = 0

            if (Math.abs(keyboardDiff) > 0.01) {
                scrollIndexValue.current += keyboardDiff * 0.18
            } else {
                scrollIndexValue.current = scrollTarget
            }
        }

        scrollDeltaProgress.current = lerp(prevScroll.current, currentScroll.current, 0.07)
        
        scrollIndexValue.current += scrollDeltaProgress.current
        currentScroll.current *= 0.4

        rounded.current = Math.round(scrollIndexValue.current)
        prevScroll.current = scrollDeltaProgress.current

        delta.current += (prevScroll.current / 0.006 - delta.current) * 0.1

        let diff = (rounded.current - scrollIndexValue.current)

        // Don't fight the keyboard-driven position with the magnetic snap
        if (scrollTarget === null) {
            scrollIndexValue.current += Math.sign(diff) * Math.pow(Math.abs(diff), 0.7) * 0.02
        }

        scrollIndexValue.current = Math.round(scrollIndexValue.current * 10000) / 10000
        scrollIndexValue.current %= PROJECT_COUNT
        rounded.current %= PROJECT_COUNT

        config.pointerPosition = rounded.current

        if (scrollIndexValue.current < 0) scrollIndexValue.current += PROJECT_COUNT

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
            // Pointer scroll wins over keyboard snap
            clearScrollTarget()

            const normalized = normalizeWheel(event)
            currentScroll.current += normalized.pixelY * 0.003
        }

        const handleTouchDown = event => {
            clearScrollTarget()
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
