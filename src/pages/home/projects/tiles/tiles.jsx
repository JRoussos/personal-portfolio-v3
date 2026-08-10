import React, { useEffect, useRef, useMemo } from 'react'
import { useThree, useLoader } from '@react-three/fiber'
import { Vector2, TextureLoader } from 'three'

import { useNavigate } from 'react-router-dom'

import { PROJECTS } from '@contexts/data'
import { fragment, vertex } from './shaders'

const projects = Object.values(PROJECTS)   

const Image = ({ idx, src, height, path, touchProps }) => {
    // `size` tracks `.canvas__content` (layout padding + max-width 1500)
    const { camera, size } = useThree()
    const { isDragging } = touchProps.current
    
    const navigate = useNavigate()
    const meshRef = useRef()

    const { uDelta, uSize, uTime, uTexture, uAlpha } = useMemo(() => {

        const uDelta =      { value: 0.0 }
        const uTime =       { value: 0.0 }
        const uAlpha =      { value: 1.0 }
        const uTexture =    { value: src }
        const uSize =       { value: new Vector2(size.width, size.height) }

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
        if (!meshRef.current) return

        const aspect = size.width / size.height
        camera.aspect = aspect
        camera.updateProjectionMatrix()

        const vFov = camera.fov * Math.PI / 180
        // Visible frustum at the plane (z = 0) — fill canvas side-to-side
        const visibleHeight = 2 * Math.tan(vFov / 2) * camera.position.z
        const visibleWidth = visibleHeight * aspect

        const { width: geoW, height: geoH } = meshRef.current.geometry.parameters
        meshRef.current.scale.set(visibleWidth / geoW, 1, 1)

        // Cover UV must use the mesh's on-screen aspect (scaled W / unscaled H),
        // not the camera frustum — otherwise images stretch.
        meshRef.current.material.uniforms.uSize.value = new Vector2(visibleWidth, geoH)
    }, [camera, size.width, size.height])


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

const Tiles = React.forwardRef(({tileHeight, touchProps}, groupRef) => {
    const ts = useLoader(TextureLoader, projects.map(project => project.media.picture))
    
    return (
        <group ref={groupRef}>
            {
                Array.from({length: 3 * projects.length}, (_, index) => (
                    <Image 
                        key={index} 
                        idx={index} 
                        src={ts[index % ts.length]} 
                        height={tileHeight} 
                        touchProps={touchProps}
                        path={`/project/${projects[index%ts.length].path}`}
                    />
                ))
            }
        </group>
    )
})

export default Tiles