import React from 'react'
import { Link } from 'react-router-dom'

import { useStore } from '../../../../contexts/store'

import './absolutePosition-styles.scss'

const AbsolutePositions = () => {
    const { socials } = useStore().state

    return (
        <div className='absolute-positions'>
            <div className='header'>
                {/* <Link to={'/'}>█ <span style={{ display: 'inline-block', transform: 'translateX(-3px) skewX(10deg)' }}>▐</span></Link> █ <span>▐</span> */}
                {/* <Link to={'/'}> */}
        
                    {/* <svg id='asterisk-icon' width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.53871 6.4226C4.08271 6.5186 4.73871 6.7586 5.50671 7.1426C4.73871 7.5266 4.08271 7.7666 3.53871 7.8626C2.99471 7.9906 2.41871 8.0706 1.81071 8.1026C1.36271 8.1346 1.02671 8.1826 0.802711 8.2466C0.610711 8.3426 0.450711 8.5346 0.322711 8.8226C0.226711 9.0146 0.178711 9.2066 0.178711 9.3986C0.178711 9.7506 0.290711 10.0706 0.514711 10.3586C0.770711 10.6466 1.05871 10.7906 1.37871 10.7906C1.69871 10.7906 1.93871 10.7266 2.09871 10.5986C2.25871 10.5026 2.45071 10.2946 2.67471 9.9746C3.05871 9.4946 3.44271 9.0786 3.82671 8.7266C4.24271 8.3746 4.81871 7.9746 5.55471 7.5266C5.52271 8.4546 5.44271 9.1746 5.31471 9.6866C5.18671 10.2306 4.99471 10.8386 4.73871 11.5106C4.54671 12.0226 4.45071 12.3586 4.45071 12.5186C4.45071 12.7106 4.49871 12.9026 4.59471 13.0946C4.78671 13.4466 5.18671 13.6226 5.79471 13.6226C6.37071 13.6226 6.77071 13.4626 6.99471 13.1426C7.09071 12.9506 7.13871 12.7746 7.13871 12.6146C7.13871 12.3906 7.02671 12.0226 6.80271 11.5106C6.51471 10.8386 6.29071 10.2146 6.13071 9.6386C6.00271 9.0946 5.92271 8.3746 5.89071 7.4786C6.59471 7.8306 7.17071 8.1826 7.61871 8.5346C8.06671 8.9186 8.51471 9.3826 8.96271 9.9266C9.25071 10.2786 9.49071 10.5346 9.68271 10.6946C9.90671 10.8866 10.1467 10.9826 10.4027 10.9826C10.7227 11.0146 11.0267 10.8706 11.3147 10.5506C11.6027 10.2626 11.7467 9.9426 11.7467 9.5906C11.7467 9.3666 11.6667 9.1746 11.5067 9.0146C11.3467 8.8546 11.1067 8.7266 10.7867 8.6306C10.4987 8.5346 10.1787 8.4546 9.82671 8.3906C9.09071 8.2946 8.45071 8.1666 7.90671 8.0066C7.36271 7.8466 6.73871 7.5586 6.03471 7.1426C6.73871 6.7266 7.36271 6.4386 7.90671 6.2786C8.45071 6.1186 9.09071 5.9906 9.82671 5.8946C10.1787 5.8306 10.4987 5.7506 10.7867 5.6546C11.1067 5.5586 11.3467 5.4306 11.5067 5.2706C11.6667 5.1106 11.7467 4.9186 11.7467 4.6946C11.7467 4.3426 11.6027 4.0226 11.3147 3.7346C11.0267 3.4146 10.7227 3.2706 10.4027 3.3026C10.1467 3.3026 9.90671 3.3986 9.68271 3.5906C9.49071 3.7506 9.25071 4.0066 8.96271 4.3586C8.51471 4.9026 8.06671 5.3666 7.61871 5.7506C7.17071 6.1026 6.59471 6.4546 5.89071 6.8066C5.92271 5.9106 6.00271 5.1906 6.13071 4.6466C6.29071 4.0706 6.51471 3.4466 6.80271 2.7746C7.02671 2.2626 7.13871 1.8946 7.13871 1.6706C7.13871 1.5106 7.09071 1.3346 6.99471 1.1426C6.77071 0.8226 6.37071 0.662598 5.79471 0.662598C5.18671 0.662598 4.78671 0.8386 4.59471 1.1906C4.49871 1.3826 4.45071 1.5746 4.45071 1.7666C4.45071 1.9266 4.54671 2.2626 4.73871 2.7746C4.99471 3.4466 5.18671 4.0546 5.31471 4.5986C5.44271 5.1106 5.52271 5.8306 5.55471 6.7586C4.81871 6.3106 4.24271 5.9106 3.82671 5.5586C3.44271 5.2066 3.05871 4.7906 2.67471 4.3106C2.45071 3.9906 2.25871 3.7826 2.09871 3.6866C1.93871 3.5586 1.69871 3.4946 1.37871 3.4946C1.05871 3.4946 0.770711 3.6386 0.514711 3.9266C0.290711 4.2146 0.178711 4.5346 0.178711 4.8866C0.178711 5.0786 0.226711 5.2706 0.322711 5.4626C0.450711 5.7506 0.610711 5.9426 0.802711 6.0386C1.02671 6.1026 1.36271 6.1506 1.81071 6.1826C2.41871 6.2146 2.99471 6.2946 3.53871 6.4226Z" fill="white" fillOpacity={0.8}/>
                    </svg> */}

                    {/* <svg id='asterisk-icon' width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.176 12.536C3.824 12.664 3.424 12.584 2.976 12.296C2.56 12.008 2.352 11.672 2.352 11.288C2.352 10.904 2.416 10.632 2.544 10.472C2.704 10.312 2.992 10.136 3.408 9.944C3.952 9.624 4.432 9.304 4.848 8.984C5.296 8.632 5.776 8.104 6.288 7.4C5.52 7.016 4.864 6.776 4.32 6.68C3.776 6.552 3.2 6.472 2.592 6.44C2.144 6.408 1.808 6.36 1.584 6.296C1.392 6.2 1.232 6.008 1.104 5.72C1.008 5.528 0.96 5.336 0.96 5.144C0.96 4.792 1.072 4.472 1.296 4.184C1.552 3.896 1.84 3.752 2.16 3.752C2.48 3.752 2.72 3.816 2.88 3.944C3.04 4.04 3.232 4.248 3.456 4.568C3.84 5.048 4.224 5.464 4.608 5.816C5.024 6.168 5.6 6.568 6.336 7.016C6.304 6.088 6.224 5.368 6.096 4.856C5.968 4.312 5.776 3.704 5.52 3.032C5.328 2.52 5.232 2.184 5.232 2.024C5.232 1.832 5.28 1.64 5.376 1.448C5.568 1.096 5.968 0.919998 6.576 0.919998C7.152 0.919998 7.552 1.08 7.776 1.4C7.872 1.592 7.92 1.768 7.92 1.928C7.92 2.152 7.808 2.52 7.584 3.032C7.296 3.704 7.072 4.328 6.912 4.904C6.784 5.448 6.704 6.168 6.672 7.064C7.376 6.712 7.952 6.36 8.4 6.008C8.848 5.624 9.296 5.16 9.744 4.616C10.032 4.264 10.272 4.008 10.464 3.848C10.688 3.656 10.928 3.56 11.184 3.56C11.504 3.528 11.808 3.672 12.096 3.992C12.384 4.28 12.528 4.6 12.528 4.952C12.528 5.176 12.448 5.368 12.288 5.528C12.128 5.688 11.888 5.816 11.568 5.912C11.28 6.008 10.96 6.088 10.608 6.152C9.872 6.248 9.232 6.376 8.688 6.536C8.144 6.696 7.52 6.984 6.816 7.4C7.872 8.52 8.96 9.304 10.08 9.752C10.432 9.88 10.688 10.008 10.848 10.136C11.008 10.264 11.136 10.456 11.232 10.712C11.328 10.968 11.28 11.256 11.088 11.576C10.928 11.896 10.688 12.152 10.368 12.344C10.048 12.536 9.76 12.568 9.504 12.44C9.248 12.344 9.072 12.216 8.976 12.056C8.88 11.864 8.752 11.56 8.592 11.144C8.432 10.6 8.208 10.056 7.92 9.512C7.632 8.968 7.168 8.344 6.528 7.64C6.048 8.344 5.712 8.968 5.52 9.512C5.328 10.024 5.184 10.568 5.088 11.144C5.024 11.592 4.944 11.912 4.848 12.104C4.752 12.296 4.528 12.44 4.176 12.536Z" fill="#fff" fillOpacity="0.8"></path>
                    </svg> */}
                {/* </Link> █ <span>▐</span> */}
                <Link to={'/about'}>
                    <span className='underline line-hover'>ABOUT</span>
                </Link>
            </div>
            <div className='footer'>
                {/* <svg id='asterisk-icon' width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.176 12.536C3.824 12.664 3.424 12.584 2.976 12.296C2.56 12.008 2.352 11.672 2.352 11.288C2.352 10.904 2.416 10.632 2.544 10.472C2.704 10.312 2.992 10.136 3.408 9.944C3.952 9.624 4.432 9.304 4.848 8.984C5.296 8.632 5.776 8.104 6.288 7.4C5.52 7.016 4.864 6.776 4.32 6.68C3.776 6.552 3.2 6.472 2.592 6.44C2.144 6.408 1.808 6.36 1.584 6.296C1.392 6.2 1.232 6.008 1.104 5.72C1.008 5.528 0.96 5.336 0.96 5.144C0.96 4.792 1.072 4.472 1.296 4.184C1.552 3.896 1.84 3.752 2.16 3.752C2.48 3.752 2.72 3.816 2.88 3.944C3.04 4.04 3.232 4.248 3.456 4.568C3.84 5.048 4.224 5.464 4.608 5.816C5.024 6.168 5.6 6.568 6.336 7.016C6.304 6.088 6.224 5.368 6.096 4.856C5.968 4.312 5.776 3.704 5.52 3.032C5.328 2.52 5.232 2.184 5.232 2.024C5.232 1.832 5.28 1.64 5.376 1.448C5.568 1.096 5.968 0.919998 6.576 0.919998C7.152 0.919998 7.552 1.08 7.776 1.4C7.872 1.592 7.92 1.768 7.92 1.928C7.92 2.152 7.808 2.52 7.584 3.032C7.296 3.704 7.072 4.328 6.912 4.904C6.784 5.448 6.704 6.168 6.672 7.064C7.376 6.712 7.952 6.36 8.4 6.008C8.848 5.624 9.296 5.16 9.744 4.616C10.032 4.264 10.272 4.008 10.464 3.848C10.688 3.656 10.928 3.56 11.184 3.56C11.504 3.528 11.808 3.672 12.096 3.992C12.384 4.28 12.528 4.6 12.528 4.952C12.528 5.176 12.448 5.368 12.288 5.528C12.128 5.688 11.888 5.816 11.568 5.912C11.28 6.008 10.96 6.088 10.608 6.152C9.872 6.248 9.232 6.376 8.688 6.536C8.144 6.696 7.52 6.984 6.816 7.4C7.872 8.52 8.96 9.304 10.08 9.752C10.432 9.88 10.688 10.008 10.848 10.136C11.008 10.264 11.136 10.456 11.232 10.712C11.328 10.968 11.28 11.256 11.088 11.576C10.928 11.896 10.688 12.152 10.368 12.344C10.048 12.536 9.76 12.568 9.504 12.44C9.248 12.344 9.072 12.216 8.976 12.056C8.88 11.864 8.752 11.56 8.592 11.144C8.432 10.6 8.208 10.056 7.92 9.512C7.632 8.968 7.168 8.344 6.528 7.64C6.048 8.344 5.712 8.968 5.52 9.512C5.328 10.024 5.184 10.568 5.088 11.144C5.024 11.592 4.944 11.912 4.848 12.104C4.752 12.296 4.528 12.44 4.176 12.536Z" fill="#fff" fillOpacity="0.8"></path>
                </svg> */}
                <div className='copyright'>
                    <p>© {new Date().getFullYear()}</p> {/**, <a target="_blank" rel="noopener noreferrer" href="/">JR</a> */}
                </div>
                <div className='socials'>
                    <p>{socials.map(social => <a key={social.name} className='underline line-hover' target="_blank" rel="noopener noreferrer" href={social.url}>{social.name}</a>)}</p>
                </div>
            </div>
        </div>
    )
}

export default AbsolutePositions