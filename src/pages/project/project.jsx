import React, { useLayoutEffect, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'

import Topper from '../../components/topper/topper'
import BackBtn from '../../components/backBtn/backBtn'
import Marquee from '../../components/marquee/marquee'
import BubbleLink from '../../components/bubbleLink/bubbleLink'
import HelmetTags from '../../components/helmetTags/helmetTags'
import NotFound from '../notFound/notFound'

import data from '../../contexts/data'

import './project-style.scss'

const ProjectView = ({ index }) => {
    const containerRef = useRef()
    const projectRef = useRef()

    const next = (index + 1) % data.length
    const project = data[index]

    useLayoutEffect(() => {
        document.body.style.background = '#f5f2f2'
    }, [])

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
                    title={`${project.fullname} — John Roussos`}
                    description={project.desc}
                    image={project.media.picture}
                />
                <div className='header'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>{(index + 1).toLocaleString(undefined, { minimumIntegerDigits: 2 })}.</span>
                    </div>
                    <Link to={'/'} replace aria-label="Back to home" style={{ margin: '0 -10px 0 0'}}>
                        <BackBtn/>
                    </Link>
                </div>
                <div className='horizontal-line'></div>
                <div className='grid'>
                    <div className='no-links'>
                        {project.info.map( text => (
                            <div key={text.charAt(0)} className='title-description'>
                                <p>{text}</p>
                            </div>
                        ))}
                    </div>
                    <div className='title-description' >
                        <div className='links'>
                            {project.links.map(link => (
                                <BubbleLink key={link.title} href={link.url}>{link.title}</BubbleLink>
                            ))}
                        </div>
                    </div>
                </div>
                <div ref={containerRef} className="shadow-offset">
                    <div className="offset-container">
                        <Marquee text={project.fullname}/>
                    </div>
                </div>
                <div className='grid-images'>
                    <div className='image-layout'>
                        <img src={project.media.picture} alt={`${project.fullname} cover`} />
                    </div>
                    {project.layout.map( (layout, layoutIndex) => (
                        <div key={layoutIndex} className='image-layout'>
                            {layout.map( (horizontal, i) => {
                                if(horizontal.image.slice(-1) === '4')
                                    return <div className='video-container' key={horizontal.image}><video src={horizontal.image} autoPlay muted loop playsInline aria-label={`${project.fullname} preview video ${i + 1}`}/></div>
                                else
                                    return <img src={horizontal.image} key={horizontal.image} alt={`${project.fullname} screenshot ${i + 1}`} style={{width: horizontal.percentage, aspectRatio: horizontal.aspect}} />
                            })}
                        </div>
                    ))}
                </div>
                <div className='footer'>
                    <div className='footer-wrapper'>
                        <Link to={`/project/${data[next].path}`} state={{ visible: false }} className="subtitle-wrapper">
                            <p>Next Project:<span style={{ marginLeft: '6px', textDecoration: 'underline' }}>{data[next].name}</span>
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

const Project = () => {
    const { id } = useParams()
    const index = data.findIndex(project => project.path === id)

    if (index === -1) return <NotFound />

    return <ProjectView index={index} />
}

export default Project
