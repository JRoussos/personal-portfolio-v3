import React, { useRef, useLayoutEffect, useMemo } from 'react'

import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader, Vector3, Vector2 } from 'three'
import { gsap } from 'gsap'

import { isMobile } from 'react-device-detect'

import profile from '../../../../assets/imgs/profile-small-01.jpeg'
import { fragment, vertex } from './shaders'

const Profile = () => {
    const texture = useLoader(TextureLoader, profile)
    const { viewport } = useThree()
    
    const meshRef = useRef()

    const { uTexture, uOpacity, uOffset, position } = useMemo(() => {
        const uOpacity = { value: 0.0 }
        const uTexture = { value: texture }
        const uOffset  = { value: new Vector2(0.0, 0.0) }
        const position = { value: new Vector3(0.0, 0.0, 0.0) }

        return { uTexture, uOpacity, uOffset, position }
    }, [texture])

    useLayoutEffect(() => {
        const header = document.getElementById('profile-header')

        const { naturalHeight, naturalWidth } = texture.image
        const scale = naturalWidth / naturalHeight
        
        meshRef.current.scale.copy(new Vector3(scale, 1, 1))

        const handleOpacityChange_on = () => {
            if ( isMobile ) {
                position.value = new Vector3(2.5, 2.5, 0.0)
                const clientX = 0.0
                const clientY = 0.0

                gsap.to(position.value, { duration: 1.0, x: clientX, y: clientY, ease: 'power4.out', onUpdate: () => {
                    uOffset.value.x = clientX  - position.value.x
                    uOffset.value.y = clientY - position.value.y
                }})
            }

            gsap.to(uOpacity, {duration: 1, value: 1.0, ease: 'power4.out'})
        }
        const handleOpacityChange_off = () => gsap.to(uOpacity, {duration: 1, value: 1.0, ease: 'power4.out'})
        
        const handlePositionChange = event => {
            const { clientX, clientY } = event
            const convertRange = (value, oldMax, newMax) => (value /oldMax) * newMax - newMax/2

            gsap.to(position.value, { duration: 1.0, x: convertRange(clientX, window.innerWidth, viewport.width), y: convertRange(clientY, window.innerHeight, viewport.height), ease: 'power4.out', onUpdate: () => {
                uOffset.value.x = convertRange(clientX, window.innerWidth, viewport.width)  - position.value.x
                uOffset.value.y = convertRange(clientY, window.innerHeight, viewport.height) - position.value.y
            }})
        }
        
        header.addEventListener('mouseover',  handleOpacityChange_on )
        header.addEventListener('mouseleave', handleOpacityChange_off )

        isMobile || document.addEventListener('mousemove', handlePositionChange )

        return () => {
            header.removeEventListener('mouseover',  handleOpacityChange_on )
            header.removeEventListener('mouseleave', handleOpacityChange_off )

            document.removeEventListener('mousemove', handlePositionChange )
        }
    }, [texture, position, uOffset, uOpacity, viewport])

    useFrame(() => {        
        meshRef.current.material.uniforms.uOpacity.value = uOpacity.value
        
        meshRef.current.position.x = position.value.x
        meshRef.current.position.y = -position.value.y
    })

    const uniforms = {
        uTexture: uTexture,
        uOpacity: uOpacity,
        uOffset: uOffset
    }

    return (
        <mesh ref={meshRef}>
            <planeGeometry attach="geometry" args={[30, 30, 64, 64]}/>
            <shaderMaterial attach="material" uniforms={uniforms} fragmentShader={fragment} vertexShader={vertex} transparent={true}/>
        </mesh>
    )
}

export default Profile