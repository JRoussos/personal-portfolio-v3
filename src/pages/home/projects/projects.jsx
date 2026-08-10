import React, { 
    Suspense, 
    useEffect, 
    useMemo, 
    useState, 
    useCallback, 
    useRef 
} from 'react';

import { Canvas } from '@react-three/fiber';
import { Link } from 'react-router-dom';

import { useStore } from '@contexts/store';
import { PROJECTS } from '@contexts/data';

import Scrolling from '@pages/home/projects/scrolling';
import { clearScrollTarget, setScrollTarget } from '@pages/home/projects/scrollBridge';

const CAMERA_PROPS = {
    fov: 24,
    near: 0.1,
    far: 1000,
    aspect: 1.77,
    position: [0, 0, 100]
}

const CanvasReady = () => {
    const { dispatch } = useStore()
    useEffect(() => dispatch({ type: 'CHANGE_CANVAS_LOADED', canvasReady: true }), [dispatch])

    return null
}

const Projects = () => {
    const canvasRef = useRef(null)
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

    useEffect(() => {
        const handleResize = () => { canvasRef.current.style.height = `${window.innerHeight}px` }

        handleResize()
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div ref={canvasRef} className="canvas">
            <div className='canvas__content'>

                {/*
                    The project titles/links are rendered inside a WebGL canvas for the
                    visual experience, which isn't keyboard-focusable. This nav mirrors
                    that content as real links: Tab focuses them, and focus scrolls the
                    matching 3D tile into view.
                */}
                <nav className='sr-only home__navigation' aria-label='Projects'>
                    <ul className='home__navigation__list'>
                        {projects.map(project => (
                            <li key={project.name} className='home__navigation__item'>
                                <Link className='home__navigation__link italiana'
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
                        className='home__project-focus-ring'
                        aria-hidden='true'
                    />
                )}

                <Suspense fallback={null}>
                    <Canvas dpr={[window.devicePixelRatio, 2]} camera={CAMERA_PROPS} >
                        <Scrolling />
                        <CanvasReady />
                    </Canvas>
                </Suspense>
            </div>
        </div>
    )
}

export default Projects


