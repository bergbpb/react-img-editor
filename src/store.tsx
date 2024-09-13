import React, { createContext, FC, ReactNode, useReducer } from 'react'
import { cloneDeep, isNull, isNil, map, size } from 'lodash'
// import data from './mock/get-data-for-mount-home.json';

export interface AppState {
    activeIndex: number | null
    filterIndex: number
    mainImgSrc: string | null
    filters: Filter[][]
    imageData: CollectionImageData[] | null
    shuffledImageData: AppState['imageData'] | null
    collageImageData: AppState['imageData'] | null
    collageImageFilters: AppState['filters'] | null
    reset3DFilterState: boolean
    textData: string[] | null
    hideCollageDisplay: boolean
}

export const defaultFilterState: AppState['filters'] = [
    [
        {
            id: 'opacityFilter',
            maxValue: 100,
            minValue: 0,
            name: 'opacity',
            property: 'opacity',
            value: 100,
        },
        {
            id: 'blurFilter',
            maxValue: 100,
            minValue: 0,
            name: 'blur',
            property: 'blur',
            value: 0,
        },
        {
            id: 'brightnessFilter',
            maxValue: 100,
            minValue: 0,
            name: 'brightness',
            property: 'brightness',
            value: 100,
        },
        {
            id: 'contrastFilter',
            maxValue: 100,
            minValue: 0,
            name: 'contrast',
            property: 'contrast',
            value: 100,
        },
        {
            id: 'grayscaleFilter',
            maxValue: 100,
            minValue: 0,
            name: 'grayscale',
            property: 'grayscale',
            value: 0,
        },
        {
            id: 'hueRotateFilter',
            maxValue: 100,
            minValue: 0,
            name: 'hueRotate',
            property: 'hueRotate',
            value: 0,
        },
        {
            id: 'invertFilter',
            maxValue: 100,
            minValue: 0,
            name: 'invert',
            property: 'invert',
            value: 0,
        },
        {
            id: 'sepiaFilter',
            maxValue: 100,
            minValue: 0,
            name: 'sepia',
            property: 'sepia',
            value: 0,
        },
        {
            id: 'saturateFilter',
            maxValue: 100,
            minValue: 0,
            name: 'saturate',
            property: 'saturate',
            value: 100,
        },
        {
            id: 'zoomFilter',
            maxValue: 1,
            minValue: 0,
            name: 'zoom',
            property: 'zoom',
            value: 1,
        },
        {
            id: 'rotateFilter',
            maxValue: 100,
            minValue: 0,
            name: 'rotate',
            property: 'rotate',
            value: 0,
        },
        {
            id: 'rotate3dFilter',
            maxValue: 100,
            minValue: 0,
            name: 'rotate3d',
            property: 'rotate3d',
            value: { x: 0, y: 0, z: 0, angle: 0 },
        },
    ],
]

export interface Filter {
    id?: string
    imgSrc?: string
    maxValue?: number
    minValue?: number
    name?: string
    property?: string
    value?: number | string | Record<string, unknown> | null
}

export interface CollectionImageData {
    className?: string
    imgSrc: string | ArrayBuffer | null
    imgFilters: Filter[][]
    videoSrc: string | ArrayBuffer | null
    orientation: string | null
    imgId: number | string
    imgClass?: string
    navIndex: number | null
}

const initialState: AppState = {
    activeIndex: 0,
    mainImgSrc: null,
    filters: cloneDeep(defaultFilterState),
    filterIndex: 0,
    imageData: [],
    reset3DFilterState: false,
    shuffledImageData: null,
    collageImageData: null,
    collageImageFilters: null,
    textData: null,
    hideCollageDisplay: false,
}

export enum ActionTypes {
    SET_ACTIVE_THUMBNAIL_URL = 'SET_ACTIVE_THUMBNAIL_URL', // eslint-disable-line
    SET_IMAGE_DATA = 'SET_IMAGE_DATA', // eslint-disable-line
    SET_COLLAGE_IMAGE_DATA = 'SET_COLLAGE_IMAGE_DATA', // eslint-disable-line
    CLEAR_COLLAGE_IMAGE_DATA = 'CLEAR_COLLAGE_IMAGE_DATA', // eslint-disable-line
    SHUFFLE_IMAGE_DATA = 'SHUFFLE_IMAGE_DATA', // eslint-disable-line
    SET_INPUT_VALUE = 'SET_INPUT_VALUE', // eslint-disable-line
    RESET_FILTERS = 'RESET_FILTERS', // eslint-disable-line
    REMOVE_IMAGE_FROM_COLLAGE = 'REMOVE_IMAGE_FROM_COLLAGE', // eslint-disable-line
}

export interface Action {
    type: ActionTypes
    payload: {
        activeIndex?: AppState['activeIndex']
        imageData?: AppState['imageData']
        collageImageData?: AppState['collageImageData']
        collageImageFilters?: AppState['collageImageFilters']
        isCollageFilterData?: boolean
        collageIndex?: AppState['activeIndex']
        filters?: AppState['filters'] | null
        filterIndex?: AppState['filterIndex']
        id?: number | string | null
        shuffledImageData?: AppState['shuffledImageData'] | null
        value?: number | Record<string, unknown> | null
        hideCollageDisplay?: boolean
    }
}

interface _AppContext {
    state: AppState
    dispatch: React.Dispatch<Action>
}

const AppContext = createContext<_AppContext>({
    state: initialState,
    dispatch: () => {},
})

const appReducer = (state: AppState, action: Action): typeof initialState => {
    console.warn(
        `%cAPP_REDUCER CALLED: %caction: ${`%c${action.type}`}, %cpayload:`,
        'color: red; font-weight: bold',
        'color: cyan',
        'color: grey',
        'color: cyan',
        action.payload
    )

    switch (action.type) {
        case 'SET_ACTIVE_THUMBNAIL_URL':
            console.log(action.payload)
            return {
                ...state,
                activeIndex:
                    action.payload.activeIndex ?? initialState.activeIndex,
            }

        case 'SET_IMAGE_DATA':
            return {
                ...state,
                activeIndex:
                    action.payload.activeIndex ?? initialState.activeIndex,
                filters: isNil(action.payload.filters)
                    ? defaultFilterState
                    : state.filters,
                imageData: isNil(action.payload.imageData)
                    ? []
                    : state.imageData
                    ? [...action.payload.imageData, ...state.imageData]
                    : [...action.payload.imageData],
                collageImageData: isNil(action.payload.collageImageData)
                    ? null
                    : state.collageImageData,
                collageImageFilters: isNil(action.payload.collageImageFilters)
                    ? null
                    : state.collageImageFilters,
                shuffledImageData: isNil(action.payload.shuffledImageData)
                    ? null
                    : state.shuffledImageData
                    ? [
                          ...action.payload.shuffledImageData,
                          ...state.shuffledImageData,
                      ]
                    : action.payload.shuffledImageData,
                hideCollageDisplay: action.payload.hideCollageDisplay
                    ? action.payload.hideCollageDisplay
                    : initialState.hideCollageDisplay,
            }

        case 'SET_COLLAGE_IMAGE_DATA':
            const filterData: Filter[][] = map(
                action.payload.collageImageData,
                item => item.imgFilters[0]
            )
            console.log(filterData, 'in store')
            return {
                ...state,
                collageImageData: action.payload.collageImageData ?? [],
                collageImageFilters: filterData,
                hideCollageDisplay: false,
                reset3DFilterState: true,
            }

        case 'CLEAR_COLLAGE_IMAGE_DATA':
            return {
                ...state,
                collageImageData: null,
                collageImageFilters: null,
                filters: defaultFilterState,
            }

        case 'SHUFFLE_IMAGE_DATA':
            return {
                ...state,
                shuffledImageData:
                    isNull(state.shuffledImageData) &&
                    action.payload.shuffledImageData
                        ? action.payload.shuffledImageData
                        : null,
            }

        case 'SET_INPUT_VALUE':
            const _filterData = state.collageImageFilters
                ? cloneDeep(state.collageImageFilters)
                : cloneDeep(state.filters)
            const _filterIndex =
                action.payload.collageIndex ?? state.filterIndex
            const isCollageData = !isNull(action.payload.collageIndex)
            const filterArrayToUpdate = _filterData && _filterData[_filterIndex]
            const updatedFilterArray = filterArrayToUpdate
                ? filterArrayToUpdate.map(filter =>
                      filter.id === action.payload.id
                          ? {
                                ...filter,
                                value: action.payload.value,
                            }
                          : filter
                  )
                : null

            const updatedCollageImageFiltersArray = isCollageData
                ? map(state.collageImageFilters, (filterArray, index) =>
                      index === action.payload.collageIndex
                          ? (filterArray = updatedFilterArray ?? [])
                          : filterArray
                  )
                : null

            const newFilterState = {
                ...state,
                filters: [updatedFilterArray ?? []],
                collageImageFilters:
                    updatedCollageImageFiltersArray ??
                    state.collageImageFilters,
            }
            return newFilterState

        case 'RESET_FILTERS':
            const resetCollageFilterState = () =>
                map(state.collageImageFilters, (imgFilterArray, index) => {
                    if (index === action.payload?.collageIndex) {
                        imgFilterArray = cloneDeep(defaultFilterState)[0]

                        return imgFilterArray
                    }

                    return imgFilterArray
                })

            const initialFilterState = action.payload?.isCollageFilterData
                ? {
                      ...state,

                      collageImageFilters: [...resetCollageFilterState()],
                  }
                : {
                      ...state,

                      filters: cloneDeep(defaultFilterState),
                  }

            return initialFilterState

        case 'REMOVE_IMAGE_FROM_COLLAGE':
            const newFilterArray = state.collageImageFilters
                ? state.collageImageFilters.filter(
                      (_, index) => index !== action.payload.collageIndex
                  )
                : state.collageImageFilters

            const newImgArray = state.collageImageData
                ? state.collageImageData.filter(
                      (_, index) => index !== action.payload.collageIndex
                  )
                : state.collageImageData

            return {
                ...state,
                collageImageData: size(newImgArray) === 0 ? null : newImgArray,
                collageImageFilters:
                    size(newFilterArray) === 0 ? null : newFilterArray,
            }
        default:
            throw new Error()
    }
}

const AppContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState)

    const value = { state, dispatch }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export { AppContext, AppContextProvider }
