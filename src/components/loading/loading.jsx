import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { gsap } from 'gsap'
import imagesloaded from 'imagesloaded';

import { photos } from '../../contexts/data';

import './loading-style.scss'

const Loading = ({ children }) => {
    const [loadedImages, setLoadedImages] = useState(false)
    const textRef = useRef(null)

    useEffect(() => {
        const pictures = document.getElementById('preload-photos')
        let progress = 0

        const imgLoad = imagesloaded( pictures, () => {
            gsap.to('.loading-screen', {duration: 0.4, opacity: 0, delay: 1.5, ease: 'sine.out', onComplete: () => {
                setLoadedImages(true)
            }})
        })

        imgLoad.on( 'progress', () => {
            progress ++
            const percentage = (progress / photos.length)

            gsap.to(textRef.current, { scaleX: percentage, ease: 'sine.inOut' })
        })
          
    }, [])

    return loadedImages ? children : createPortal(
        <div className='loading-screen'>
            <div className='loading-line-wrapper'>
                <div className='loading-line'>
                    <span ref={textRef}></span>
                </div>
            </div>
            <div id='preload-photos' style={{ visibility: 'hidden', position: 'fixed' }}>
                {photos.map( src => <img src={src} key={src} alt='preloading'/>)}
            </div>
        </div>, document.getElementById('root'))
}

export default Loading