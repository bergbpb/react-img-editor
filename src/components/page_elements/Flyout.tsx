import React, { Dispatch, forwardRef, SetStateAction, useContext } from 'react'
import { hot } from 'react-hot-loader/index'

import ContentManger from '../nav_elements/routing/ContentManager'
import { isEmpty, size } from 'lodash'
import { AppContext } from '../../store'
import Filters from '../nav_elements/routing/Filters'
import Slideshow from './Slideshow'
import CheckBox from './CheckBox'

interface FlyoutProps {
    createImg: () => void
    hideViewer: boolean
    isCreateCollageCheckboxChecked: boolean
    isPaginationVisible: boolean
    isFlyoutVisible: boolean
    lightboxMode: boolean
    setIsCreateCollageCheckboxChecked: Dispatch<SetStateAction<boolean>>
    setIsPaginationVisible: Dispatch<SetStateAction<boolean>>
    handleSetLightboxMode: Dispatch<SetStateAction<boolean>>
    handleSetIsFlyoutVisible: Dispatch<SetStateAction<boolean>>
    handleSetHideViewer: Dispatch<SetStateAction<boolean>>
    setUseDefaultImageData: Dispatch<SetStateAction<boolean>>
    handleSetVideoSrc: Dispatch<SetStateAction<string>>
    useDefaultImageData: boolean
    videoSrc: string
}
export const Flyout: React.FC<FlyoutProps> = ({
    createImg,
    hideViewer,
    isCreateCollageCheckboxChecked,
    isPaginationVisible,
    lightboxMode,
    isFlyoutVisible,
    handleSetIsFlyoutVisible,
    setIsCreateCollageCheckboxChecked,
    setIsPaginationVisible,
    handleSetLightboxMode,
    handleSetHideViewer,
    setUseDefaultImageData,
    useDefaultImageData,
    videoSrc,
}: FlyoutProps) => {
    const globalState = useContext(AppContext)
    const { state } = globalState
    return (
        <div className='flyout-content'>
            <section className='flyout-header'>
                <span
                    className='close-flyout-icon'
                    onClick={() => {
                        handleSetIsFlyoutVisible(!isFlyoutVisible)
                    }}
                >
                    <i className='fa fa-xmark' />
                </span>
            </section>
            <section className='viewer-section'>
                {state.imageData &&
                    state.imageData.length > 1 &&
                    !state.collageImageData && (
                        <>
                            <h1>Viewer</h1>
                            <div className='viewer-controls'>
                                <CheckBox
                                    value={lightboxMode}
                                    label={'lightbox view'}
                                    handleChange={() => {
                                        handleSetLightboxMode(!lightboxMode)
                                        !lightboxMode &&
                                            handleSetIsFlyoutVisible(false)
                                    }}
                                />
                                <CheckBox
                                    value={hideViewer}
                                    label={'hide viewer'}
                                    handleChange={() =>
                                        handleSetHideViewer(!hideViewer)
                                    }
                                />
                            </div>
                        </>
                    )}
            </section>
            <section className='paginator-section'>
                {state.imageData &&
                    state.imageData.length > 1 &&
                    !state.collageImageData && (
                        <>
                            <h1>Paginator</h1>
                            <CheckBox
                                value={isPaginationVisible}
                                label={'show paginator'}
                                handleChange={() =>
                                    setIsPaginationVisible(!isPaginationVisible)
                                }
                            />
                        </>
                    )}
            </section>
            <section className='content-manager-section'>
                <h1>Content</h1>
                <ContentManger
                    isCreateCollageCheckboxChecked={
                        isCreateCollageCheckboxChecked
                    }
                    setIsCreateCollageCheckboxChecked={
                        setIsCreateCollageCheckboxChecked
                    }
                    createImg={createImg}
                    hideCheckboxes={
                        isEmpty(state.imageData) || size(state.imageData) === 1
                    }
                    useDefaultImageData={useDefaultImageData}
                    setUseDefaultImageData={setUseDefaultImageData}
                />
            </section>
            <section className='transform-section'>
                {!videoSrc &&
                    (state.collageImageData ||
                        (state.imageData && state.imageData.length > 0)) && (
                        <>
                            <h1>Transform</h1>
                            <Filters
                                disableFilters={size(videoSrc) > 0}
                                doNotRenderList={[
                                    'blur',
                                    'brightness',
                                    'contrast',
                                    'grayscale',
                                    'hueRotate',
                                    'invert',
                                    'opacity',
                                    'saturate',
                                    'sepia',
                                ]}
                            />
                        </>
                    )}
            </section>
            <section className='filters-section'>
                {!videoSrc &&
                    (state.collageImageData ||
                        (state.imageData && state.imageData.length > 0)) && (
                        <>
                            <h1>Filters</h1>
                            <Filters
                                disableFilters={size(videoSrc) > 0}
                                doNotRenderList={['rotate', 'rotate3d', 'zoom']}
                            />
                        </>
                    )}
            </section>
            <section className='slideshow-section'>
                {!videoSrc &&
                    state.imageData &&
                    state.imageData.length > 1 &&
                    !state.collageImageData && (
                        <>
                            <h1>Slideshow</h1>
                            <Slideshow
                                handleSetHideViewer={handleSetHideViewer}
                                handleSetIsFlyoutVisible={
                                    handleSetIsFlyoutVisible
                                }
                                handleSetLightboxMode={handleSetLightboxMode}
                            />
                        </>
                    )}
            </section>
        </div>
    )
}

export default hot(module)(Flyout)
