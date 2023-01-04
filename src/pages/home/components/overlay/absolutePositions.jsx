import React from 'react'
import { Link } from 'react-router-dom'

import './absolutePosition-styles.scss'

const AbsolutePositions = () => {
    return (
        <div className='absolute-positions'>
            <div className='header'>
                {/* <Link to={'/'}>█ <span style={{ display: 'inline-block', transform: 'translateX(-3px) skewX(10deg)' }}>▐</span></Link> █ <span>▐</span> */}
                <Link to={'/'}>J.</Link> {/* █ <span>▐</span> */}
                <Link to={'/about'}>
                    <span>About</span>
                </Link>
            </div>
            <div className='copyright'>
                {/* socials {new Date().getFullYear()} */}
                {/* <p>© 2022</p> */}
                <p>© 2022, <a target="_blank" rel="noopener noreferrer" href="/">JR</a></p>
            </div>
        </div>
    )
}

export default AbsolutePositions