import React, { useEffect, useRef, useMemo } from 'react'
import { Text, Text3D } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Vector2, Loader } from 'three'

import font from '../../../../../assets/fonts/Italiana/Italiana_Regular.json'

// import { gsap } from 'gsap'

import data from '../../../../../contexts/data'

const Image = ({ idx, src, height, path }) => {
    const navigate = useNavigate()
    const { camera } = useThree()
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
        uTexture: uTexture,
        // uHover: { value: 0.0 }
    }

    const handlePointerOver = () => {
        document.body.style.cursor = "pointer"
        // gsap.to(uniforms.uHover, {duration: 1.2, value: 0.5, ease: 'expo.out'})
    }

    const handlePointerOut = () => {
        document.body.style.cursor = "auto"
        // gsap.to(uniforms.uHover, {duration: 1.2, value: 0.0, ease: 'expo.out'})
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
            onClick={() => navigate(path)} 
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

const Texts = React.forwardRef(( { number = 4, tileHeight }, groupRef) => {
    const { viewport } = useThree()
    return (
        <group ref={groupRef} position={[-36.7, -3.2, 0]}>
            {new Array(3*number).fill("").map( (_, index) => 
                // <Text key={index+data[index%number].id} 
                //     font={font} 
                //     fontSize={10} 
                //     anchorY={10*index} 
                //     letterSpacing={-0.0621}
                //     outlineWidth={0.05}
                //     outlineColor={'white'}
                //     outlineBlur={0.01}
                // >
                //     <meshBasicMaterial color={'white'} transparent opacity={0.8} />
                //     {data[index%number].name.toUpperCase()}
                // </Text> )}
                //position={[0,0,85]}>
                <Text3D key={index+data[index%number].id}
                    position={[0, 9*index, 0]}
                    font={font} size={6} letterSpacing={-0.7} height={0}
                > 
                    <meshBasicMaterial color={'white'} transparent opacity={0.8} depthTest={false}/>
                    {data[index%number].name.toUpperCase()}
                </Text3D> )}
        </group>
    )
})

export default Texts