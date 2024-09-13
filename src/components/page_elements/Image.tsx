import React, {
    forwardRef,
    ForwardRefExoticComponent,
    RefAttributes,
} from 'react'
import { hot } from 'react-hot-loader/index'
import { cloneDeep, filter, find, map } from 'lodash'
import classNames from 'classnames'

import { AppState, Filter } from '../../store'

interface Props {
    classArray: string[] | null
    filters: Filter[]
    imgId?: string
    imgSrc?: AppState['mainImgSrc']
    isActive?: boolean
    ref?: React.ForwardedRef<HTMLImageElement>
}
export const Image: ForwardRefExoticComponent<
    Omit<Props, 'ref'> & RefAttributes<HTMLImageElement>
> = forwardRef(
    ({ classArray, filters, imgId, imgSrc, isActive }: Props, ref) => {
        Image.displayName = 'Image'

        const rotate3dFilterState: Filter = find(
            filters,
            filter => filter.id === 'rotate3dFilter'
        ) as Filter

        const rotate3dstring = rotate3dFilterState
            ? `(${map(
                  rotate3dFilterState.value as Record<string, string>,
                  (value: string, key: string) => {
                      return key === 'angle' ? `${value}deg` : value
                  }
              )})`
            : ''

        const filterDataCopy = cloneDeep(filters)

        const filterString = {
            filter: `blur(${
                filter(filterDataCopy, filter => filter.id === 'blurFilter')[0]
                    .value
            }px) brightness(${
                filter(
                    filterDataCopy,
                    filter => filter.id === 'brightnessFilter'
                )[0].value
            }%) contrast(${
                filter(
                    filterDataCopy,
                    filter => filter.id === 'contrastFilter'
                )[0].value
            }%) grayscale(${
                filter(
                    filterDataCopy,
                    filter => filter.id === 'grayscaleFilter'
                )[0].value
            }%) hue-rotate(${
                filter(
                    filterDataCopy,
                    filter => filter.id === 'hueRotateFilter'
                )[0].value
            }deg) invert(${
                filter(
                    filterDataCopy,
                    filter => filter.id === 'invertFilter'
                )[0].value
            }%) opacity(${
                filter(
                    filterDataCopy,
                    filter => filter.id === 'opacityFilter'
                )[0].value
            }%) saturate(${
                filter(
                    filterDataCopy,
                    filter => filter.id === 'saturateFilter'
                )[0].value
            }%) sepia(${
                filter(filterDataCopy, filter => filter.id === 'sepiaFilter')[0]
                    .value
            }%)`.replace(/\s+/g, ' '),
            transform: `rotate(${
                (filter(
                    filterDataCopy,
                    filter => filter.id === 'rotateFilter'
                )[0].value as number) * 3.6
            }deg) rotate3d${rotate3dstring} scale(${
                filter(filterDataCopy, filter => filter.id === 'zoomFilter')[0]
                    .value
            })`,
        }

        return filters ? (
            <img
                ref={ref}
                className={classNames(
                    ...(classArray ?? []),
                    'image ' + (isActive ? ' active' : '')
                )}
                id={imgId}
                src={imgSrc ?? ''}
                style={filterString}
            />
        ) : (
            <></>
        )
    }
)

export default hot(module)(Image)
