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
        // let currentChild = 0

        const imgLoad = imagesloaded( pictures, () => {
            gsap.to('.loading-screen', {duration: 0.4, opacity: 0, delay: 1.5, ease: 'sine.out', onComplete: () => {
                setLoadedImages(true)
            }})
        })

        imgLoad.on( 'progress', () => {
            progress ++
            const percentage = (progress / photos.length)
            
            // if(Math.ceil(percentage) > textRef.current.children[currentChild].innerText) {
            //     gsap.to(textRef.current, { y: -(currentChild +1) *20, ease: 'sine.inOut' })
            //     currentChild ++
            // }            

            gsap.to(textRef.current, { scaleX: percentage, ease: 'sine.inOut' })
        })
          
    }, [])

    return loadedImages ? children : createPortal(
        <div className='loading-screen'>
            {/* <div className="line-wrapper">
                <svg className="line line-slide" width="300%" height="100%" viewBox="0 0 1200 60" preserveAspectRatio="none">
                    <path d="M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0"></path>
                </svg>
            </div> */}
            {/* <h1 ref={textRef} className='loading-text'>JR</h1> */}
            {/* <div className='text-wrapper'>
                <div ref={textRef}>
                    <h1 className='loading-text'>00</h1>
                    <h1 className='loading-text'>23</h1>
                    <h1 className='loading-text'>42</h1>
                    <h1 className='loading-text'>89</h1>
                    <h1 className='loading-text'>100</h1>
                </div>
            </div> */}
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