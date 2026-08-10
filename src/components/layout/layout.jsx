import { useLayoutEffect } from 'react';

import HelmetTags from '@components/helmetTags/helmetTags'
import Topper from '@components/topper/topper';
import BackBtn from '@components/backBtn/backBtn'

import '@styles/components/_layout.scss'

const Layout = ({ eyebrow, title, description, image, color, children }) => {
    useLayoutEffect(() => {
        if (color) {
            document.body.style.background = color
        }
    }, [color])

    return (
        <Topper>
            <HelmetTags 
                title={title} 
                description={description} 
                image={image} 
            />
            <main className='layout'>
                <div className='layout__content'>
                    {eyebrow && 
                        <div className='layout__header'>
                            <h3 className='layout__eyebrow'>
                                {eyebrow}
                            </h3>
                            <BackBtn className='layout__back-btn' />
                        </div>
                    }
                    {children}
                </div>
            </main>
        </Topper>
    )
}

export default Layout;