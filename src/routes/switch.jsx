import React, { useState, useEffect, useCallback } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { isMobile } from 'react-device-detect'

import loadable from '@loadable/component'

import Transition from '@components/transition/transition'
import SmoothScroll from '@components/smoothScroll/SmoothScroll'

import Home from '@pages/home/home'

const About     = loadable(() => import('@pages/about/about'))
const Project   = loadable(() => import('@pages/project/project'))
const NotFound  = loadable(() => import('@pages/notFound/notFound'))

import { SASS_VARIABLES } from '@utils/sass-variables'

const Switch = () => {
    const routerLocation = useLocation()

    const [currentLocation, setCurrentLocation] = useState(routerLocation)
    const [transitionState, setTransitionState] = useState("route-transition__fadeIn")

    const skipTransition = routerLocation.state?.skipTransition

    const setBodyStyle= useCallback( path => {
        document.body.style.background = path === '/' 
            ? SASS_VARIABLES.BACKGROUND_DARK 
            : SASS_VARIABLES.BACKGROUND_WHITE

        document.body.style.cursor = "auto"
    }, [])

    useEffect(() => {
        if (routerLocation === currentLocation) return

        if (skipTransition) {
            setCurrentLocation(routerLocation)
            setBodyStyle(routerLocation.pathname)
            return
        }

        setTransitionState("route-transition__fadeOut")
    }, [routerLocation, currentLocation, skipTransition, setBodyStyle])

    const handleAnimationEnd = () => {
        if(transitionState === "route-transition__fadeOut") {
            setTransitionState("route-transition__fadeIn")
            setCurrentLocation(routerLocation)

            setBodyStyle(routerLocation.pathname)
        }
    }

    return (
        <SmoothScroll isMobile={isMobile} reload={[ currentLocation ]}>
            <div className={transitionState} onAnimationEnd={handleAnimationEnd}>
                <Routes location={currentLocation} key={currentLocation.key}>
                    <Route path="/" element={ <Home/> }/>
                    <Route path="/about" element={ <About/> }/>
                    <Route path="/project/:name" element={ <Project/> }/>
                    <Route path="*" element={ <NotFound/> }/>
                </Routes>
                {routerLocation !== currentLocation && !skipTransition && (
                    <Transition path={routerLocation.pathname}/>
                )}
            </div>
        </SmoothScroll>
    )
}

export default Switch
