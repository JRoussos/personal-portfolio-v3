import React, { useMemo } from 'react'
import { Text3D, Center } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

import { AdditiveBlending, Vector2 } from 'three'

import { PROJECTS } from '@contexts/data'
import font from '@assets/fonts/Italiana/Italiana_Regular.json'   

const Text = ({value = ''}) => {
    const {viewport} = useThree()

    return (
        <Center disableY>
            <Text3D font={font} size={Math.min(viewport.width/20 * 3.4, 3.4)} letterSpacing={-0.28} height={0} scale={[1, 1.2, 1]}> 
                <meshBasicMaterial attach="material" transparent={ true } depthTest={false} blending={AdditiveBlending}/>
                {value}
            </Text3D>
        </Center>
    )
}

const Texts = React.forwardRef((_, groupRef) => {
    const projects = Object.values(PROJECTS)
    
    return (
        <group ref={groupRef} position={[0, -2.5, 0]}>
            {
                Array.from({ length: 3 * projects.length }, (_, index) => (
                    <Text 
                        key={index} 
                        value={projects[index % projects.length].name.toUpperCase()} 
                    />
                ))
            }
        </group>
    )
})

export default Texts