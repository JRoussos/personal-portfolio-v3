import React, { useLayoutEffect, useRef } from 'react'

import Layout from '@components/layout/layout'
import BubbleLink from '@components/bubbleLink/bubbleLink'

import { PROJECTS } from '@contexts/data'
import desert from '@assets/imgs/desert.jpg'

import '@styles/pages/_not_found.scss'

const GET_RANDOM_PROJECT = () => {
    return PROJECTS[Math.floor(Math.random() * PROJECTS.length)]
}

const SEO = {
    title: '404 — John Roussos',
    description: 'This page seems to have gotten lost. The link you followed may be broken or the page may have been moved.',
    image: desert,
}

const DATA = {
    eyebrow: '404',
    color: '#f5f2f2',
}

const CONTENT = {
    title: '404',
    text: 'This page seems to have gotten lost.',
    description: 'The link you followed may be broken or the page may have been moved. You can go back to the homepage or check out this project that I made.',
}

const NotFound = () => {
    return (
        <Layout {...SEO} {...DATA}>
            <div className='not-found'>
                <div className='not-found__content'>
                    <div className='not-found__content__left'>
                        <div className='not-found__info-container'>
                            <div className='not-found__paragraph'>
                                <h1 className='not-found__title'>
                                    {CONTENT.title}
                                </h1>
                            </div>
                            <div className='not-found__paragraph'>
                                <p className='not-found__text'>
                                    {CONTENT.text}
                                </p>
                            </div>
                            <div className='not-found__paragraph'>
                                <p className='not-found__text'>
                                    {CONTENT.description}
                                </p>
                            </div>
                            <div className='not-found__paragraph'>
                                <div className='not-found__links'>
                                    <BubbleLink to='/'>
                                        Home
                                    </BubbleLink>
                                    <BubbleLink to={`/project/${GET_RANDOM_PROJECT().path}`}>
                                        Check this project
                                    </BubbleLink>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='not-found__content__right'>
                        <div className='not-found__image-container'>
                            <img className='not-found__image' src={desert} alt='desert landscape' />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default NotFound
