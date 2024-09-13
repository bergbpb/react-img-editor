import React, {
    Fragment,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import { hot } from 'react-hot-loader/index'
import { cloneDeep, filter, includes, isEmpty, isNull, map } from 'lodash'
import classNames from 'classnames'
import {
    ActionTypes,
    AppContext,
    CollectionImageData,
    Filter,
} from '../../../store'

import CheckBox from '../../page_elements/CheckBox'

interface FilterProps {
    disableFilters: boolean
    doNotRenderList: string[]
}

export const Filters: React.FC<FilterProps> = ({
    disableFilters,
    doNotRenderList,
}) => {
    const globalState = useContext(AppContext)
    const { dispatch, state } = globalState
    const filterState =
        !state.collageImageFilters ||
        (state.collageImageFilters && state.hideCollageDisplay) ||
        (state.collageImageFilters && state.collageImageFilters.length === 0)
            ? state.filters
            : state.collageImageFilters
    const [setXValue, changeSetXValue] = useState<boolean[]>([])
    const [setYValue, changeSetYValue] = useState<boolean[]>([])
    const [setZValue, changeSetZValue] = useState<boolean[]>([])
    const [setAngleValue, changeSetAngleValue] = useState<boolean[]>([])
    const [rotate3dFiltervalue, setRotate3dFilterValue] = useState<number[]>([])
    const [currentCollageFilterIndex, setCurrentCollageFilterIndex] =
        useState<number>(0)

    useEffect(() => {
        changeSetXValue(map(filterState, () => false))
        changeSetYValue(map(filterState, () => false))
        changeSetZValue(map(filterState, () => false))
        changeSetAngleValue(map(filterState, () => true))
        setRotate3dFilterValue(map(filterState, () => 0))
    }, [])

    const handleUpdate3DFilterState = (_filterData: Filter[][]) => {
        setRotate3dFilterValue(map(_filterData, _item => 0))
        changeSetAngleValue(map(filterState, () => true))
    }

    const length = useRef(filterState.length)

    useEffect(() => {
        length.current !== filterState.length &&
            handleUpdate3DFilterState(filterState)

        length.current = filterState.length
    }, [filterState])

    const rotate3dState = useMemo(() => {
        const _filterData = cloneDeep(filterState)
        const _filterState = _filterData.map(filterArray => [
            {
                property: 'x',
                isSelected: setXValue[currentCollageFilterIndex],
                value: (
                    filterArray.filter(item => item.name === 'rotate3d')[0]
                        .value as Record<string, string | null>
                )['x'],
            },
            {
                property: 'y',
                isSelected: setYValue[currentCollageFilterIndex],
                value: (
                    filterArray.filter(item => item.name === 'rotate3d')[0]
                        .value as Record<string, string | null>
                )['y'],
            },
            {
                property: 'z',
                isSelected: setZValue[currentCollageFilterIndex],
                value: (
                    filterArray.filter(item => item.name === 'rotate3d')[0]
                        .value as Record<string, string | null>
                )['z'],
            },
            {
                property: 'angle',
                isSelected: setAngleValue[currentCollageFilterIndex],
                value: (
                    filterArray.filter(item => item.name === 'rotate3d')[0]
                        .value as Record<string, string | null>
                )['angle'],
            },
        ])

        return _filterState
    }, [
        filterState,
        length,
        currentCollageFilterIndex,
        setAngleValue,
        setXValue,
        setYValue,
        setZValue,
    ])

    const handleResetFilters = (
        index: number | null,
        isCollageFilterData: boolean
    ) => {
        changeSetXValue(prevState =>
            map(prevState, (_item, _index) =>
                _index === index ? false : _item
            )
        )
        changeSetYValue(prevState =>
            map(prevState, (_item, _index) =>
                _index === index ? false : _item
            )
        )
        changeSetZValue(prevState =>
            map(prevState, (_item, _index) =>
                _index === index ? false : _item
            )
        )
        changeSetAngleValue(prevState =>
            map(prevState, (_item, _index) =>
                _index === index ? false : _item
            )
        )
        setRotate3dFilterValue(prevState =>
            map(prevState, (_item, _index) => (_index === index ? 0 : _item))
        )
        dispatch({
            type: ActionTypes.RESET_FILTERS,
            payload: {
                collageIndex: index,
                isCollageFilterData: isCollageFilterData,
            },
        })
    }

    const getFilterToUpdate = (filterName: string, index: number) => {
        const _data = state.collageImageFilters ?? state.filters
        const _filterData = _data[index]
        return filter(_filterData, it => it.name === filterName)[0]
    }

    const updateArrayAtIndex = (arr: boolean[], index: number) => {
        const newArray = [...arr]
        newArray[index] = !newArray[index]
        return newArray
    }

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const filterToUpdate = getFilterToUpdate(event.target.name, index)

        dispatch({
            type: ActionTypes.SET_INPUT_VALUE,
            payload: {
                id: filterToUpdate.id,
                value: parseInt(event.target.value, 10),
                collageIndex: !isNull(state.collageImageFilters) ? index : null,
            },
        })
    }

    const handleRotate3DInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        index: number,
        update_property: string
    ) => {
        const filterToUpdate = getFilterToUpdate('rotate3d', index)
        const newValueObject = filterToUpdate?.value
            ? {
                  ...(filterToUpdate.value as Record<string, string | number>),
                  [update_property]: parseInt(event.target.value, 10),
              }
            : null

        dispatch({
            type: ActionTypes.SET_INPUT_VALUE,
            payload: {
                id: filterToUpdate.id,
                value: newValueObject,
                collageIndex: !isNull(state.collageImageFilters) ? index : null,
            },
        })
    }

    return (
        <>
            {state.imageData &&
                state.imageData.length > 0 &&
                map(filterState, (filterArray, index) => {
                    return (
                        <Fragment key={`filters-key-${index}`}>
                            <span className='filter-img-src'>
                                {state.collageImageData
                                    ? (state.collageImageData[index]
                                          ?.imgId as string)
                                    : state.imageData &&
                                      (
                                          (
                                              state.imageData[
                                                  state.filterIndex
                                              ] as CollectionImageData
                                          )?.imgId as string
                                      )?.substring(0, 50)}
                            </span>
                            <div
                                key={`filters-container-${index}`}
                                className={classNames(
                                    disableFilters ? 'filters-disabled' : '',
                                    'range-slider-container'
                                )}
                            >
                                {!includes(doNotRenderList, 'blur') && (
                                    <div className='range-slider'>
                                        <label>blur</label>
                                        <input
                                            type='range'
                                            key={`blur-${index}`}
                                            id='blur'
                                            name='blur'
                                            min='0'
                                            max='100'
                                            value={`${
                                                filter(
                                                    filterArray,
                                                    filterObject =>
                                                        filterObject.name ===
                                                        'blur'
                                                )[0].value
                                            }`}
                                            onChange={event =>
                                                handleInputChange(event, index)
                                            }
                                        />
                                    </div>
                                )}
                                {!includes(doNotRenderList, 'brightness') && (
                                    <div className='range-slider'>
                                        <label>brightness</label>
                                        <input
                                            type='range'
                                            key={`brightness-${index}`}
                                            id='brightness'
                                            name='brightness'
                                            min='0'
                                            max='100'
                                            value={`${
                                                filter(
                                                    filterArray,
                                                    filterObject =>
                                                        filterObject.name ===
                                                        'brightness'
                                                )[0].value
                                            }`}
                                            onChange={event =>
                                                handleInputChange(event, index)
                                            }
                                        />
                                    </div>
                                )}
                                {!includes(doNotRenderList, 'contrast') && (
                                    <div className='range-slider'>
                                        <label>contrast</label>
                                        <input
                                            type='range'
                                            key={`contrast-${index}`}
                                            id='contrast'
                                            name='contrast'
                                            min='0'
                                            max='100'
                                            value={`${
                                                filter(
                                                    filterArray,
                                                    filterObject =>
                                                        filterObject.name ===
                                                        'contrast'
                                                )[0].value
                                            }`}
                                            onChange={event =>
                                                handleInputChange(event, index)
                                            }
                                        />
                                    </div>
                                )}
                                {!includes(doNotRenderList, 'grayscale') && (
                                    <div className='range-slider'>
                                        <label>grayscale</label>
                                        <input
                                            type='range'
                                            key={`grayscale-${index}`}
                                            id='grayscale'
                                            name='grayscale'
                                            min='0'
                                            max='100'
                                            value={`${
                                                filter(
                                                    filterArray,
                                                    filterObject =>
                                                        filterObject.name ===
                                                        'grayscale'
                                                )[0].value
                                            }`}
                                            onChange={event =>
                                                handleInputChange(event, index)
                                            }
                                        />
                                    </div>
                                )}
                                {!includes(doNotRenderList, 'hueRotate') && (
                                    <div className='range-slider'>
                                        <label>hueRotate</label>
                                        <input
                                            type='range'
                                            key={`hueRotate-${index}`}
                                            id='hueRotate'
                                            name='hueRotate'
                                            min='0'
                                            max='100'
                                            value={`${
                                                filter(
                                                    filterArray,
                                                    filterObject =>
                                                        filterObject.name ===
                                                        'hueRotate'
                                                )[0].value
                                            }`}
                                            onChange={event =>
                                                handleInputChange(event, index)
                                            }
                                        />
                                    </div>
                                )}
                                {!includes(doNotRenderList, 'invert') && (
                                    <div className='range-slider'>
                                        <label>invert</label>
                                        <input
                                            type='range'
                                            key={`invert-${index}`}
                                            id='invert'
                                            name='invert'
                                            min='0'
                                            max='100'
                                            value={`${
                                                filter(
                                                    filterArray,
                                                    filterObject =>
                                                        filterObject.name ===
                                                        'invert'
                                                )[0].value
                                            }`}
                                            onChange={event =>
                                                handleInputChange(event, index)
                                            }
                                        />
                                    </div>
                                )}
                                {!includes(doNotRenderList, 'opacity') && (
                                    <div className='range-slider'>
                                        <label>opacity</label>
                                        <input
                                            type='range'
                                            key={`opacity-${index}`}
                                            id='opacity'
                                            name='opacity'
                                            min='0'
                                            max='100'
                                            value={`${
                                                filter(
                                                    filterArray,
                                                    filterObject =>
                                                        filterObject.name ===
                                                        'opacity'
                                                )[0].value
                                            }`}
                                            onChange={event =>
                                                handleInputChange(event, index)
                                            }
                                        />
                                    </div>
                                )}
                                {!includes(doNotRenderList, 'rotate') && (
                                    <div className='range-slider'>
                                        <label>rotate</label>
                                        <input
                                            type='range'
                                            key={`rotate-${index}`}
                                            id='rotate'
                                            name='rotate'
                                            min='0'
                                            max='100'
                                            value={`${
                                                filter(
                                                    filterArray,
                                                    filterObject =>
                                                        filterObject.name ===
                                                        'rotate'
                                                )[0].value
                                            }`}
                                            onChange={event =>
                                                handleInputChange(event, index)
                                            }
                                        />
                                    </div>
                                )}
                                {!includes(doNotRenderList, 'rotate3d') && (
                                    <div className='range-slider rotate3d-wrapper'>
                                        <div className='filter-wrapper'>
                                            <label>rotate3d</label>
                                            <input
                                                type='range'
                                                key={`rotate3d-${index}`}
                                                id='rotate3d'
                                                name='rotate3d'
                                                disabled={
                                                    setXValue.filter(
                                                        item => item === true
                                                    ).length === 0 &&
                                                    setYValue.filter(
                                                        item => item === true
                                                    ).length === 0 &&
                                                    setZValue.filter(
                                                        item => item === true
                                                    ).length === 0 &&
                                                    setAngleValue.filter(
                                                        item => item === true
                                                    ).length === 0
                                                }
                                                min='0'
                                                max='100'
                                                data-index={index}
                                                value={`${rotate3dFiltervalue[index]}`}
                                                onChange={event => {
                                                    const updateProperty = map(
                                                        rotate3dState,
                                                        stateArray =>
                                                            filter(
                                                                stateArray,
                                                                item =>
                                                                    item.isSelected
                                                            )[0]
                                                    )[0].property

                                                    handleRotate3DInputChange(
                                                        event,
                                                        index,
                                                        updateProperty
                                                    )

                                                    setRotate3dFilterValue(
                                                        prev =>
                                                            map(
                                                                prev,
                                                                (num, idx) =>
                                                                    `${idx}` ===
                                                                    event.target
                                                                        .dataset
                                                                        .index
                                                                        ? (num =
                                                                              parseInt(
                                                                                  event
                                                                                      .target
                                                                                      .value,
                                                                                  10
                                                                              ))
                                                                        : num
                                                            )
                                                    )
                                                }}
                                            />
                                        </div>
                                        <div className='filter-controls'>
                                            <CheckBox
                                                value={setXValue[index]}
                                                label={'x'}
                                                handleChange={() => {
                                                    changeSetXValue(prev => {
                                                        return updateArrayAtIndex(
                                                            prev,
                                                            index
                                                        )
                                                    })
                                                    changeSetYValue(prev => {
                                                        const newArray = [
                                                            ...prev,
                                                        ]
                                                        newArray[index] = false
                                                        return newArray
                                                    })
                                                    changeSetZValue(prev => {
                                                        const newArray = [
                                                            ...prev,
                                                        ]
                                                        newArray[index] = false
                                                        return newArray
                                                    })
                                                    changeSetAngleValue(
                                                        prev => {
                                                            const newArray = [
                                                                ...prev,
                                                            ]
                                                            newArray[index] =
                                                                false
                                                            return newArray
                                                        }
                                                    )
                                                    setRotate3dFilterValue(
                                                        prev => {
                                                            const newArray = [
                                                                ...prev,
                                                            ]
                                                            newArray[index] = 0
                                                            return newArray
                                                        }
                                                    )
                                                    setCurrentCollageFilterIndex(
                                                        index
                                                    )
                                                }}
                                            />
                                            <CheckBox
                                                value={setYValue[index]}
                                                label={'y'}
                                                handleChange={() => {
                                                    changeSetYValue(prev => {
                                                        return updateArrayAtIndex(
                                                            prev,
                                                            index
                                                        )
                                                    })
                                                    changeSetXValue(prev => {
                                                        const newArray = [
                                                            ...prev,
                                                        ]
                                                        newArray[index] = false
                                                        return newArray
                                                    })
                                                    changeSetZValue(prev => {
                                                        const newArray = [
                                                            ...prev,
                                                        ]
                                                        newArray[index] = false
                                                        return newArray
                                                    })
                                                    changeSetAngleValue(
                                                        prev => {
                                                            const newArray = [
                                                                ...prev,
                                                            ]
                                                            newArray[index] =
                                                                false
                                                            return newArray
                                                        }
                                                    )
                                                    setRotate3dFilterValue(
                                                        prev => {
                                                            const newArray = [
                                                                ...prev,
                                                            ]
                                                            newArray[index] = 0
                                                            return newArray
                                                        }
                                                    )
                                                    setCurrentCollageFilterIndex(
                                                        index
                                                    )
                                                }}
                                            />
                                            <CheckBox
                                                value={setZValue[index]}
                                                label={'z'}
                                                handleChange={() => {
                                                    changeSetZValue(prev => {
                                                        return updateArrayAtIndex(
                                                            prev,
                                                            index
                                                        )
                                                    })
                                                    changeSetYValue(prev => {
                                                        const newArray = [
                                                            ...prev,
                                                        ]
                                                        newArray[index] = false
                                                        return newArray
                                                    })
                                                    changeSetXValue(prev => {
                                                        const newArray = [
                                                            ...prev,
                                                        ]
                                                        newArray[index] = false
                                                        return newArray
                                                    })
                                                    changeSetAngleValue(
                                                        prev => {
                                                            const newArray = [
                                                                ...prev,
                                                            ]
                                                            newArray[index] =
                                                                false
                                                            return newArray
                                                        }
                                                    )
                                                    setRotate3dFilterValue(
                                                        prev => {
                                                            const newArray = [
                                                                ...prev,
                                                            ]
                                                            newArray[index] = 0
                                                            return newArray
                                                        }
                                                    )
                                                    setCurrentCollageFilterIndex(
                                                        index
                                                    )
                                                }}
                                            />
                                            <CheckBox
                                                value={setAngleValue[index]}
                                                label={'angle'}
                                                handleChange={() => {
                                                    changeSetAngleValue(
                                                        prev => {
                                                            return updateArrayAtIndex(
                                                                prev,
                                                                index
                                                            )
                                                        }
                                                    )
                                                    changeSetYValue(prev => {
                                                        const newArray = [
                                                            ...prev,
                                                        ]
                                                        newArray[index] = false
                                                        return newArray
                                                    })
                                                    changeSetXValue(prev => {
                                                        const newArray = [
                                                            ...prev,
                                                        ]
                                                        newArray[index] = false
                                                        return newArray
                                                    })
                                                    changeSetZValue(prev => {
                                                        const newArray = [
                                                            ...prev,
                                                        ]
                                                        newArray[index] = false
                                                        return newArray
                                                    })
                                                    setRotate3dFilterValue(
                                                        prev => {
                                                            const newArray = [
                                                                ...prev,
                                                            ]
                                                            newArray[index] = 0
                                                            return newArray
                                                        }
                                                    )
                                                    setCurrentCollageFilterIndex(
                                                        index
                                                    )
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                                {!includes(doNotRenderList, 'saturate') && (
                                    <div className='range-slider'>
                                        <label>saturate</label>
                                        <input
                                            type='range'
                                            key={`saturate-${index}`}
                                            id='saturate'
                                            name='saturate'
                                            min='0'
                                            max='100'
                                            value={`${
                                                filter(
                                                    filterArray,
                                                    filterObject =>
                                                        filterObject.name ===
                                                        'saturate'
                                                )[0].value
                                            }`}
                                            onChange={event =>
                                                handleInputChange(event, index)
                                            }
                                        />
                                    </div>
                                )}
                                {!includes(doNotRenderList, 'sepia') && (
                                    <div className='range-slider'>
                                        <label>sepia</label>
                                        <input
                                            type='range'
                                            key={`sepia-${index}`}
                                            id='sepia'
                                            name='sepia'
                                            min='0'
                                            max='100'
                                            value={`${
                                                filter(
                                                    filterArray,
                                                    filterObject =>
                                                        filterObject.name ===
                                                        'sepia'
                                                )[0].value
                                            }`}
                                            onChange={event =>
                                                handleInputChange(event, index)
                                            }
                                        />
                                    </div>
                                )}
                                {!includes(doNotRenderList, 'zoom') && (
                                    <div className='range-slider'>
                                        <label>zoom</label>
                                        <input
                                            type='range'
                                            key={`zoom-${index}`}
                                            id='zoom'
                                            name='zoom'
                                            min='1'
                                            max='10'
                                            value={`${
                                                filter(
                                                    filterArray,
                                                    filterObject =>
                                                        filterObject.name ===
                                                        'zoom'
                                                )[0].value as number
                                            }`}
                                            onChange={event =>
                                                handleInputChange(event, index)
                                            }
                                        />
                                    </div>
                                )}
                                <div className='button-wrapper'>
                                    <button
                                        onClick={() =>
                                            handleResetFilters(
                                                index,
                                                !isNull(
                                                    state.collageImageFilters
                                                )
                                            )
                                        }
                                    >
                                        reset
                                    </button>
                                </div>
                            </div>
                        </Fragment>
                    )
                })}
        </>
    )
}

export default hot(module)(Filters)
