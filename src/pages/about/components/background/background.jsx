import React, { Suspense, useEffect, useMemo, useRef } from 'react';

import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader, Vector3 } from 'three'

import profile from '../../../../assets/imgs/profile.jpeg'
import { fragment, vertex } from './shaders'

const Profile = () => {
    const texture = useLoader(TextureLoader, profile)
    const { camera } = useThree()
    
    const meshRef = useRef()

    const { uTexture, uTime } = useMemo(() => {
        const uTime = { value: 0.0 }
        const uTexture = { value: texture }

        return { uTexture, uTime }
    }, [texture])

    useEffect(() => {
        const { naturalHeight, naturalWidth } = texture.image
        const scale = naturalWidth / naturalHeight
        
        meshRef.current.scale.copy(new Vector3(scale, 1, 1))
    }, [])

    useFrame(({ clock }) => {
        meshRef.current.material.uniforms.uTime.value = clock.elapsedTime
    })

    const uniforms = {
        uTexture: uTexture,
        uTime: uTime
    }

    // useEffect(() => {
    //     const handleResize = () => {
    //         // meshRef.current.material.uniforms.uSize.value = new Vector2(window.innerWidth, window.innerHeight)

    //         const vFov = camera.fov * Math.PI / 180
    //         const padding = 10

    //         const height = 2 * Math.tan(vFov / 2) * (camera.position.z - padding)
    //         const width = height * camera.aspect

    //         const scaleX = Math.min(width /meshRef.current.geometry.parameters.width, 1) 
    //         meshRef.current.scale.set(scaleX, 1, 1)
    //     }

    //     handleResize()
    //     // console.log(camera.aspect, meshRef.current.scale.);
    //     window.addEventListener('resize', handleResize)
    //     return () => window.removeEventListener('resize', handleResize)
        
    // }, [meshRef, camera])

    return (
        <mesh ref={meshRef} position={[5, 0, 0]}>
            <planeGeometry attach="geometry" args={[28, 28, 1, 1]}/>
            <shaderMaterial attach="material" uniforms={uniforms} fragmentShader={fragment} vertexShader={vertex} transparent={true}/>
        </mesh>
    )
}

const Background = () => {
    const cameraProps = {
		fov: 24, //Math.atan((window.innerHeight/2)/100) * 2 * (180/Math.PI),
		near: 0.1,
		far: 1000,
		position: [0, 0, 100]
	}

    return (
        <div id="canvas-container" style={{ zIndex: -1, pointerEvents: 'none', height: '700px' }}>
            <Suspense fallback={null}>
                <Canvas dpr={[window.devicePixelRatio, 2]} camera={cameraProps} style={{ pointerEvents: 'none' }}>
                    <Profile/>
                </Canvas>
            </Suspense>
        </div>
    )
}

export default Background
