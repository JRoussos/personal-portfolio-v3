import React, { useMemo } from 'react'
import { createPortal } from 'react-dom'

import AbsolutePositions from './absolutePositions'

import data from '../../../../contexts/data'
import { useStore } from '../../../../contexts/store'

import './overlay-styles.scss'

const TextOverlay = () => {
    const { canvasReady } = useStore().state

    const projects = useMemo(() => {
        const projects = []
        
        data.map(project => {
            return projects.push({ id: project.id, name: project.name, desc: project.desc })
        })

        return projects.reverse()
    }, [])

    return createPortal(
        <div className={canvasReady ? 'text-overlay fadeIn' : 'text-overlay' }>
            {/* <div className='data-wrapper' style={{position: 'absolute', left: '5%'}}>
                <div className='title-container' id='project-titles'>
                    {projects.map( (project, i) => <h1 key={project.id} data-indx={`0${4-i}`}>{project.name}</h1> )}
                    {projects.map( (project, i) => <h1 key={project.id} data-indx={`0${4-i}`}>{project.name}</h1> )}
                    {projects.map( (project, i) => <h1 key={project.id} data-indx={`0${4-i}`}>{project.name}</h1> )}
                </div>
            </div> */}
            <AbsolutePositions/>
        </div>, document.getElementById('root')
    )
}

export default TextOverlay