import React, { Dispatch, SetStateAction, useContext } from 'react'
import { hot } from 'react-hot-loader/index'
import { Navigate } from 'react-router-dom'

import { AppContext } from '../../../store'

import { ThumbNailNav } from '../../page_elements/ThumbNailNav'

interface Props {
    hideViewer: boolean
    lightboxMode: boolean
    handleSetLightboxMode: Dispatch<SetStateAction<boolean>>
    handleSetVideoSrc: Dispatch<SetStateAction<string>>
    videoSrc: string | null
}

export const Viewer: React.FC<Props> = ({
    hideViewer,
    lightboxMode,
    handleSetLightboxMode,
    handleSetVideoSrc,
    videoSrc,
}) => {
    return hideViewer ? (
        <></>
    ) : (
        <>
            <div className='thumbnail-nav-container'>
                <div className='thumbnail-nav-content'>
                    <ThumbNailNav
                        lightboxMode={lightboxMode}
                        handleSetLightboxMode={handleSetLightboxMode}
                        handleSetVideoSrc={handleSetVideoSrc}
                        videoSrc={videoSrc}
                    />
                </div>
            </div>
        </>
    )
}

export default hot(module)(Viewer)
