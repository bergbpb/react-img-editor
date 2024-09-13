import React, {
    useContext,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'
import { hot } from 'react-hot-loader'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames'
import {
    includes,
    isEmpty,
    isNil,
    isNull,
    map,
    random,
    size,
    uniqueId,
} from 'lodash'

import Draggable from 'react-draggable'
import { toPng } from 'html-to-image'

import { base64Mime, useKeyPress } from './hooks'

import { ActionTypes, AppContext, CollectionImageData } from '../store'

import Image from './page_elements/Image'
import Viewer from './nav_elements/routing/Viewer'
import Paginator from './nav_elements/routing/Paginator'

import '../scss/App.scss'
import Flyout from './page_elements/Flyout'

export function App() {
    const globalState = useContext(AppContext)
    const { dispatch, state } = globalState
    const [lightboxMode, setLightboxMode] = useState(false)
    const [hideViewer, setHideViewer] = useState(false)
    const [isCreateCollageCheckboxChecked, setIsCreateCollageCheckboxChecked] =
        useState(false)
    const [hideMainImage, setHideMainImage] = useState<boolean>(lightboxMode)
    const [mainImageSrc, setMainImgSrc] = useState<string | null>(null)
    const [imageDataArray, setImageDataArray] = useState<
        CollectionImageData[] | null
    >(null)
    const [videoSrc, setVideoSrc] = useState('')
    const [isPaginationVisible, setIsPaginationVisible] = useState(false)
    const [_, setPreviewUrl] = useState('')
    const [isFlyoutVisible, setIsFlyoutVisible] = useState(true)
    const [useDefaultImageData, setUseDefaultImageData] = useState(false)
    const [isInitialRender, setIsInitialRender] = useState(true)

    const spaceBar = useKeyPress(' ')
    const comma = useKeyPress(',')
    const period = useKeyPress('.')
    const rightArrow = useKeyPress('ArrowRight')
    const leftArrow = useKeyPress('ArrowLeft')
    const upArrow = useKeyPress('ArrowUp')
    const downArrow = useKeyPress('ArrowDown')

    const imgeRef = useRef(null)
    const nodeRef = useRef(null)

    useEffect(() => {
        setImageDataArray(
            isNil(state.shuffledImageData)
                ? state.imageData
                : state.shuffledImageData
        )

        setHideMainImage(lightboxMode)

        if (imageDataArray && imageDataArray.length > 0) {
            setMainImgSrc(
                imageDataArray[state.activeIndex ?? 0].imgSrc as string
            )
            setVideoSrc(
                isNil(imageDataArray[state.activeIndex ?? 0]?.videoSrc)
                    ? ''
                    : (imageDataArray[state.activeIndex ?? 0]
                          ?.videoSrc as string)
            )
        }
    }, [
        hideMainImage,
        imageDataArray,
        isCreateCollageCheckboxChecked,
        lightboxMode,
        mainImageSrc,
        setVideoSrc,
        state.activeIndex,
        state.imageData,
        state.shuffledImageData,
        videoSrc,
    ])

    useEffect(() => {
        size(state.collageImageData) === 0 && setHideMainImage(false)
    }, [state.collageImageData])
    // navigation by keypress.
    useEffect(() => {
        if (!isNull(state.activeIndex) && !state.collageImageData) {
            if (spaceBar || rightArrow)
                state.activeIndex < size(imageDataArray) - 1 &&
                    dispatch({
                        type: ActionTypes.SET_ACTIVE_THUMBNAIL_URL,
                        payload: { activeIndex: state.activeIndex + 1 },
                    })
            if (leftArrow)
                state.activeIndex > 0 &&
                    dispatch({
                        type: ActionTypes.SET_ACTIVE_THUMBNAIL_URL,
                        payload: { activeIndex: state.activeIndex - 1 },
                    })
            if (period)
                state.activeIndex < size(imageDataArray) - 5 &&
                    dispatch({
                        type: ActionTypes.SET_ACTIVE_THUMBNAIL_URL,
                        payload: { activeIndex: state.activeIndex + 5 },
                    })
            if (comma)
                state.activeIndex > 4 &&
                    dispatch({
                        type: ActionTypes.SET_ACTIVE_THUMBNAIL_URL,
                        payload: { activeIndex: state.activeIndex - 5 },
                    })
            if (upArrow)
                dispatch({
                    type: ActionTypes.SET_ACTIVE_THUMBNAIL_URL,
                    payload: { activeIndex: size(imageDataArray) - 1 },
                })
            if (downArrow)
                dispatch({
                    type: ActionTypes.SET_ACTIVE_THUMBNAIL_URL,
                    payload: { activeIndex: 0 },
                })
        }
    }, [
        comma,
        downArrow,
        imageDataArray,
        leftArrow,
        rightArrow,
        period,
        spaceBar,
        upArrow,
    ])

    const renderCollageImages = () => {
        return (
            state.collageImageData &&
            map(state.collageImageData, (img, index) => {
                return (
                    <Draggable key={`collage-draggable-${index}`}>
                        <span id={`collage-img-${index}`}>
                            <Image
                                classArray={null}
                                filters={
                                    state.collageImageFilters
                                        ? state.collageImageFilters[index]
                                        : []
                                }
                                key={`collage-image-${index}`}
                                imgSrc={img.imgSrc as string}
                            />
                        </span>
                    </Draggable>
                )
            })
        )
    }

    const takeScreenshot = useCallback(() => {
        if (imgeRef.current === null) return

        toPng(imgeRef.current, {
            backgroundColor: '#141414',
            cacheBust: true,
        }).then(dataUrl => {
            setPreviewUrl(dataUrl)
            const link = document.createElement('a')
            link.download = `collage-${random(100_000)}.png`
            link.href = dataUrl
            link.click()
            dispatch({
                type: ActionTypes.SET_IMAGE_DATA,
                payload: {
                    imageData: state.imageData
                        ? [
                              {
                                  className: 'image',
                                  imgSrc: dataUrl,
                                  imgFilters: [
                                      state.filters[state.filterIndex],
                                  ],
                                  videoSrc: null,
                                  navIndex: null,
                                  orientation: 'landscape',
                                  imgId: `imageId_${state.imageData.length}`,
                              },
                          ]
                        : null,
                    filters: null,
                    collageImageData: null,
                    collageImageFilters: null,
                    activeIndex: 0,
                    hideCollageDisplay: true,
                },
            })
        })
    }, [imgeRef, state.imageData])

    return (
        <div className='app-container'>
            <>
                <header className={classNames(isFlyoutVisible && 'visible')}>
                    <div className='nav-wrapper'>
                        <div className='viewer-wrapper'>
                            {state.imageData &&
                                state.imageData.length > 2 &&
                                !state.collageImageData &&
                                !hideViewer && (
                                    <Viewer
                                        lightboxMode={lightboxMode}
                                        hideViewer={hideViewer}
                                        handleSetLightboxMode={setLightboxMode}
                                        videoSrc={videoSrc}
                                        handleSetVideoSrc={setVideoSrc}
                                    />
                                )}
                        </div>
                    </div>
                    <span
                        className='show-flyout-icon'
                        onClick={() => {
                            setIsFlyoutVisible(!isFlyoutVisible)
                            setIsInitialRender(false)
                        }}
                    >
                        <i
                            className='fa-solid fa-arrow-up'
                            style={{ color: '#141414' }}
                        />
                    </span>
                </header>
                <main
                    ref={imgeRef}
                    className='image-wrapper'
                >
                    {isEmpty(state.imageData) && (
                        <p>No available image data, please upload content...</p>
                    )}
                    {state.collageImageData && !state.hideCollageDisplay ? (
                        renderCollageImages()
                    ) : (
                        <>
                            {size(videoSrc) > 0 ||
                            base64Mime(videoSrc) === 'video/mp4' ? (
                                <div>
                                    <video
                                        autoPlay
                                        controls
                                        key={videoSrc}
                                        poster={mainImageSrc ?? ''}
                                        width='100%'
                                        height='100%'
                                    >
                                        <source
                                            src={
                                                includes(mainImageSrc, 'mp4')
                                                    ? mainImageSrc ?? ''
                                                    : videoSrc
                                            }
                                            type='video/mp4'
                                        />
                                    </video>
                                </div>
                            ) : (
                                <Draggable>
                                    <span>
                                        {isEmpty(state.imageData) ||
                                        hideMainImage ? (
                                            <></>
                                        ) : (
                                            <Image
                                                classArray={[
                                                    hideMainImage
                                                        ? 'hide-main-image'
                                                        : 'show-main-image',
                                                ]}
                                                filters={
                                                    state.collageImageFilters
                                                        ? state
                                                              .collageImageFilters[
                                                              state.filterIndex
                                                          ]
                                                        : state.filters[0]
                                                }
                                                imgSrc={
                                                    state.hideCollageDisplay
                                                        ? imageDataArray
                                                            ? (imageDataArray[
                                                                  state.activeIndex ??
                                                                      0
                                                              ]
                                                                  .imgSrc as string)
                                                            : ''
                                                        : mainImageSrc
                                                        ? mainImageSrc
                                                        : ''
                                                }
                                                imgId={
                                                    state.collageImageData
                                                        ? `${
                                                              state
                                                                  .collageImageData[
                                                                  state
                                                                      .filterIndex
                                                              ].imgId
                                                          }`
                                                        : state.imageData
                                                        ? `${state.imageData[0].imgId}`
                                                        : uniqueId('imgId-')
                                                }
                                            />
                                        )}
                                    </span>
                                </Draggable>
                            )}
                        </>
                    )}
                </main>
                {isEmpty(state.imageData) ? (
                    <></>
                ) : (
                    <footer>
                        <Paginator showPagination={isPaginationVisible} />
                    </footer>
                )}
                <CSSTransition
                    in={isFlyoutVisible}
                    nodeRef={nodeRef}
                    timeout={300}
                    classNames='flyout-transition'
                >
                    <div
                        ref={nodeRef}
                        className={classNames(
                            isInitialRender
                                ? 'flyout-transition-enter-done'
                                : '',
                            'flyout-wrapper'
                        )}
                    >
                        <Flyout
                            isCreateCollageCheckboxChecked={
                                isCreateCollageCheckboxChecked
                            }
                            setIsCreateCollageCheckboxChecked={
                                setIsCreateCollageCheckboxChecked
                            }
                            setIsPaginationVisible={setIsPaginationVisible}
                            isPaginationVisible={isPaginationVisible}
                            isFlyoutVisible={isFlyoutVisible}
                            handleSetIsFlyoutVisible={setIsFlyoutVisible}
                            createImg={takeScreenshot}
                            useDefaultImageData={useDefaultImageData}
                            setUseDefaultImageData={setUseDefaultImageData}
                            hideViewer={hideViewer}
                            lightboxMode={lightboxMode}
                            handleSetLightboxMode={setLightboxMode}
                            handleSetHideViewer={setHideViewer}
                            videoSrc={videoSrc}
                            handleSetVideoSrc={setVideoSrc}
                        />
                    </div>
                </CSSTransition>
            </>
        </div>
    )
}

export default hot(module)(App)
