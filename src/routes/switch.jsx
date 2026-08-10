import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { isMobile } from 'react-device-detect'

import loadable from '@loadable/component'

import Transition from '@components/transition/transition'
import SmoothScroll from '@components/smoothScroll/SmoothScroll'

import Home from '@pages/home/home'

const About     = loadable(() => import('@pages/about/about'))
const Project   = loadable(() => import('@pages/project/project'))
const NotFound  = loadable(() => import('@pages/notFound/notFound'))

import usePrefersReducedMotion from '@hooks/usePrefersReducedMotion'
import { SASS_VARIABLES } from '@utils/sass-variables'

// Matches .route-transition__fadeOut duration — Safari fallback if animationend is dropped.
const FADE_OUT_MS = 1000

const Switch = () => {
    const routerLocation = useLocation()

    const reducedMotion = usePrefersReducedMotion()

    const [currentLocation, setCurrentLocation] = useState(routerLocation)
    const [transitionState, setTransitionState] = useState("route-transition__fadeIn")
    const fadeOutFallbackRef = useRef(null)
    const isFadingOutRef = useRef(false)
    const routerLocationRef = useRef(routerLocation)

    routerLocationRef.current = routerLocation

    const {skipTransition} = routerLocation.state || {}

    const setBodyStyle = useCallback(path => {
        document.body.style.background = path === '/'
            ? SASS_VARIABLES.BACKGROUND_DARK
            : SASS_VARIABLES.BACKGROUND_WHITE

        document.body.style.cursor = 'auto'
    }, [])

    const completeFadeOut = useCallback(() => {
        if (!isFadingOutRef.current) return
        isFadingOutRef.current = false

        if (fadeOutFallbackRef.current) {
            clearTimeout(fadeOutFallbackRef.current)
            fadeOutFallbackRef.current = null
        }

        const nextLocation = routerLocationRef.current

        setTransitionState('route-transition__fadeIn')
        
        setCurrentLocation(nextLocation)
        setBodyStyle(nextLocation.pathname)
        
    }, [setBodyStyle])

    useEffect(() => {
        if (routerLocation === currentLocation) return

        if (reducedMotion) {
            isFadingOutRef.current = false
            
            if (fadeOutFallbackRef.current) {
                clearTimeout(fadeOutFallbackRef.current)
                fadeOutFallbackRef.current = null
            }
            
            setCurrentLocation(routerLocation)
            setBodyStyle(routerLocation.pathname)
            
            return
        }

        isFadingOutRef.current = true
        setTransitionState('route-transition__fadeOut')

        // iOS Safari can skip animationend on transformed ancestors; still advance the route.
        if (fadeOutFallbackRef.current) clearTimeout(fadeOutFallbackRef.current)
        fadeOutFallbackRef.current = setTimeout(completeFadeOut, FADE_OUT_MS)

        return () => {
            if (fadeOutFallbackRef.current) {
                clearTimeout(fadeOutFallbackRef.current)
                fadeOutFallbackRef.current = null
            }
        }
    }, [routerLocation, currentLocation, skipTransition, reducedMotion, setBodyStyle, completeFadeOut])

    const handleAnimationEnd = (event) => {
        // Ignore bubbled animationend from nested elements (marquee, links, etc.).
        if (event.target !== event.currentTarget) return
        if (event.animationName !== 'fadeOut') return

        completeFadeOut()
    }

    return (
        <SmoothScroll isMobile={isMobile} reload={[currentLocation]}>
            <div 
                className={reducedMotion ? undefined : transitionState}
                onAnimationEnd={reducedMotion ? undefined : handleAnimationEnd}
            >
                <Routes location={currentLocation} key={currentLocation.key}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/project/:name" element={<Project />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
                {routerLocation !== currentLocation && !skipTransition && !reducedMotion && (
                    <Transition path={routerLocation.pathname} />
                )}
            </div>
        </SmoothScroll>
    )
}

export default Switch
