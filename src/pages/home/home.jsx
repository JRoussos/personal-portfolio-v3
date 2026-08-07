import React, { useLayoutEffect } from 'react'
import { isMobile } from 'react-device-detect'
import loadable from '@loadable/component'
import HelmetTags from '../../components/helmetTags/helmetTags'

import Topper from '../../components/topper/topper'
import TextOvelay from './components/overlay/overlay'

import thumbnail from '../../assets/imgs/thumbnail.jpg'
import './home-styles.scss'

// Split by device so mobile visitors never have to download the
// three.js / react-three-fiber / drei / gsap bundle used by the desktop
// WebGL scene (and vice versa, desktop skips the mobile-only bundle).
const DefaultCanvas = loadable(() => import('./components/canvas/defaultCanvas'))
const MobileVersion = loadable(() => import('./components/mobile/mobileVersion'))

const Home = () => {

    useLayoutEffect(() => { document.title = 'John Roussos — Developer' }, [])

    return (
        <Topper>
            <HelmetTags 
                title={'John Roussos — Developer'} 
                description={'Creative developer focusing on motion and visually appealing web experiences based in Greece.'} 
                image={thumbnail}
            />
            {isMobile ? <MobileVersion/> : (
                <React.Fragment>
                    <TextOvelay/>
                    <DefaultCanvas/>
                </React.Fragment>
            )}
        </Topper>
    )
}

export default Home
