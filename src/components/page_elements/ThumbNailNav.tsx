import React, {
    Dispatch,
    FC,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from 'react'
import { filter, forEach, isNil, isNull, uniqueId } from 'lodash'
import classNames from 'classnames'

import {
    THUMBNAIL_PORTRAIT_DEFAULT_WIDTH,
    THUMBNAIL_LANDSCAPE_DEFAULT_WIDTH,
} from '../../constants'

import { ActionTypes, AppContext, CollectionImageData } from '../../store'

import { ThumbNailImage } from './ThumbNailImage'
import CheckBox from './CheckBox'

interface ThumbnailNavProps {
    lightboxMode: boolean | null
    handleSetLightboxMode: Dispatch<SetStateAction<boolean>>
    handleSetVideoSrc: Dispatch<SetStateAction<string>>
    videoSrc: string | null
}

export const ThumbNailNav: FC<ThumbnailNavProps> = ({
    lightboxMode,
    handleSetLightboxMode,
    handleSetVideoSrc,
    videoSrc,
}) => {
    const globalState = useContext(AppContext)
    const { dispatch, state } = globalState

    const [margin, setMargin] = useState(4)

    useEffect(() => {
        if (lightboxMode) {
            setMargin(0)
        } else {
            if (isNil(state.imageData) && isNil(state.shuffledImageData)) return

            const _data = isNil(state.shuffledImageData)
                ? state.imageData ?? []
                : state.shuffledImageData ?? []

            const thumbNailNavMarginItemsArray = filter(
                _data,

                (item, index) => {
                    if (
                        index > 1 &&
                        state.activeIndex &&
                        index <= state.activeIndex
                    ) {
                        item.navIndex = index

                        return item
                    }
                }
            )

            let thumbNailnavLeftMargin = 0

            forEach(
                thumbNailNavMarginItemsArray as CollectionImageData[],
                item => {
                    if (
                        item.navIndex &&
                        state.imageData &&
                        item.navIndex < state.imageData.length - 1
                    ) {
                        thumbNailnavLeftMargin +=
                            item.orientation === 'landscape'
                                ? THUMBNAIL_LANDSCAPE_DEFAULT_WIDTH
                                : THUMBNAIL_PORTRAIT_DEFAULT_WIDTH
                    }
                }
            )

            setMargin(thumbNailnavLeftMargin)
        }
    }),
        [state.shuffledImageData, state.imageData, lightboxMode]

    const renderThumbnailNav = () => {
        const _data = isNil(state.shuffledImageData)
            ? (state.imageData as CollectionImageData[])
            : (state.shuffledImageData as CollectionImageData[])
        return _data.map((item, index) => {
            return (
                <ThumbNailImage
                    activeIndex={state.activeIndex ?? 0}
                    handleClick={() => {
                        dispatch({
                            type: ActionTypes.SET_ACTIVE_THUMBNAIL_URL,
                            payload: { activeIndex: index },
                        })
                        handleSetLightboxMode(false)
                        handleSetVideoSrc(videoSrc ?? '')
                    }}
                    key={uniqueId(`${index}`)}
                    imgId={index}
                    imgClass={item.imgClass}
                    imgSrc={item.imgSrc as string}
                    orientation={item.orientation}
                />
            )
        })
    }

    return (
        <>
            <div
                className={classNames(
                    lightboxMode ? 'light-box expand-lightbox' : '',
                    'thumb-nail-nav-container'
                )}
            >
                {lightboxMode ? (
                    <></>
                ) : (
                    <>
                        <span
                            className='thumb-nail-nav-control'
                            onClick={() =>
                                state.activeIndex &&
                                state.activeIndex > 0 &&
                                dispatch({
                                    type: ActionTypes.SET_ACTIVE_THUMBNAIL_URL,
                                    payload: {
                                        activeIndex: state.activeIndex - 1,
                                    },
                                })
                            }
                        >
                            <i className='fa-solid fa-chevron-left' />
                        </span>

                        <span
                            className='thumb-nail-nav-control'
                            onClick={() =>
                                dispatch({
                                    type: ActionTypes.SET_ACTIVE_THUMBNAIL_URL,
                                    payload: { activeIndex: 0 },
                                })
                            }
                        >
                            <i className='fa-solid fa-angles-left' />
                        </span>
                    </>
                )}

                <div className='thumb-nail-nav-inner-container'>
                    <div
                        className='thumb-nail-nav-slide-container'
                        style={{ marginLeft: `-${margin}rem` }}
                    >
                        {!isNil(state.imageData) && renderThumbnailNav()}
                    </div>
                </div>

                {lightboxMode ? (
                    <></>
                ) : (
                    <>
                        <span
                            className='thumb-nail-nav-control'
                            onClick={() =>
                                state.imageData &&
                                dispatch({
                                    type: ActionTypes.SET_ACTIVE_THUMBNAIL_URL,
                                    payload: {
                                        activeIndex: state.imageData.length - 1,
                                    },
                                })
                            }
                        >
                            <i className='fa-solid fa-angles-right' />
                        </span>

                        <span
                            className='thumb-nail-nav-control'
                            onClick={() => {
                                !isNull(state.activeIndex) &&
                                    state.imageData &&
                                    state.activeIndex <
                                        state.imageData.length - 1 &&
                                    dispatch({
                                        type: ActionTypes.SET_ACTIVE_THUMBNAIL_URL,
                                        payload: {
                                            activeIndex: state.activeIndex + 1,
                                        },
                                    })
                            }}
                        >
                            <i className='fa-solid fa-chevron-right' />
                        </span>
                    </>
                )}
            </div>
        </>
    )
}
