import React, { useState, useEffect, useCallback } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { isMobile } from 'react-device-detect'

import loadable from '@loadable/component'

import Home from '../pages/home/home'
// import About from '../pages/about/about'
// import Project from '../pages/project/project'

import Transition from '../components/transition/transition'
import SmoothScroll from '../components/smoothScroll/SmoothScroll'

import './switch-styles.scss'

// const Home = loadable(() => import('../pages/home/home'))
const About = loadable(() => import('../pages/about/about'))
const Project = loadable(() => import('../pages/project/project'))

const Switch = () => {
    const routerLocation = useLocation()

    const [currentLocation, setCurrentLocation] = useState(routerLocation)
    const [transitionState, setTransitionState] = useState("fadeIn")

    const setBodyStyle= useCallback( path => {
        document.body.style.background = path === '/' ? '#090909' : '#f5f2f2'
        document.body.style.cursor = "auto"
    }, [])

    useEffect(() => {
        if (routerLocation !== currentLocation) setTransitionState("fadeOut")

    }, [routerLocation, currentLocation])

    const handleAnimationEnd = () => {
        if(transitionState === "fadeOut") {
            setTransitionState("fadeIn")
            setCurrentLocation(routerLocation)

            setBodyStyle(routerLocation.pathname)
        }
    }

    return (
        <SmoothScroll isMobile={isMobile} reload={[ currentLocation ]}>
            <div className={ `default-state ${transitionState}` } onAnimationEnd={handleAnimationEnd}>
                <Routes location={currentLocation} key={currentLocation.key}>
                    <Route path="/" element={ <Home/> }/>
                    <Route path="/about" element={ <About/> }/>
                    <Route path="/project/:id" element={ <Project/> }/>
                    <Route path="*" element={ <Navigate to="/" replace /> }/>
                </Routes>
                {routerLocation !== currentLocation && <Transition path={routerLocation.pathname}/>}
            </div>
        </SmoothScroll>
    )
}

export default Switch
