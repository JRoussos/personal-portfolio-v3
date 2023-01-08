import React, { useMemo } from 'react'
import { Text3D, Center } from '@react-three/drei'
import { AdditiveBlending, Vector2 } from 'three'
import { useThree } from '@react-three/fiber'
// import { gsap } from 'gsap'

// import { fragment, vertex } from './shaders'

import data from '../../../../../contexts/data'
import font from '../../../../../assets/fonts/Italiana/Italiana_Regular.json'

const Text = ({ idx, total }) => {
    
    // const { uDelta, uSize, uTime, uAlpha, uDistance } = useMemo(() => {

    //     const uDelta =      { value: 0.0 }
    //     const uTime =       { value: 0.0 }
    //     const uAlpha =      { value: 0.8 }
    //     const uDistance =   { value: 0.0 }
    //     const uSize =       { value: new Vector2(window.innerWidth, window.innerHeight) }

    //     return { uDelta, uSize, uTime, uAlpha, uDistance }
    // }, [])

    // const uniforms = {
    //     uTime: uTime,
    //     uDelta: uDelta,
    //     uAlpha: uAlpha, 
    //     uSize: uSize,
    //     uDistance: uDistance
    // }
    const { viewport } = useThree()

    return (
        <Center disableY>
            <Text3D font={font} size={Math.min(viewport.width/20 * 3.4, 3.4)} letterSpacing={-0.28} height={0} scale={[1, 1.2, 1]}> 
                <meshBasicMaterial attach="material" transparent={ true } depthTest={false} blending={AdditiveBlending}/>
                {/* <shaderMaterial attach="material" fragmentShader={fragment} vertexShader={vertex} transparent={ true } uniforms={uniforms} depthTest={false}
                    blending={AdditiveBlending} /> */}
                {data[idx%total].name.toUpperCase()}
            </Text3D>
        </Center>
    )
}

const Texts = React.forwardRef(({ number = 4 }, groupRef) => {
    return (
        <group ref={groupRef} position={[0, -2.5, 0]}>
            {new Array(3*number).fill("").map( (_, index) => 
                <Text key={index+data[index%number].id} idx={index} total={number}/> )}
        </group>
    )
})

export default Texts