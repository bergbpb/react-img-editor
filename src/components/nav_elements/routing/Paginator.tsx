import React, { useContext } from 'react'
import { hot } from 'react-hot-loader/index'
import { isNil } from 'lodash'

import { ActionTypes, AppContext } from '../../../store'

interface Props {
    showPagination: boolean
}

export const Paginator: React.FC<Props> = ({ showPagination }) => {
    const globalState = useContext(AppContext)

    const { dispatch, state } = globalState

    return (
        <div className='paginator-container'>
            {showPagination ? (
                <>
                    <span
                        className='thumb-nail-nav-control'
                        onClick={() =>
                            !isNil(state.activeIndex) &&
                            state.activeIndex >= 0 &&
                            dispatch({
                                type: ActionTypes.SET_ACTIVE_THUMBNAIL_URL,
                                payload: {
                                    activeIndex:
                                        state.activeIndex - 1 < 0
                                            ? 0
                                            : state.activeIndex - 1,
                                },
                            })
                        }
                    >
                        <i className='fa-solid fa-chevron-left' />1
                    </span>

                    <span
                        className='thumb-nail-nav-control'
                        onClick={() =>
                            !isNil(state.activeIndex) &&
                            state.activeIndex > 5 &&
                            dispatch({
                                type: ActionTypes.SET_ACTIVE_THUMBNAIL_URL,
                                payload: { activeIndex: state.activeIndex - 5 },
                            })
                        }
                    >
                        <i className='fa-solid fa-chevron-left' />5
                    </span>

                    <span
                        className='thumb-nail-nav-control'
                        onClick={() =>
                            !isNil(state.activeIndex) &&
                            state.activeIndex > 10 &&
                            dispatch({
                                type: ActionTypes.SET_ACTIVE_THUMBNAIL_URL,
                                payload: {
                                    activeIndex: state.activeIndex - 10,
                                },
                            })
                        }
                    >
                        <i className='fa-solid fa-chevron-left' />
                        10
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

                    <span>&nbsp;•&nbsp;</span>

                    <span
                        className='thumb-nail-nav-control'
                        onClick={() =>
                            dispatch({
                                type: ActionTypes.SET_ACTIVE_THUMBNAIL_URL,
                                payload: {
                                    activeIndex: state.imageData
                                        ? state.imageData.length - 1
                                        : null,
                                },
                            })
                        }
                    >
                        <i className='fa-solid fa-angles-right' />
                    </span>

                    <span
                        className='thumb-nail-nav-control'
                        onClick={() =>
                            !isNil(state.activeIndex) &&
                            state.imageData &&
                            state.activeIndex < state.imageData.length - 10 &&
                            dispatch({
                                type: ActionTypes.SET_ACTIVE_THUMBNAIL_URL,
                                payload: {
                                    activeIndex: state.activeIndex + 10,
                                },
                            })
                        }
                    >
                        10
                        <i className='fa-solid fa-chevron-right' />
                    </span>

                    <span
                        className='thumb-nail-nav-control'
                        onClick={() =>
                            !isNil(state.activeIndex) &&
                            state.imageData &&
                            state.activeIndex < state.imageData.length - 5 &&
                            dispatch({
                                type: ActionTypes.SET_ACTIVE_THUMBNAIL_URL,
                                payload: { activeIndex: state.activeIndex + 5 },
                            })
                        }
                    >
                        5<i className='fa-solid fa-chevron-right' />
                    </span>

                    <span
                        className='thumb-nail-nav-control'
                        onClick={() =>
                            !isNil(state.activeIndex) &&
                            state.imageData &&
                            state.activeIndex < state.imageData.length - 1 &&
                            dispatch({
                                type: ActionTypes.SET_ACTIVE_THUMBNAIL_URL,
                                payload: { activeIndex: state.activeIndex + 1 },
                            })
                        }
                    >
                        1<i className='fa-solid fa-chevron-right' />
                    </span>
                </>
            ) : (
                <></>
            )}
        </div>
    )
}
export default hot(module)(Paginator)
