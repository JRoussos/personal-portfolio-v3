import React from 'react'
import './bubbleLink-styles.scss'

const Arrow = () => (
    <span className='arrow'>
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
            <path d="M11.097 1.404a1 1 0 0 0-1-1h-9a1 1 0 1 0 0 2h8v8a1 1 0 1 0 2 0v-9Zm-9.486 9.9 9.193-9.193L9.39.697.197 9.889l1.414 1.414Z" fill="#000" fillOpacity="0.65"></path>
        </svg>
    </span> 
)

const BubbleLink = ({ children, className, handle, href }) => { 
    return (
        <a className={`bubble ${className}`} title={handle} target="_blank" rel="noopener noreferrer" href={href}>
            <div className='contact-bubble'>
                <div style={{ whiteSpace: 'nowrap' }}>
                    <span>{children}</span>
                    <Arrow/>
                </div>
                <div className='bubble-background'></div>
            </div>
        </a>
    )
}

export default BubbleLink