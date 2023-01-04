import React, { useEffect, useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'

import normalizeWheel from 'normalize-wheel';
import { gsap } from 'gsap'

import Tiles from './tiles/tiles';
import Indicators from './indicators/indicators';
import Texts from './texts/texts';

const Scrolling = () => {
    const tilesRef = useRef()
    const indicatorsRef = useRef()
    const textsRef = useRef()

    const currentScroll = useRef(-0.5)
    const prevScroll = useRef(0)
    const rounded = useRef(0)
    
    const scrollIndexValue = useRef(0)
    const scrollDeltaProgress = useRef(0)

    const delta = useRef(0)
    const uAlpha = useRef(1)

    const tileHeight = 32

    const config = {
        scale: 1,
        pointerPosition: 0
    }

    const touchProps = useRef({
        touchStart: 0,
        touchCurrent: 0,
        isDragging: false,
    })

    const pointerOver = useRef(false)

    const projectWrapper = document.getElementById('project-titles')
    const projectTitles = projectWrapper.childNodes
    const titleHeight = 200 // title-size + padding (180 + 20) 

    const lerp = (a, b, t) => (1 - t) * a + t * b

    const getDistance = useCallback(index => {
        let distance = []

        const { y: wrapperY, height: wrapperHeight } = projectWrapper.getBoundingClientRect()
        const w = wrapperY + wrapperHeight / 2

        projectTitles.forEach(title => {
            const { y: titleY, height: _titleHeight } = title.getBoundingClientRect()
            const t = titleY + _titleHeight / 2

            distance.push(Math.abs((w - t) / 140))
        })

        return distance[index]
    }, [projectTitles, projectWrapper])

    const handlePointerOver = () => {
        pointerOver.current = true
        gsap.to(config, { duration: 0.3, scale: 3, ease: 'circ.inOut' })
    }

    const handlePointerMove = event => {
        if (pointerOver.current && event.object.index !== undefined) {
            config.pointerPosition = event.object.index
        }
    }

    const handlePointerOut = () => {
        pointerOver.current = false
        gsap.to(config, { duration: 0.5, scale: 1, ease: 'circ.inOut' })
    }

    useFrame(({ clock }) => {
        scrollDeltaProgress.current = lerp(prevScroll.current, currentScroll.current, 0.07)
        
        scrollIndexValue.current -= scrollDeltaProgress.current
        currentScroll.current *= 0.4

        rounded.current = Math.round(scrollIndexValue.current)
        prevScroll.current = scrollDeltaProgress.current

        delta.current += (prevScroll.current / 0.006 - delta.current) * 0.1

        if (pointerOver.current) {
            scrollIndexValue.current -= (scrollIndexValue.current - config.pointerPosition) * 0.1
        } else {
            let diff = (rounded.current - scrollIndexValue.current)

            scrollIndexValue.current += Math.sign(diff) * Math.pow(Math.abs(diff), 0.7) * 0.02
            scrollIndexValue.current = Math.round(scrollIndexValue.current * 10000) / 10000
            scrollIndexValue.current %= 4
            rounded.current %= 4

            config.pointerPosition = rounded.current

            if (scrollIndexValue.current < 0) scrollIndexValue.current += 4 //number of indicators
        }

        indicatorsRef.current.children.forEach((mesh, index) => {
            if (mesh.dist === undefined) return

            if (index === 0 && scrollIndexValue.current > 3.01) mesh.dist = Math.min(Math.abs(scrollIndexValue.current - 4), 1)
            else mesh.dist = Math.min(Math.abs(scrollIndexValue.current - index), 1)

            mesh.dist = 1 - Math.pow(mesh.dist, 2)
            mesh.material.opacity = Math.min(Math.max(mesh.dist, 0.3), 1)

            mesh.scale.set(
                1 + (0.5 * mesh.dist),  // x
                config.scale * 1.5,     // y
                1                       // z
            )
        })

        tilesRef.current.children.forEach((mesh, index) => {
            mesh.position.y = (scrollIndexValue.current * tileHeight) - (tileHeight * 7) + (tileHeight * index) // tileHeight * 7 to correct position and order

            // mesh.material.uniforms.uDirection.value = mesh.position.y < 0 ? -1 : 1
            mesh.material.uniforms.uDelta.value = delta.current
            mesh.material.uniforms.uTime.value = clock.elapsedTime
            mesh.material.uniforms.uAlpha.value = uAlpha.current
        })

        projectTitles.forEach((title, index) => {
            const alpha = Math.min(Math.max(1 - getDistance(index), 0.025), 1)

            if (index % 4 === 0 && getDistance(index) > 4) title.style.opacity = 1
            else title.style.opacity = alpha

            title.style.transform = `translate3d(0, 
                -${titleHeight * scrollIndexValue.current.toFixed(5) + 4 * titleHeight}px, 0) ` //scaleY(1.2)
        })
    })

    useEffect(() => {
        const handleWheel = event => {
            if (pointerOver.current) return
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

            currentScroll.current += (
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
            <Tiles ref={tilesRef} tileHeight={tileHeight} />
            <Texts ref={textsRef} />
            <Indicators ref={indicatorsRef}
                handlePointerOut={handlePointerOut}
                handlePointerOver={handlePointerOver}
                handlePointerMove={handlePointerMove}
            />
        </React.Fragment>
    )
}

export default Scrolling