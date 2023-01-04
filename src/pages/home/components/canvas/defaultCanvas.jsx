import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';

import { useStore } from '../../../../contexts/store';

import Scrolling from './scrolling';

const CanvasReady = () => {
    const { dispatch } = useStore()
    useEffect(() => dispatch({ type: 'CHANGE_CANVAS_LOADED', canvasReady: true }), [dispatch])

    return null
}

const DefaultCanvas = () => {
    const canvasRef = useRef()

    const cameraProps = {
		fov: 24,
		near: 0.1,
		far: 1000,
        aspect: 1.77,
		position: [0, 0, 100]
	}

    useEffect(() => {
        const handleResize = () => canvasRef.current.style.height = `${window.innerHeight}px`
        
        handleResize()
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div ref={canvasRef} id="canvas-container">
            <Suspense fallback={ null }>
                <Canvas dpr={[window.devicePixelRatio, 2]} camera={cameraProps} >
                    <Scrolling/>
                    <CanvasReady/>
                </Canvas>
            </Suspense>
        </div>
    )
}

export default DefaultCanvas


