import React, { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import BubbleLink from '@components/bubbleLink/bubbleLink'
import Layout from '@components/layout/layout'

import profile from '@assets/imgs/myself-edit.jpg'
import '@styles/pages/_about.scss'

import { SOCIALS } from '@contexts/data'

const SEO = {
    title: 'About — John Roussos',
    description: 'I\'m John, a creative developer focusing on motion and refined digital experiences, based in Greece.',
    image: profile,
}

const DATA = {
    eyebrow: 'ABOUT',
    color: '#f5f2f2',
}

const CONTENT = {
    title: 'I’M JOHN',
    text: 'Creative developer focusing on<br />motion and visually appealing web experiences.',
    description: 'I\'m a pretty outdoorsy guy who loves working out and being outside. Adventures like mountain climbing and discovering new places are some of my favorite things. I\'m also someone who\'s naturally curious about how things work. I love learning about science, technology, and the world around us. There\'s something inherently thrilling about discovering how things work.',
}

const About = () => {
    return (
        <Layout {...SEO} {...DATA}>
            <div className='about'>
                <div className='about__content'>
                    <div className='about__content__left'>
                        <div className='about__info-container'>
                            <div className='about__paragraph'>
                                <h1 className='about__title'>
                                    {CONTENT.title}
                                </h1>
                            </div>
                            <div className='about__paragraph'>
                                <p className='about__text'>
                                    <span dangerouslySetInnerHTML={{ __html: CONTENT.text }} />
                                </p>
                            </div>
                            <div className='about__paragraph'>
                                <p className='about__text'>
                                    {CONTENT.description}
                                </p>
                            </div>
                            <div className='about__paragraph'>
                                <div className='about__contact'>
                                    {Object.values(SOCIALS).map(profile => (
                                        <BubbleLink 
                                            key={profile.name} 
                                            title={profile.handle} 
                                            href={profile.url} >{profile.title}</BubbleLink>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='about__content__right'>
                        <div className='about__image-container'>
                            <img className='about__image' src={profile} alt='profile' />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default About