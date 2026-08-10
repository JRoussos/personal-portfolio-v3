import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { gsap } from 'gsap'
import imagesLoaded from 'imagesloaded'

import { PHOTOS } from '@contexts/data'
import '@styles/components/_image_load.scss'

const Loading = ({ children }) => {
    const [isReady, setIsReady] = useState(false)

    const imgLoadRef  = useRef(null)
    const lineFillRef = useRef(null)
    const preloadRef  = useRef(null)

    useEffect(() => {
        if (!preloadRef.current) return

        let loaded = 0
        const ImagesLoaded = imagesLoaded(preloadRef.current)

        const handleProgress = () => {
            loaded += 1
            gsap.to(lineFillRef.current, {
                scaleX: loaded / PHOTOS.length,
                ease: 'sine.inOut',
            })
        }

        const handleComplete = () => {
            gsap.to(imgLoadRef.current, {
                duration: 0.4,
                opacity: 0,
                delay: 1.5,
                ease: 'sine.out',
                onComplete: () => setIsReady(true),
            })
        }

        ImagesLoaded.on('progress', handleProgress)
        ImagesLoaded.on('always', handleComplete)

        return () => {
            ImagesLoaded.off('progress', handleProgress)
            ImagesLoaded.off('always', handleComplete)
            gsap.killTweensOf([lineFillRef.current, imgLoadRef.current])
        }
    }, [])

    if (isReady) return children

    return createPortal(
        <div ref={imgLoadRef} className='image-load'>
            <div className='image-load__container'>
                <div className='image-load__line'>
                    <span ref={lineFillRef} className='image-load__line--fill' />
                </div>
            </div>
            <div
                className='image-load__preload'
                ref={preloadRef}
                aria-hidden='true'
                style={{ visibility: 'hidden', position: 'fixed' }}
            >
                {PHOTOS.map(src => (
                    <img key={src} src={src} alt='' className='image-load__preload__img' loading='eager'/>
                ))}
            </div>
        </div>,
        document.body,
    )
}

export default Loading
