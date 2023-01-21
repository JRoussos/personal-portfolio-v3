import React, { useLayoutEffect } from 'react'
import HelmetTags from '../../components/helmetTags/helmetTags'

import Topper from '../../components/topper/topper'

import DefaultCanvas from './components/canvas/defaultCanvas'
import TextOvelay from './components/overlay/overlay'

import thumbnail from '../../assets/imgs/thumbnail.jpg'
import './home-styles.scss'

const Home = () => {

    useLayoutEffect(() => { document.title = 'John Roussos — Developer' }, [])

    return (
        <Topper>
            <HelmetTags 
                title={'John Roussos — Developer'} 
                description={'Creative developer focusing on motion and visually appealing web experiences based in Greece.'} 
                image={thumbnail}
            />
            <TextOvelay/>
            <DefaultCanvas/>
        </Topper>
    )
}

export default Home
