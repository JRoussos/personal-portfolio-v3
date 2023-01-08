import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'

import { useLocation } from 'react-router-dom'

import './transition_style.scss'

const Transition = ({ path }) => {
    const pathRef = useRef()
    const location = useLocation()
    
    const color = path === '/' ? '#090909' : '#f5f2f2'

    useEffect(() => {
        const scale = value => Math.max((value - 1) / 1.5 * 40, 0)
        const aspect = window.innerHeight /window.innerWidth

        location.state || gsap.timeline()
            .to(pathRef.current, { duration: 0.8, attr: { d: `M 0 100 V 50 Q 50 ${scale(aspect)} 100 50 V 100 z` }, ease: 'power2.in'})
            .to(pathRef.current, { duration: 0.4, attr: { d: "M 0 100 V 0  Q 50 0 100 0  V 100 z" }, ease: 'power2.out'})
                
    }, [])
    
    return createPortal(
      <div className='transition'>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                <path ref={pathRef} d="M 0 100 V 100 Q 50 100 100 100 V 100 z" fill={ color }/>
            </svg>
      </div>, document.body
    )
}

export default Transition