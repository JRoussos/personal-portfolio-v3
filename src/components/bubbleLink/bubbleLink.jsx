import { Link } from 'react-router-dom'
import { clsx } from 'clsx'

import '@styles/components/_bubble_link.scss'

const Arrow = () => (
    <span className='bubble__arrow'>
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
            <path d="M11.097 1.404a1 1 0 0 0-1-1h-9a1 1 0 1 0 0 2h8v8a1 1 0 1 0 2 0v-9Zm-9.486 9.9 9.193-9.193L9.39.697.197 9.889l1.414 1.414Z" fill="currentColor" fillOpacity="0.65"></path>
        </svg>
    </span>
)

const BubbleContent = ({ children }) => (
    <div className='bubble__content'>
        <span className='bubble__text'>{children}</span>
        <Arrow />
    </div>
)

const BubbleLink = ({ children, className, to, ...props }) => {
    const Component = to 
        ? Link 
        : 'a';

    return (
        <Component className={clsx('bubble', className)} to={to} {...props}>
            <BubbleContent>{children}</BubbleContent>
        </Component>
    )
}

export default BubbleLink
