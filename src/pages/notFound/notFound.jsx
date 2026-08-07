import React, { useLayoutEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Topper from '../../components/topper/topper'
import BackBtn from '../../components/backBtn/backBtn'
import BubbleLink from '../../components/bubbleLink/bubbleLink'
import HelmetTags from '../../components/helmetTags/helmetTags'

import useWindowSize from '../../hooks/useWindowSize'
import data from '../../contexts/data'

import desert from '../../assets/imgs/desert.jpg'
import '../about/about-style.scss'
import './notFound-style.scss'

const getRandomProjectPath = () => {
    const project = data[Math.floor(Math.random() * data.length)]
    return `/project/${project.path}`
}

const NotFound = () => {
    const { width } = useWindowSize()
    const navigate = useNavigate()
    const pageRef = useRef()

    useLayoutEffect(() => {
        document.body.style.background = '#f5f2f2'
    }, [])

    const handleRandomProject = (e) => {
        e.preventDefault()
        navigate(getRandomProjectPath())
    }

    return (
        <Topper>
            <div ref={pageRef} className='about not-found'>
                <HelmetTags
                    title={'404 — John Roussos'}
                    description={'This page seems to have gotten lost. The link you followed may be broken or the page may have been moved.'}
                    image={desert}
                />
                <div className='title-wrapper'>
                    <h1>404</h1>
                    <Link to={'/'} replace aria-label="Back to home">
                        <BackBtn/>
                    </Link>
                </div>
                <div className='horizontal-line'></div>
                <div className='pre-grid'>
                    <div className='grid'>
                        <div style={{ width: 'inherit' }}>
                            <div className='paragraph-wrapper'>
                                <h1>404</h1>
                            </div>
                            <div className='paragraph-wrapper'>
                                <p>This page seems to have gotten lost.</p>
                            </div>
                            <div className='paragraph-wrapper'>
                                <p>The link you followed may be broken or the page may have been moved. You can go back to the homepage or check out this project that I made.</p>
                            </div>
                            <div className='paragraph-wrapper'>
                                <div className='contact-wrapper'>
                                    <div className='flex-container'>
                                        <BubbleLink to='/'>Home</BubbleLink>
                                        <BubbleLink to={getRandomProjectPath()} onClick={handleRandomProject}>
                                            Check this project
                                        </BubbleLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='grid'>
                        <div className='image-container'>
                            <img src={desert} alt='desert landscape' style={{ aspectRatio: Math.min(Math.max(((width-400)*1.3)/1100 + 1, 1), 2.3) }}/>
                        </div>
                    </div>
                </div>
            </div>
        </Topper>
    )
}

export default NotFound
