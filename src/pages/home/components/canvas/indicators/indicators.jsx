import React from 'react'
import { useThree } from '@react-three/fiber'

import useWindowSize from '../../../../../hooks/useWindowSize'

const HoverElement = () => {
    return (
        <mesh position={[0.4, 1, -1]}>
            <planeGeometry attach='geometry' args={[5, 3, 1, 1]} />
            <meshBasicMaterial attach='material' visible={false} color={'red'} />
        </mesh>
    )
}

const Indicators = React.forwardRef(({ number = 4, handlePointerOut, handlePointerOver, handlePointerMove }, groupRef) => {
    const { viewport } = useThree()
    const { width } = useWindowSize()

    const margin = 0.45

    // useEffect(() => {
    //     const hresize = () => {
    //         // console.log(viewport.height);
    //         // groupRef.current.scale.set(viewport.height, viewport.height, 1)
    //     }

    //     window.addEventListener('resize', hresize)
    // }, [])

    return (
        <group ref={groupRef} visible={ width > 725 } position={[Math.min(viewport.width / 2.5, 45), -1, 0]} onPointerOver={handlePointerOver} onPointerMove={handlePointerMove} onPointerOut={handlePointerOut}>
            {new Array(number).fill("").map((_, index) => (
                <mesh key={index} position={[0, margin * index, 0]} dist={0} index={index}>
                    <planeGeometry attach='geometry' args={[2.7, 0.06, 1, 1]} />
                    <meshBasicMaterial attach='material' color={'white'} transparent={true} depthTest={false} />
                </mesh>
            ))}
            <HoverElement />
        </group>
    )
})

export default Indicators