import React, { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { useStore } from '@contexts/store'
import { PROJECTS } from '@contexts/data'

import '@styles/components/_reduced.scss'

const Reduced = () => {
    const { dispatch } = useStore()

    // Reversed so list order matches the canvas scroll slots (0 = Chaos, …).
    const projects = useMemo(() => {
        return Object.values(PROJECTS).map(project => ({
            path: project.path,
            thumbnail: project.media.picture,
            name: project.name,
        })).reverse()
    }, [])

    useEffect(() => {
        dispatch({ type: 'CHANGE_CANVAS_LOADED', canvasReady: true })
    }, [dispatch])

    return (
        <div className='reduced'>
            {/* data-lenis-prevent: keep wheel/touch on this nested scroller */}
            <div className='reduced__content' data-lenis-prevent>
                <nav className='reduced__navigation' aria-label='Projects'>
                    <ul className='reduced__navigation__list'>
                        {projects.map(project => (
                            <li key={project.name} className='reduced__navigation__item'>
                                <Link
                                    className='reduced__navigation__link'
                                    to={`/project/${project.path}`}
                                >
                                    <article className='reduced__project'>
                                        <div className='reduced__project__media'>
                                            <img
                                                className='reduced__project__image'
                                                src={project.thumbnail}
                                                alt=''
                                                draggable={false}
                                            />
                                        </div>
                                        <h2 className='reduced__project__title italiana'>
                                            {project.name}
                                        </h2>
                                    </article>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Reduced
