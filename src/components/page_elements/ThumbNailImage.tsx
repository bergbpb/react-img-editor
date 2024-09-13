import React, { Dispatch, FC } from 'react'
import { hot } from 'react-hot-loader/index'
import classNames from 'classnames'

interface ThumbnailProps {
    activeIndex?: number
    imgId: number
    imgClass?: string
    imgSrc?: string | null
    handleClick?: Dispatch<React.SetStateAction<number>>
    orientation: string | null
}

export const ThumbNailImage: FC<ThumbnailProps> = props => {
    const { activeIndex, imgId, imgSrc, handleClick, orientation } = props

    function handleThumbNailClick(imgId: ThumbnailProps['imgId']) {
        handleClick && handleClick(imgId)
    }

    return (
        <div
            onClick={() => handleThumbNailClick(imgId)}
            className={classNames(
                'thumbnail-image',
                imgId === activeIndex && 'active',
                orientation === 'landscape' ? 'landscape' : 'portrait'
            )}
            id={`${imgId}`}
            style={{
                backgroundImage: `url("${imgSrc}")`,
                width: orientation === 'landscape' ? '13rem' : '8rem',
            }}
        />
    )
}

export default hot(module)(ThumbNailImage)
