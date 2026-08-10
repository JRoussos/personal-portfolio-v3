import { Link } from 'react-router-dom'
import '@styles/components/_back_button.scss'

const BackBtn = (props) => {
    return (
        <Link to={'/'} replace aria-label="Back to home" {...props}>
            <div className='back-btn'>
                <div className='back-btn__container'> 
                    <span className='back-btn__cross'></span>
                    <span className='back-btn__cross'></span>
                </div>
            </div>
        </Link>
    )
}

export default BackBtn