import React from 'react'
import { Link, useParams } from 'react-router-dom'

import Marquee from '@components/marquee/marquee'
import BubbleLink from '@components/bubbleLink/bubbleLink'
import Layout from '@components/layout/layout'

import NotFound from '@pages/notFound/notFound'
import { PROJECTS } from '@contexts/data'

import '@styles/pages/_project.scss'

const Project = () => {
    const { name } = useParams()
    const PROJECT_DATA = PROJECTS[name] || null

    if (!PROJECT_DATA) {
        return <NotFound />
    }

    const SEO = {
        title: PROJECT_DATA.fullname + ' — John Roussos',
        description: PROJECT_DATA.desc,
        image: PROJECT_DATA.media.picture,
    }

    const DATA = {
        eyebrow: PROJECT_DATA.index.toLocaleString(undefined, { minimumIntegerDigits: 2 }) + '.',
        color: '#f5f2f2',
    }

    return (
        <Layout {...SEO} {...DATA}>
            <div className='project'>
                <div className='project__text-grid'>
                    {PROJECT_DATA.info.map( text => (
                        <div key={text.charAt(0)} className='project__text-grid__item'>
                            <p className='project__text'>{text}</p>
                        </div>
                    ))}
                </div>
        
                <div className='project__links'>
                    <ul className='project__links__list'>
                        {PROJECT_DATA.links.map(link => (
                            <li key={link.title} className='project__link'>
                                <BubbleLink key={link.title} href={link.url}>{link.title}</BubbleLink>
                            </li>
                        ))}
                    </ul>
                </div>

                <Marquee text={PROJECT_DATA.fullname} />
                
                <div className='project__image-grid'>
                    <div className='project__image-grid__row'>
                        <img 
                            src={PROJECT_DATA.media.picture} 
                            alt={`${PROJECT_DATA.fullname} cover`} 
                            className='project__image-grid__item__image'
                        />
                    </div>
                    {PROJECT_DATA.layout.map((row, rowIndex) => (
                        <div 
                            key={rowIndex} 
                            className='project__image-grid__column'
                        >
                            {row.map((column, columnIndex) => (
                                <div 
                                    key={column.src} 
                                    className='project__image-grid__item' 
                                    style={{width: column.percentage, aspectRatio: column.aspect}}
                                >
                                    {column.type === 'video' 
                                        ? <video 
                                                src={column.src} 
                                                autoPlay 
                                                muted 
                                                loop 
                                                playsInline 
                                                aria-label={`${PROJECT_DATA.fullname} preview video ${columnIndex + 1}`}
                                                className='project__image-grid__item__video'
                                            />
                                        : <img 
                                                src={column.src} 
                                                alt={`${PROJECT_DATA.fullname} screenshot ${columnIndex + 1}`} 
                                                className='project__image-grid__item__image'
                                            />
                                    }
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className='project__footer'>
                    <div className='project__footer__content'>
                        <Link 
                            to={`/project/${PROJECTS[PROJECT_DATA.next].path}`} 
                            state={{ skipTransition: true }} 
                            className="project__footer__next-link"
                        >
                            <p className='project__footer__next-link__text'>
                                Next Project: 
                                <span className='project__footer__next-link__project-name'>
                                    {PROJECTS[PROJECT_DATA.next].name}
                                </span>
                                <span className='project__footer__next-link__arrow'>
                                    <svg className='project__footer__next-link__arrow__icon' fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
                                        <path d="M11.097 1.404a1 1 0 0 0-1-1h-9a1 1 0 1 0 0 2h8v8a1 1 0 1 0 2 0v-9Zm-9.486 9.9 9.193-9.193L9.39.697.197 9.889l1.414 1.414Z" fill="currentColor"></path>
                                    </svg>
                                </span>
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Project
