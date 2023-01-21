import React, { useLayoutEffect, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

import Topper from '../../components/topper/topper'
import BackBtn from '../../components/backBtn/backBtn'
import BubbleLink from '../../components/bubbleLink/bubbleLink'

import { useStore } from '../../contexts/store'
import useWindowSize from '../../hooks/useWindowSize'

import profile from '../../assets/imgs/myself.jpg'
import './about-style.scss'

// const Email = ({ mail }) => {
//     const [ useDefault, setDefault ] = useState(false)

//     const handleMailClick = () => {
//         navigator.clipboard.writeText(mail)
//             .then(() => pRef.current.innerText = 'Mail copied')
//             .catch(() => setDefault(true))
//     }

//     return isMobile || useDefault ? 
//         <a className='mail-container' href={`mailto:${mail}`}>{mail}</a> :
//         <div className='mail-container' onClick={handleMailClick} onTransitionEnd={() => {pRef.current.innerText = 'Copy?'}}>
//             <div>
//                 <p>Email</p>
//                 <p ref={pRef}>Copy?</p>
//             </div>
//         </div>
// }

const About = () => {
    const { socials, email } = useStore().state
    const { width } = useWindowSize()
    
    const aboutRef = useRef()

    const mail = { name: 'mail', handle: email, url: `mailto:${email}`, title: 'Mail' }

    // const texts = [
    //     "I’M JOHN",
    //     "Creative developer focusing on",
    //     "motion and refined digital experiences.",
    //     "I'm a pretty outdoorsy guy who loves working out and being outside. Adventures, like mountain climbing and discovering new places, are some of my favorite. I'm also really interested in space and how it works. Wormholes, black holes, and supernovae all fascinate me. There's something inherently thrilling about discovering how things work."
    // ]

    // const wrapText = string => {
    //     const wordsArray = string.split(" ")
    //     const linesArray = []

    //     const  maxLineWidth = Math.min( 475, window.innerWidth - window.innerWidth * 0.08 )

    //     const canvas = document.createElement('canvas')
    //     const ctx = canvas.getContext('2d')
    //     ctx.font = '14px Rubik'

    //     let line = ''
    //     let testLine = ''

    //     wordsArray.forEach((word, index) => {
    //         testLine += `${word} `
    //         const { width } = ctx.measureText(testLine)

    //         if( Math.ceil(width) > maxLineWidth) {
    //             linesArray.push(line)
    //             line = testLine = `${word} `
    //         }else {
    //             line += `${word} `
    //         }

    //         if(index === wordsArray.length -1) {
    //             linesArray.push(line)
    //         }
    //     })

    //     return linesArray
    // }

    // const head = ['I', "’", 'M', '\u00A0', 'J', 'O', 'H', 'N']

    useLayoutEffect(() => {
        document.body.style.background = '#f5f2f2'

        // gsap.timeline()
            // .to('.word-span', { duration: 0.4, delay: 0.45, y: 0, ease: 'expo.out', stagger: 0.014 })
            // .to('img', { duration: 0.8, objectPosition: '0 100%', ease: 'expo.out'}, '-=0.4')

    }, [])

    useEffect(() => {
        const { height } = aboutRef.current.getBoundingClientRect()

        if ( height < window.innerHeight ) return
            document.getElementById('root').style.height = `${ height }px`
    }, [aboutRef])
    
    return (
        <Topper>
            <div ref={aboutRef} className='about'>
                <Helmet>
                    <title>About — John Roussos</title>
                </Helmet>
                <div className='title-wrapper'>
                    <h1>About</h1>
                    <Link to={'/'} replace>
                        <BackBtn/>
                    </Link>
                </div>
                <div className='horizontal-line'></div>
                <div className='pre-grid'>
                    <div className='grid'>
                        <div style={{ width: 'inherit' }}>
                            <div className='paragraph-wrapper'>
                                <h1>I’M JOHN</h1>
                            </div>
                            <div className='paragraph-wrapper'>
                                <p>Creative developer focusing on<br/> {/* <p>{ texts[0].split(' ').map(char => <span className='word-span' key={Math.random()}>{char + '\u00A0'}</span>) }<br/> */}
                                motion and visually appealing web experiences.</p>
                            </div>
                            <div className='paragraph-wrapper'>
                                <p>I'm a pretty outdoorsy guy who loves working out and being outside. Adventures, like mountain climbing and discovering new places, are some of my favorite. I'm also really interested in space and how it works. Wormholes, black holes, and supernovae all fascinate me. There's something inherently thrilling about discovering how things work.</p>
                            </div>
                            <div className='paragraph-wrapper'>
                                <div className='contact-wrapper'>
                                    <div className='flex-container'> 
                                        {[mail, ...socials].map( profile => (
                                            <BubbleLink key={profile.name} handle={profile.handle} href={profile.url}>{profile.title}</BubbleLink>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='grid'>
                        <div className='image-container'>
                            <img src={profile} alt='profile' style={{ aspectRatio: Math.min(Math.max(((width-400)*1.3)/1100 + 1, 1), 2.3) }}/>
                        </div>
                    </div>
                </div>
            </div>
        </Topper>
    )
}

export default About