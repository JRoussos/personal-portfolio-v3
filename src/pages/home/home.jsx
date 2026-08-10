import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import loadable from '@loadable/component'
import clsx from 'clsx'

import Layout from '@components/layout/layout'
import thumbnail from '@assets/imgs/thumbnail.jpg'

import { SOCIALS } from '@contexts/data'
import { useStore } from '@contexts/store'

import { SASS_VARIABLES } from '@utils/sass-variables'
import usePrefersReducedMotion from '@hooks/usePrefersReducedMotion'

import '@styles/pages/_home.scss'

const Projects = loadable(() => import('@pages/home/projects/projects'))
const Reduced = loadable(() => import('@pages/home/reduced/reduced'))

const DATA = {
    title: 'John Roussos',
    links: [
        {
            name: 'About',
            url: '/about',
        }
    ],
}

const { 
    gm: _email, 
    ...socialLinks 
} = SOCIALS

const Home = () => {
    const { canvasReady } = useStore().state
    const reducedMotion = usePrefersReducedMotion()

    return (
        <Layout
            title={'John Roussos — Developer'}
            description={'Creative developer focusing on motion and visually appealing web experiences based in Greece.'}
            image={thumbnail}
            color={SASS_VARIABLES.BACKGROUND_DARK}
        >
            <div className={
                clsx({ 'home': true, 'fadeIn': canvasReady })
            }>
                <header className='home__header'>
                    <h1 className='home__header__title'>
                        {DATA.title}
                    </h1>
                    <div className='home__header__links'>
                        {DATA.links.map(link => (
                            <Link
                                key={link.name}
                                to={link.url}
                                className='home__header__link underline underline--hover'
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </header>

                {reducedMotion 
                    ? <Reduced /> 
                    : <Projects />
                }

                <footer className='home__footer'>
                    <div className='home__copyright'>
                        <p className='home__footer__copyright'>© {new Date().getFullYear()}</p> 
                    </div>
                    <div className='socials'>
                        <p className='home__footer__socials'>
                            {
                                Object.values(socialLinks).map(social => (
                                    <a 
                                        key={social.name} 
                                        className='home__footer__social underline underline--hover' 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        title={social.title} 
                                        href={social.url}
                                    >
                                        {social.name}
                                    </a>
                                ))
                            }
                        </p>
                    </div>
                </footer>
            </div>
        </Layout>
    )
}

export default Home

