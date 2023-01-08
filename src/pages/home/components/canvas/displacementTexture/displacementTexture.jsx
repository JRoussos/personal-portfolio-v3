import React, { useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { useTrailTexture } from '@react-three/drei'

import { fragment, vertex } from './shaders'

const DisplacementTexture = React.forwardRef(({ FBOTexture }, meshRef) => {
    const { viewport } = useThree()
    const [ texture, onMove ] = useTrailTexture()

    const { uTime, uTrailTexture, uFBOTexture } = useMemo(() => {
        const uTime         = { value: 0.0 }
        const uTrailTexture = { value: texture }
        const uFBOTexture   = { value: FBOTexture }

        return { uTime, uTrailTexture, uFBOTexture }
    }, [])

    const uniforms = {
        uTime: uTime,
        uTrailTexture: uTrailTexture, 
        uFBOTexture: uFBOTexture
    }

    return (
        <mesh ref={meshRef} onPointerMove={onMove}>
            <planeGeometry attach="geometry" args={[viewport.width, viewport.height, 1, 1]}/>
            <shaderMaterial attach="material" uniforms={uniforms} fragmentShader={fragment} vertexShader={vertex}/>
        </mesh>
    )
})

export default DisplacementTexture