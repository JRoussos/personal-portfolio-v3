import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://johnroussos.dev'

const MetaHelmet = ({ title, description, image }) => {
    const { pathname } = useLocation()
    const canonicalUrl = `${SITE_URL}${pathname === '/' ? '' : pathname}`

    return (
        <Helmet>
            <title>{title}</title>
            <meta name='description' content={description} />
            <link rel='canonical' href={canonicalUrl} />

            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    )
}

export default MetaHelmet