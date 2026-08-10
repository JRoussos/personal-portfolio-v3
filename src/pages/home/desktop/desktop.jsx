import React, { useCallback, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'

import clsx from 'clsx'

import { useStore } from '@contexts/store'
import { PROJECTS, SOCIALS } from '@contexts/data'

import Projects, {clearScrollTarget, setScrollTarget} from '@/pages/home/projects/projects';

import '@styles/pages/_home.scss'

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

const Desktop = () => {
    const {canvasReady} = useStore().state
    const [focusedPath, setFocusedPath] = useState(null)

    // Reversed so nav/Tab order matches the canvas scroll slots (0 = Chaos, …).
    const projects = useMemo(() => {
        return Object.values(PROJECTS).map(project => ({
            indx: project.index,
            path: project.path,
            name: project.name,
            desc: project.desc,
        })).reverse()
    }, [])

    const handleProjectFocus = useCallback((index, path) => {
        setScrollTarget(index)
        setFocusedPath(path)
    }, [])

    const handleProjectBlur = useCallback(() => {
        // Defer so focus moving to another project link doesn't flash-clear.
        requestAnimationFrame(() => {
            const active = document.activeElement
            if (!active?.closest?.('nav[aria-label="Projects"]')) {
                clearScrollTarget()
                setFocusedPath(null)
            }
        })
    }, [])

    return (
        <div className={
            clsx({'desktop': true, 'fadeIn': canvasReady })
        }>
            <header className='desktop__header'>
                <h1 className='desktop__header__title'>
                    {DATA.title}
                </h1>
                <div className='desktop__header__links'>
                    {DATA.links.map(link => (
                        <Link 
                            key={link.name} 
                            to={link.url} 
                            className='desktop__header__link underline underline--hover'
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </header>

            {/*
              The project titles/links are rendered inside a WebGL canvas for the
              visual experience, which isn't keyboard-focusable. This nav mirrors
              that content as real links: Tab focuses them, and focus scrolls the
              matching 3D tile into view.
            */}
            <nav className='sr-only desktop__navigation' aria-label='Projects'>
                <ul className='desktop__navigation__list'>
                    {projects.map(project => (
                        <li key={project.name} className='desktop__navigation__item'>
                            <Link className='desktop__navigation__link'
                                to={`/project/${project.path}`}
                                onFocus={() => handleProjectFocus(project.indx, project.path)}
                                onBlur={handleProjectBlur}
                            >
                                {project.name} — {project.desc}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {focusedPath && (
                <div
                    className='desktop__project-focus-ring'
                    aria-hidden='true'
                />
            )}

            <footer className='desktop__footer'>
                <div className='desktop__copyright'>
                    <p className='desktop__footer__copyright'>© {new Date().getFullYear()}</p> {/**, <a target="_blank" rel="noopener noreferrer" href="/">JR</a> */}
                </div>
                <div className='socials'>
                    <p className='desktop__footer__socials'>
                        {
                            Object.values(socialLinks).map(social => (
                                <a key={social.name} className='desktop__footer__social underline underline--hover' target="_blank" rel="noopener noreferrer" title={social.title} href={social.url}>
                                    {social.name}
                                </a>
                            ))
                        }
                    </p>
                </div>
            </footer>

            <Projects />
        </div>
    )
}

export default Desktop
