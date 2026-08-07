import React, { useCallback, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'

import AbsolutePositions from './absolutePositions'
import {
    clearScrollTarget,
    setScrollTarget,
} from '../canvas/scrollBridge'

import data from '../../../../contexts/data'
import { useStore } from '../../../../contexts/store'

import './overlay-styles.scss'

const TextOverlay = () => {
    const { canvasReady } = useStore().state
    const [focusedPath, setFocusedPath] = useState(null)

    // Reversed so nav/Tab order matches the canvas scroll slots (0 = Chaos, …).
    const projects = useMemo(() => {
        return data.map(project => ({
            id: project.id,
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

    return createPortal(
        <div className={canvasReady ? 'text-overlay fadeIn' : 'text-overlay' }>
            {/*
              The project titles/links are rendered inside a WebGL canvas for the
              visual experience, which isn't keyboard-focusable. This nav mirrors
              that content as real links: Tab focuses them, and focus scrolls the
              matching 3D tile into view.
            */}
            <nav className='visually-hidden' aria-label='Projects'>
                <ul>
                    {projects.map((project, index) => (
                        <li key={project.id}>
                            <Link
                                to={`/project/${project.path}`}
                                onFocus={() => handleProjectFocus(index, project.path)}
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
                    className='tile-focus-ring'
                    aria-hidden='true'
                />
            )}
            <AbsolutePositions/>
        </div>, document.getElementById('root')
    )
}

export default TextOverlay
