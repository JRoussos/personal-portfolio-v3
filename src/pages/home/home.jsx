import React, { useLayoutEffect } from 'react'

import Topper from '../../components/topper/topper'

import DefaultCanvas from './components/canvas/defaultCanvas'
import TextOvelay from './components/overlay/overlay'

import './home-styles.scss'

const Home = () => {

    useLayoutEffect(() => { document.title = 'John Roussos — Developer' }, [])

    return (
        <Topper>
            <TextOvelay/>
            <DefaultCanvas/>
        </Topper>
    )
}

export default Home
