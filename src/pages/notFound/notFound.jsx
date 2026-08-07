import React, { useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

import Topper from '../../components/topper/topper'
import BackBtn from '../../components/backBtn/backBtn'
import HelmetTags from '../../components/helmetTags/helmetTags'

import './notFound-style.scss'

const NotFound = () => {
    useLayoutEffect(() => {
        document.body.style.background = '#f5f2f2'
    }, [])

    return (
        <Topper>
            <div className='not-found'>
                <Helmet>
                    <meta name='robots' content='noindex, follow' />
                </Helmet>
                <HelmetTags
                    title={'Page not found — John Roussos'}
                    description={'The page you are looking for does not exist.'}
                    image={'/social-preview.jpg'}
                />
                <div className='title-wrapper'>
                    <h1>404</h1>
                    <Link to={'/'} replace aria-label="Back to home">
                        <BackBtn/>
                    </Link>
                </div>
                <div className='horizontal-line'></div>
                <div className='content'>
                    <h2>Page not found</h2>
                    <p>The URL you entered doesn’t match any page on this site.</p>
                    <Link className='home-link' to={'/'} replace>Back home</Link>
                </div>
            </div>
        </Topper>
    )
}

export default NotFound
