import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'

import { SASS_VARIABLES } from '@utils/sass-variables'

import '@styles/theme/_route_transition.scss'

const Transition = ({ path }) => {
    const pathRef = useRef(null)
    const svgRef  = useRef(null)
    
    const color = path === '/' 
        ? SASS_VARIABLES.BACKGROUND_DARK 
        : SASS_VARIABLES.BACKGROUND_WHITE;

    useEffect(() => {
        const pathEl = pathRef.current
        const svgEl  = svgRef.current

        if (!pathEl || !svgEl) return

        // Promote a compositor layer so Safari repaints path `d` updates.
        gsap.set(svgEl, {force3D: true})

        const scale = value => Math.max((value - 1) / 1.5 * 40, 0)
        const aspect = window.innerHeight / window.innerWidth

        const tl = gsap.timeline()
            .to(pathEl, {
                duration: 0.6,
                attr: { d: `M 0 100 V 50 Q 50 ${scale(aspect)} 100 50 V 100 z` },
                ease: 'power3.in',
            })
            .to(pathEl, {
                duration: 0.4,
                attr: { d: 'M 0 100 V 0 Q 50 0 100 0 V 100 z' },
                ease: 'power2.out',
            })

        return () => {
            tl.kill()
        }
    }, [])
    
    return createPortal(
      <div className='route-transition' aria-hidden='true'>
            <svg
                ref={svgRef}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className='route-transition__svg'
            >
                <path ref={pathRef} d="M 0 100 V 100 Q 50 100 100 100 V 100 z" className='route-transition__path' fill={ color }/>
            </svg>
      </div>, document.body
    )
}

export default Transition
