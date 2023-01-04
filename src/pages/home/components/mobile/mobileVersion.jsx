import React, { useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import { useStore } from '../../../../contexts/store'
import data from '../../../../contexts/data'

import Texts from './texts/texts'

import './mobileVersion-styles.scss'

const MobileVersion = () => {
    const { dispatch } = useStore()
    const containerRef = useRef()

    const config = useRef({
        touchStart: 0,
        touchCurrent: 0,
        isDragging: false,
        scrollX: 0,
        x: 0
    })
    
    const lerp = (v0, v1, t) => v0 * (1 - t) + v1 * t  

    const render = useCallback(() => {
        config.current.x = lerp(config.current.x, config.current.scrollX, 0.1)

        containerRef.current.style.transform = `translate3d(${config.current.x}px, 0, 0)`
        
        requestAnimationFrame(render)
    }, [])


    useEffect(() => {
        dispatch({ type: 'CHANGE_CANVAS_LOADED', canvasReady: true })

        const handleTouchDown = event => {
            config.current.touchStart = event.clientX || event.touches[0].clientX
            config.current.isDragging = true
        }

        const handleTouchMove = event => {
            if(!config.current.isDragging) return

            config.current.touchCurrent = event.clientX || event.touches[0].clientX
            config.current.scrollX += (
                config.current.touchCurrent -
                config.current.touchStart) * 2.5

            config.current.touchStart = config.current.touchCurrent
        }
        
        const handleTouchUp = () => {
            config.current.isDragging = false
        }

        window.addEventListener('touchstart', handleTouchDown)
        window.addEventListener('touchmove', handleTouchMove)
        window.addEventListener('touchend', handleTouchUp)

        render()

        return () => {
            window.removeEventListener('touchstart', handleTouchDown)
            window.removeEventListener('touchmove', handleTouchMove)
            window.removeEventListener('touchend', handleTouchUp)
        }
    }, [dispatch, render])

    return (
        <React.Fragment>
            <div className='mobile'>
                <div className='images-container'>
                    <div ref={containerRef} className='projects-wrapper'>
                        {data.map((project, i) => (
                            <div key={project.id} className='project-container'>
                                <img src={project.media.picture} alt={project.desc} />
                                <div className='project-info'>
                                    <h1 data-indx={`0${i+1}/04`}>{project.name}</h1>
                                    <p className='subtitle'>{project.desc}</p>
                                    <Link to={`/project/${project.path}`}>See project</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* <div className='project-indicators'>
                    {new Array(data.length).fill('').map( (_, index) => <span key={index} className={index <= 0 ? 'active' : 'not-active'}></span>)}
                </div> */}
            </div>
            <Texts/>
        </React.Fragment>
    )
}

export default MobileVersion