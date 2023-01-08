import React, { useEffect, useRef, useMemo } from 'react'
import { useThree, useLoader } from '@react-three/fiber'
import { Vector2, TextureLoader } from 'three'

import { useNavigate } from 'react-router-dom'
// import { gsap } from 'gsap'

import data from '../../../../../contexts/data'
import { fragment, vertex } from './shaders'

const Image = ({ idx, src, height, path, touchProps }) => {
    const { camera } = useThree()
    const { isDragging } = touchProps.current
    
    const navigate = useNavigate()
    const meshRef = useRef()

    const { uDelta, uSize, uTime, uTexture, uAlpha } = useMemo(() => {

        const uDelta =      { value: 0.0 }
        const uTime =       { value: 0.0 }
        const uAlpha =      { value: 1.0 }
        const uTexture =    { value: src }
        const uSize =       { value: new Vector2(window.innerWidth, window.innerHeight) }

        return { uDelta, uSize, uTime, uTexture, uAlpha }
    }, [])

    const uniforms = {
        uTime: uTime,
        uDelta: uDelta,
        uAlpha: uAlpha, 
        uSize: uSize,
        uTexture: uTexture
    }

    const handlePointerOver = () => {
        document.body.style.cursor = "pointer"
        // gsap.to(uniforms.uHover, {duration: 1.2, value: 0.5, ease: 'expo.out'})
    }

    const handlePointerOut = () => {
        document.body.style.cursor = "auto"
        // gsap.to(uniforms.uHover, {duration: 1.2, value: 0.0, ease: 'expo.out'})
    }

    const handleClick = () => {
        if( isDragging ) return 
        navigate(path)
    }

    useEffect(() => {
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight

            const vFov = camera.fov * Math.PI / 180
            const padding = 10
            
            const height = 2 * Math.tan(vFov / 2) * (camera.position.z - padding)
            const width = height * Math.min(camera.aspect, 1.77) 

            const scaleX = width /meshRef.current.geometry.parameters.width

            meshRef.current.scale.set(scaleX, 1, 1)
            meshRef.current.material.uniforms.uSize.value = new Vector2(width+padding, height)
        }
        
        handleResize()
        
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <mesh ref={meshRef} position={[0, idx * height, 0]}
            onClick={handleClick} 
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
        >
            <planeGeometry attach="geometry" args={[60, 30, 16, 16]} frustumCulled={false}/>
            <shaderMaterial attach="material" fragmentShader={fragment} vertexShader={vertex} transparent={ true }
                uniforms={uniforms}
            />
        </mesh>
    )
}

const Tiles = React.forwardRef(( { number = 4, tileHeight, touchProps }, groupRef) => {
    const ts = useLoader(TextureLoader, data.map( project => {
        return project.media.picture
    }))
    
    return (
        <group ref={groupRef}>
            {new Array(3*number).fill("").map( (_, index) => 
                <Image key={index} idx={index} src={ts[index%ts.length]} height={tileHeight} touchProps={touchProps}
                    path={`/project/${data[index%ts.length].path}`}/> )}
        </group>
    )
})

export default Tiles