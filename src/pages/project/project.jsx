import React, { useLayoutEffect, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'

import Topper from '../../components/topper/topper'
import BackBtn from '../../components/backBtn/backBtn'
import Marquee from '../../components/marquee/marquee'
import BubbleLink from '../../components/bubbleLink/bubbleLink'

import HelmetTags from '../../components/helmetTags/helmetTags' 

import data from '../../contexts/data'

import './project-style.scss'

const Project = () => {
    const containerRef = useRef()
    const projectRef   = useRef()

    const { id }       = useParams()

    const index     = useRef(data.findIndex(_ => _.path === id))
    const next      = useRef((index.current + 1) %data.length)
    const project   = useRef(data[index.current])
    
    useLayoutEffect(() => { 
        document.body.style.background = '#f5f2f2' 
    }, [])

    useEffect(() => {
        const { height } = projectRef.current.getBoundingClientRect()

        if ( height > window.innerHeight )
            document.getElementById('root').style.height = `${ height }px`
    }, [projectRef])

    useEffect(() => {
        const setContainerPosition = () => {        
            const { x } = containerRef.current.getBoundingClientRect()
            containerRef.current.children[0].style.transform = `translate3d(-${Math.abs(x)}px, 0, 0)`
        }

        setContainerPosition()

        window.addEventListener('resize', setContainerPosition)
        return () => window.removeEventListener('resize', setContainerPosition)
    }, [])

    return (
        <Topper>
            <div className='project' ref={projectRef}>
                <HelmetTags 
                    title={`${project.current.fullname} — John Roussos`} 
                    description={project.current.desc} 
                    image={project.current.media.picture}
                />
                <div className='header'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>{(index.current + 1).toLocaleString(undefined, { minimumIntegerDigits: 2 })}.</span>
                    </div>
                    <Link to={'/'} replace style={{ margin: '0 -10px 0 0'}}>
                        <BackBtn/>
                    </Link>
                </div>
                <div className='horizontal-line'></div>
                <div className='grid'>
                    <div className='no-links'>
                        {project.current.info.map( text => (
                            <div key={text.charAt(0)} className='title-description'>
                                <p>{text}</p>
                            </div>
                        ))}
                    </div>
                    <div className='title-description' >
                        <div className='links'>
                            {project.current.links.map(link => (
                                <BubbleLink key={link.title} href={link.url}>{link.title}</BubbleLink>
                                // <RollingText key={link.title} href={link.url}>{link.title}</RollingText>
                            ))}
                        </div>
                    </div>
                </div>
                <div ref={containerRef} className="shadow-offset">
                    <div className="offset-container">
                        <Marquee text={project.current.fullname}/>
                    </div>
                </div>
                <div className='grid-images'>
                    <div className='image-layout'>
                        <img src={project.current.media.picture} />
                    </div>
                    {project.current.layout.map( (layout, index) => (
                        <div key={index} className='image-layout'>
                            {layout.map( horizontal => {
                                if(horizontal.image.slice(-1) === '4')
                                    return <div className='video-container'><video src={horizontal.image} key={horizontal.image} autoPlay muted loop playsInline/></div>
                                else 
                                    return <img src={horizontal.image} key={horizontal.image} style={{width: horizontal.percentage, aspectRatio: horizontal.aspect}} /> 
                            })}
                        </div>
                    ))}
                </div>
                <div className='footer'>
                    <div className='footer-wrapper'>
                        <Link to={`/project/${data[next.current].path}`} state={{ visible: false }} className="subtitle-wrapper">
                            <p>Next Project:<span style={{ marginLeft: '6px', textDecoration: 'underline' }}>{data[next.current].name}</span>
                            <span className='arrow'>
                                <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
                                    <path d="M11.097 1.404a1 1 0 0 0-1-1h-9a1 1 0 1 0 0 2h8v8a1 1 0 1 0 2 0v-9Zm-9.486 9.9 9.193-9.193L9.39.697.197 9.889l1.414 1.414Z" fill="#000" fillOpacity="0.65"></path>
                                </svg>
                            </span></p>
                        </Link>
                    </div>
                </div>
            </div>
        </Topper>
    )
}

export default Project