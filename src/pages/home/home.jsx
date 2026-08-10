import loadable from '@loadable/component'

import Layout from '@components/layout/layout'
import thumbnail from '@assets/imgs/thumbnail.jpg'

import { SASS_VARIABLES } from '@utils/sass-variables'

// Split by device so mobile visitors never have to download the
// three.js / react-three-fiber / drei / gsap bundle used by the desktop
// WebGL scene (and vice versa, desktop skips the mobile-only bundle).
const Desktop = loadable(() => import('./desktop/desktop'))

const Home = () => {
    return (
        <Layout
            title={'John Roussos — Developer'} 
            description={'Creative developer focusing on motion and visually appealing web experiences based in Greece.'} 
            image={thumbnail}
            color={SASS_VARIABLES.BACKGROUND_DARK}
        >
            <Desktop />
        </Layout>
    )
}

export default Home
