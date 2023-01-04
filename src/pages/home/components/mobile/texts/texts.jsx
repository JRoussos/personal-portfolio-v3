import React, { useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import AbsolutePositions from '../../overlay/absolutePositions'

import './texts-styles.scss'

const Texts = () => {
    const textsRef = useRef()

    useLayoutEffect(() => {
        textsRef.current.style.bottom = `${window.innerHeight}px`
    }, [])

    return createPortal(
        <div ref={textsRef} className="texts-titles fadeIn">
            <AbsolutePositions/>
        </div>, document.getElementById('root')
    )
}

export default Texts